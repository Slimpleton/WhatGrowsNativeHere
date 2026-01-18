import { Injectable } from "@angular/core";
import { GrowthHabit, PlantData } from "../models/gov/models";
import { HttpClient } from "@angular/common/http";
import { catchError, map, shareReplay, switchMap } from "rxjs/operators";
import { fromFetch } from 'rxjs/fetch';
import { SortOption } from "../plant-search/plant-search.component";
import { Observable, of } from "rxjs";
import { environment } from "../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class GovPlantsDataService {
    public static readonly usdaGovPlantProfileUrl: string = 'https://plants.usda.gov/plant-profile/';
    private readonly _dataUrl =`${environment.apiUrl}/FileData/plantdata`;

    public constructor(private readonly _http: HttpClient) {
    }

    public getPlantById(acceptedSymbol: string): Observable<Readonly<PlantData>> {
        return this._http.get<PlantData>(this._dataUrl + '/' + acceptedSymbol).pipe(map(GovPlantsDataService.parsePlantData));
    }

    public getAllDefiniteNativePlantIds(): Observable<ReadonlyArray<Readonly<string>>> {
        return this._http.get<string[]>(this._dataUrl + '/id');
    }

    // TODO add batch index param 
    // TODO store url, batch index, and batch in map for in-memory cache

    public searchNativePlantsBatched(searchString: string, combinedFIP: string, growthHabit: GrowthHabit, sortOption: SortOption, isSortAlphabeticOrder: boolean, batchSize: number = 30): Observable<Readonly<PlantData>[]> {
        const apiUrl = `${this._dataUrl}/search?searchString=${searchString}&combinedFIP=${combinedFIP}&growthHabit=${growthHabit}&sortOption=${sortOption}&ascending=${isSortAlphabeticOrder}&batchSize=${batchSize}`;
        return fromFetch(apiUrl).pipe(
            switchMap(response => {
                if (!response.ok)
                    throw new Error(response.status + ' | ' + response.statusText);

                const stream: ReadableStream<PlantData[]> = response.body!.pipeThrough(new TextDecoderStream).pipeThrough(GovPlantsDataService.ndJsonTransformStream<PlantData[]>());
                return GovPlantsDataService.readableStreamToObservable(stream);
            }),
            map((vals: PlantData[]) => vals.map(val => GovPlantsDataService.parsePlantData(val))),
        );
    }

    private static readableStreamToObservable<T>(stream: ReadableStream<T>): Observable<T> {
        return new Observable<T>(subscriber => {
            const reader = stream.getReader();
            let cancelled = false;

            const read = async () => {
                try {
                    while (!cancelled) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        subscriber.next(value);
                    }
                    if (!cancelled) subscriber.complete();
                } catch (err) {
                    if (!cancelled) subscriber.error(err);
                }
            };

            read();

            // teardown called on unsubscribe
            return () => {
                cancelled = true;
                reader.cancel();   // <--- this is the crucial bit
            };
        });
    }

    private static ndJsonTransformStream<R = string>(): TransformStream<string, R> {
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

    public getAllNativePlantDataBatched(): Observable<PlantData[]> {
        const batchSize: number = 50;
        const apiUrl : string =  this._dataUrl + 'batchSize=' + batchSize;
        return fromFetch(apiUrl).pipe(
             switchMap(response => {
                if (!response.ok)
                    throw new Error(response.status + ' | ' + response.statusText);

                const stream: ReadableStream<PlantData[]> = response.body!.pipeThrough(new TextDecoderStream).pipeThrough(GovPlantsDataService.ndJsonTransformStream<PlantData[]>());
                return GovPlantsDataService.readableStreamToObservable(stream);
            }),
            map((vals: PlantData[]) => vals.map(val => GovPlantsDataService.parsePlantData(val))),
        );
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