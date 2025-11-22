import { inject, Injectable } from "@angular/core";
import {  PlantData } from "../models/gov/models";
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
    private readonly _headerMapping: Record<string, keyof PlantData> = {
        "Accepted Symbol": "acceptedSymbol",
        "Synonym Symbol": "synonymSymbol",
        "Symbol": "symbol",
        "Scientific Name": "scientificName",
        "PLANTS Floristic Area": "plantsFloristicArea",
        "State and Province": "stateAndProvince",
        "Category": "category",
        "Family": "family",
        "Duration": "duration",
        "Growth Habit": "growthHabit",
        "Native Status": "nativeStateAndProvinceCodes",
        "Characteristics Data": "characteristicsData",
        "Active Growth Period": "activeGrowthPeriod",
        "After Harvest Regrowth Rate": "afterHarvestRegrowthRate",
        "Bloat": "bloat",
        "C:N Ratio": "cnRatio",
        "Coppice Potential": "coppicePotential",
        "Fall Conspicuous": "fallConspicuous",
        "Fire Resistance": "fireResistance",
        "Flower Color": "flowerColor",
        "Flower Conspicuous": "flowerConspicuous",
        "Foliage Color": "foliageColor",
        "Foliage Porosity Summer": "foliagePorositySummer",
        "Foliage Porosity Winter": "foliagePorosityWinter",
        "Foliage Texture": "foliageTexture",
        "Fruit Color": "fruitColor",
        "Fruit Conspicuous": "fruitConspicuous",
        "Growth Form": "growthForm",
        "Growth Rate": "growthRate",
        "Height at Base Age, Maximum (feet)": "heightAtBaseAgeMaximumFeet",
        "Height, Mature (feet)": "heightMatureFeet",
        "Known Allelopath": "knownAllelopath",
        "Leaf Retention": "leafRetention",
        "Lifespan": "lifespan",
        "Low Growing Grass": "lowGrowingGrass",
        "Nitrogen Fixation": "nitrogenFixation",
        "Resprout Ability": "resproutAbility",
        "Shape and Orientation": "shapeAndOrientation",
        "Toxicity": "toxicity",
        "Adapted to Coarse Textured Soils": "adaptedToCoarseTexturedSoils",
        "Adapted to Medium Textured Soils": "adaptedToMediumTexturedSoils",
        "Adapted to Fine Textured Soils": "adaptedToFineTexturedSoils",
        "Anaerobic Tolerance": "anaerobicTolerance",
        "CaCO<SUB>3</SUB> Tolerance": "caco3Tolerance",
        "Cold Stratification Required": "coldStratificationRequired",
        "Drought Tolerance": "droughtTolerance",
        "Fertility Requirement": "fertilityRequirement",
        "Fire Tolerance": "fireTolerance",
        "Frost Free Days, Minimum": "frostFreeDaysMinimum",
        "Hedge Tolerance": "hedgeTolerance",
        "Moisture Use": "moistureUse",
        "pH (Minimum)": "phMinimum",
        "pH (Maximum)": "phMaximum",
        "Planting Density per Acre, Minimum": "plantingDensityPerAcreMinimum",
        "Planting Density per Acre, Maximum": "plantingDensityPerAcreMaximum",
        "Precipitation (Minimum)": "precipitationMinimum",
        "Precipitation (Maximum)": "precipitationMaximum",
        "Root Depth, Minimum (inches)": "rootDepthMinimumInches",
        "Salinity Tolerance": "salinityTolerance",
        "Shade Tolerance": "shadeTolerance",
        "Temperature, Minimum (°F)": "temperatureMinimumF",
        "Bloom Period": "bloomPeriod",
        "Commercial Availability": "commercialAvailability",
        "Fruit/Seed Abundance": "fruitSeedAbundance",
        "Fruit/Seed Period Begin": "fruitSeedPeriodBegin",
        "Fruit/Seed Period End": "fruitSeedPeriodEnd",
        "Fruit/Seed Persistence": "fruitSeedPersistence",
        "Propogated by Bare Root": "propogatedByBareRoot",
        "Propogated by Bulbs": "propogatedByBulbs",
        "Propogated by Container": "propogatedByContainer",
        "Propogated by Corms": "propogatedByCorms",
        "Propogated by Cuttings": "propogatedByCuttings",
        "Propogated by Seed": "propogatedBySeed",
        "Propogated by Sod": "propogatedBySod",
        "Propogated by Sprigs": "propogatedBySprigs",
        "Propogated by Tubers": "propogatedByTubers",
        "Seeds per Pound": "seedsPerPound",
        "Seed Spread Rate": "seedSpreadRate",
        "Seedling Vigor": "seedlingVigor",
        "Small Grain": "smallGrain",
        "Vegetative Spread Rate": "vegetativeSpreadRate",
        "Berry/Nut/Seed Product": "berryNutSeedProduct",
        "Christmas Tree Product": "christmasTreeProduct",
        "Fodder Product": "fodderProduct",
        "Fuelwood Product": "fuelwoodProduct",
        "Lumber Product": "lumberProduct",
        "Naval Store Product": "navalStoreProduct",
        "Nursery Stock Product": "nurseryStockProduct",
        "Palatable Browse Animal": "palatableBrowseAnimal",
        "Palatable Graze Animal": "palatableGrazeAnimal",
        "Palatable Human": "palatableHuman",
        "Post Product": "postProduct",
        "Protein Potential": "proteinPotential",
        "Pulpwood Product": "pulpwoodProduct",
        "Veneer Product": "veneerProduct"
    };

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

    private nativePlantData = this.getPlantData().pipe(
        tap((value) => console.log(value)),
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

            return result;
        }),
        map((plantData: Readonly<PlantData>[]) => plantData.filter(plantDatum => plantDatum.nativeStateAndProvinceCodes.size > 0
            && !plantDatum.growthHabit.includes('Lichenous'))),
        // Return as a deeply immutable array
        map((plantData: Readonly<PlantData>[]) => Object.freeze(plantData)),
        tap((value) => console.log(value)),
        shareReplay(1),
    );


    public getAllNativePlantIds(): Observable<Readonly<string[]>> {
        return this.loadNativePlantData.pipe(map((plantData: ReadonlyArray<Readonly<PlantData>>) => plantData.map(x => x.acceptedSymbol)));
    }

    /**
     * HACK use this for testing to see if the native ranges are correct without parsing into plant data / aka native plant range conversion
     * @returns 
     */
    private getPlantData(): Observable<PlantData[]> {
        return this.http.get<PlantData[]>(this.dataUrl);
    }
  
}