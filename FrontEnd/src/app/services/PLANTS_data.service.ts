import { Injectable } from "@angular/core";
import { GrowthHabit, PlantData } from "../models/gov/models";
import { HttpClient } from "@angular/common/http";
import { bufferCount, catchError, defer, from, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
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
        const apiUrl = `${this._dataUrl}/search?searchString=${searchString}&combinedFIP=${combinedFIP}&growthHabit=${growthHabit}`;
        // TODO create batches on the dataService side so i dont have to do complex bs parsing lol
        const batchSize: number = 100;

        return fromFetch(apiUrl).pipe(
            tap(val => console.log(val)),
            // TODO
            switchMap(response => {
                if (!response.ok)
                    throw new Error(response.status + ' | ' + response.statusText);

                const stream: ReadableStream<PlantData> = response.body!.pipeThrough(new TextDecoderStream).pipeThrough(this.ndJsonTransformStream<PlantData>());
                return this.readableStreamToObservable(stream);
            }),
            tap((val) => console.log(val)),
            map((val) => GovPlantsDataService.parsePlantData(val)),
            // TODO use bufferCount for batches?
            bufferCount(batchSize),
            // map((vals) => vals.map(GovPlantsDataService.parsePlantData)),
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

    private readableStreamToObservable<T>(stream: ReadableStream<T>): Observable<T> {
        return defer(() => {
            const reader = stream.getReader();
            async function* gen() {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        console.log(value);
                        yield value;
                    }
                } finally {
                    reader.releaseLock();
                }
            }
            return from(gen());
        });
    }

    private ndJsonTransformStream<R = string>(): TransformStream<string, R> {
        let leftover = '';

        return new TransformStream<string, R>({
            transform(chunk, controller) {
                leftover += chunk;
                const lines = leftover.split('\n');
                leftover = lines.pop()!; // keep last incomplete line

                for (const line of lines) {
                    if (!line.trim()) continue;

                    const value = JSON.parse(line) as R;
                    controller.enqueue(value);
                }
            },
            flush(controller) {
                const line = leftover.trim();
                if (!line) return;

                const value = JSON.parse(line) as R;
                controller.enqueue(value);
            }
        });
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