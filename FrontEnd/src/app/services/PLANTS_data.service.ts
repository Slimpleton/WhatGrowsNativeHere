import { Injectable } from "@angular/core";
import { GrowthHabit, PlantData } from "../models/gov/models";
import { HttpClient } from "@angular/common/http";
import { catchError, map, mergeMap, Observable, of, shareReplay, tap } from "rxjs";
import { fromFetch } from 'rxjs/fetch';


@Injectable({
    providedIn: 'root'
})
export class GovPlantsDataService {
    public static readonly usdaGovPlantProfileUrl: string = 'https://plants.usda.gov/plant-profile/';
    private readonly _dataUrl = 'api/FileData/plantdata';

    public constructor(private readonly _http: HttpClient) {
    }

    public getPlantById(acceptedSymbol: string): Observable<Readonly<PlantData>> {
        return this._http.get<PlantData>(this._dataUrl + '/' + acceptedSymbol).pipe(map(GovPlantsDataService.parsePlantData));
    }

    public getAllDefiniteNativePlantIds(): Observable<ReadonlyArray<Readonly<string>>> {
        return this._http.get<string[]>(this._dataUrl + '/id');
    }

    // TODO add batch size param
    public searchNativePlantsBatched(searchString: string, combinedFIP: string, growthHabit: GrowthHabit): Observable<readonly PlantData[]> {
        const batchSize: number = 100;
        const apiUrl = `${this._dataUrl}/search?searchString=${searchString}&combinedFIP=${combinedFIP}&growthHabit=${growthHabit}&batchSize=${batchSize}`;
        let batches : PlantData[] = new Array(batchSize);

        // TODO have to use fromFetch and parse line by line/ batch by batch. idk how to split the batches tho
        // TODO how to read the batches and shit idk man this is tough
        return fromFetch(apiUrl).pipe(
            mergeMap(async response => {
                if(!response.ok)
                    throw new Error(response.status + ' | ' + response.statusText);

                const reader = response.body!.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                batches = new Array(batchSize);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    const chunks = buffer.split('\n');
                    buffer = chunks.pop()!;

                    for (const chunk of chunks) {
                        if (chunk.trim().length > 0) {
                            batches.push(JSON.parse(chunk));
                        }
                    }
                }

                return batches;
            }),
            map((vals) => vals.map(GovPlantsDataService.parsePlantData)),
            tap((val) => console.log(val)),

        );
        // return this._http.get<PlantData[]>(this._dataUrl + '/search', {
        //     params: {
        //         searchString,
        //         combinedFIP,
        //         growthHabit,
        //         batchSize
        //     },
        //     responseType: 'text'

        // }).pipe(
        //     mergeMap(text => {

        //     })
        //     map((vals) => vals.map(GovPlantsDataService.parsePlantData)));
    }

    public get loadNativePlantData(): Observable<ReadonlyArray<Readonly<PlantData>>> {
        return this.getAllNativePlantData().pipe(
            shareReplay(1),
            catchError(error => {
                console.error('Error loading definite native plant data:', error);
                return of([] as ReadonlyArray<PlantData>);
            }));
    }

    /**
     * HACK use this for testing to see if the native ranges are correct without parsing into plant data / aka native plant range conversion
     * @returns 
     */
    private getAllNativePlantData(): Observable<PlantData[]> {
        return this._http.get<PlantData[]>(this._dataUrl).pipe(map(rawPlants => rawPlants.map(GovPlantsDataService.parsePlantData)));
    }

    private static parsePlantData(raw: PlantData) {
        return Object.freeze({
            ...raw,
            nativeStateAndProvinceCodes: new Set(raw.nativeStateAndProvinceCodes ?? []),
            growthHabit: new Set(raw.growthHabit ?? []),
            duration: new Set(raw.duration ?? []),
            stateAndProvince: new Set(raw.stateAndProvince ?? []),
        })
    }
}