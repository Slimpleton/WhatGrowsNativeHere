import { Injectable } from "@angular/core";
import { GrowthHabit, PlantData } from "../models/gov/models";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of, shareReplay } from "rxjs";


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
        return this._http.get<PlantData[]>(this._dataUrl + '/search', {
            params: {
                searchString,
                combinedFIP,
                growthHabit,
                batchSize
            }
        }).pipe(map((vals) => vals.map(GovPlantsDataService.parsePlantData)));
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