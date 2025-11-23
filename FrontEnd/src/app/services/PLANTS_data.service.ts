import { inject, Injectable } from "@angular/core";
import { PlantData, Season } from "../models/gov/models";
import { HttpClient } from "@angular/common/http";
import { ResolveFn } from "@angular/router";
import { catchError, map, Observable, of, shareReplay, tap } from "rxjs";

export const csvResolver: ResolveFn<ReadonlyArray<Readonly<PlantData>>> = () => {
    return inject(GovPlantsDataService).loadNativePlantData;
};

@Injectable({
    providedIn: 'root'
})
export class GovPlantsDataService {
    public static usdaGovPlantProfileUrl: string = 'https://plants.usda.gov/plant-profile/';
    private readonly dataUrl = 'api/FileData/plantdata';
    private static readonly MINIMUM_SPECIES_NAME_WORDS = 2;

    public constructor(private readonly http: HttpClient) {
    }

    public getPlantById(acceptedSymbol: string): Observable<Readonly<PlantData>> {
        return this.loadNativePlantData.pipe(
            map((value: ReadonlyArray<Readonly<PlantData>>) => {
                const plant = value.find((x) => x.acceptedSymbol == acceptedSymbol);
                if (plant == undefined)
                    throw new Error('Failed to find plant using symbol ' + acceptedSymbol);
                return plant;
            })
        );
    }

    public getAllDefiniteNativePlantIds(): Observable<ReadonlyArray<Readonly<string>>> {
        return this.loadNativePlantData.pipe(
            map((value: ReadonlyArray<Readonly<PlantData>>) => value.map(val => val.acceptedSymbol)),
        );
    }

    public get loadNativePlantData(): Observable<ReadonlyArray<Readonly<PlantData>>> {
        return this.nativePlantData.pipe(
            shareReplay(1),
            catchError(error => {
                console.error('Error loading definite native plant data:', error);
                return of([] as ReadonlyArray<PlantData>);
            }));
    }

    private nativePlantData = this.getRecordsFromCSV().pipe(
        // Filters out non species listings
        map((plantData: Readonly<PlantData>[]) => {
            const speciesGroups = new Map<string, PlantData[]>();
            const result: Readonly<PlantData>[] = [];

            // Group by base species name
            plantData.forEach(plant => {
                const words: string[] | null = plant.scientificName?.split(/\s+/);
                if (words?.length >= GovPlantsDataService.MINIMUM_SPECIES_NAME_WORDS) {
                    const baseSpecies = `${words[0]} ${words[1]}`;
                    if (!speciesGroups.has(baseSpecies)) {
                        speciesGroups.set(baseSpecies, []);
                    }
                    speciesGroups.get(baseSpecies)!.push(plant);
                }
            });

            // For each species group, decide what to keep
            speciesGroups.forEach(group => {
                const subspeciesEntries = group.filter(plant => /\b(subsp\.|var\.|f\.)\b/.test(plant.scientificName));

                if (subspeciesEntries.length > 0) {
                    // Keep subspecies, exclude base species
                    result.push(...subspeciesEntries);
                } else {
                    // No subspecies exist, keep everything in the group
                    result.push(...group);
                }
            });

            return Object.freeze(result);
        }),
        // tap((val) => console.log(val)),
        // map((plantData: Readonly<PlantData>[]) => Object.freeze(plantData)),
        shareReplay(1),
    );


    public getAllNativePlantIds(): Observable<Readonly<string[]>> {
        return this.loadNativePlantData.pipe(map((plantData: ReadonlyArray<Readonly<PlantData>>) => plantData.map(x => x.acceptedSymbol)));
    }

    /**
     * HACK use this for testing to see if the native ranges are correct without parsing into plant data / aka native plant range conversion
     * @returns 
     */
    private getRecordsFromCSV(): Observable<PlantData[]> {
        return this.http.get<PlantData[]>(this.dataUrl).pipe(
            map(rawPlants => rawPlants.map(raw => ({
                ...raw,
                nativeStateAndProvinceCodes: new Set(raw.nativeStateAndProvinceCodes ?? []),
                growthHabit: new Set(raw.growthHabit ?? []),
                duration: new Set(raw.duration ?? []),
                stateAndProvince: new Set(raw.stateAndProvince ?? []),
            }))),
        );
    }


    parseActiveGrowthPeriod(value: string): ReadonlyArray<Season> {
        return Object.freeze(
            value.split(',').flatMap(
                (value: string) => value.split(' and ').map(v => v.trim() as Season)));
    }
}