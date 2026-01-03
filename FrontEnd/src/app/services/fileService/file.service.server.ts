// app/services/file.service.server.ts
import { Observable, from, pipe, UnaryFunction } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'
import { CountyCSVItem, StateCSVItem } from '../../models/gov/models';
// import { environment } from '../../../environments/environment.prod';
import { IFileService } from './ifile-service';

export class FileServiceServer implements IFileService {
    private readonly _baseUrl: string;
    private statesCache: StateCSVItem[] | null = null;
    private countiesCache: Map<string, CountyCSVItem> = new Map();

    constructor() {
        this._baseUrl = 'http://localhost:5273/api';
    }

    private async fetchStates(): Promise<StateCSVItem[]> {
        if (this.statesCache) return this.statesCache;

        const response = await fetch(`${this._baseUrl}/FileData/states`);
        if (!response.ok) {
            throw new Error(`Failed to fetch states: ${response.statusText}`);
        }
        this.statesCache = await response.json();
        return this.statesCache!;
    }

    private async fetchCounty(stateFip: number, countyFip: string): Promise<CountyCSVItem> {
        const key = `${stateFip}-${countyFip}`;
        if (this.countiesCache.has(key)) {
            return this.countiesCache.get(key)!;
        }

        const response = await fetch(`${this._baseUrl}/FileData/counties/${stateFip}/${countyFip}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch county: ${response.statusText}`);
        }
        const county = await response.json();
        this.countiesCache.set(key, county);
        return county;
    }

    public getStateCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<StateCSVItem | undefined>> {
        return pipe(
            switchMap((fip: string | number) =>
                from(this.fetchStates()).pipe(
                    map(states => states.find(x => x.fip == fip))
                )
            )
        );
    }

    public getCountyCSVItemAsync(): UnaryFunction<Observable<string>, Observable<CountyCSVItem | null>> {
        return pipe(
            switchMap((fip: string) => {
                const stateFip = parseInt(fip.substring(0, 2));
                const countyFip = fip.substring(2);
                return from(this.fetchCounty(stateFip, countyFip)).pipe(
                    map(county => county || null)
                );
            })
        );
    }
}