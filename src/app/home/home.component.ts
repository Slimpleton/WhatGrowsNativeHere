import { Component, OnDestroy, OnInit } from '@angular/core';
import { GbifService } from '../services/gbif.service';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import { GbifOccurrence } from '../models/gbif/gbif.occurrence';
import { County, LocationCode, PlantData, StateInfo, validLocationCodes } from '../models/gov/models';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { StateGeometryService } from '../services/state-geometry.service';
import { GrowthHabit } from '../models/gov/models';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule } from '@angular/material/grid-list';
import { PositionService } from '../services/position.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ScrollingModule, NgFor, MatGridListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private _ngDestroy$: Subject<void> = new Subject<void>();
  private _positionEmitter$: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();
  private _growthHabitEmitter$: Subject<GrowthHabit> = new BehaviorSubject<GrowthHabit>('Any');
  private _nationwideFilterEmitter$: Subject<boolean> = new BehaviorSubject<boolean>(true);
  public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public growthHabits: GrowthHabit[] = ['Any', 'Forb/herb', 'Graminoid', 'Nonvascular', 'Shrub', 'Subshrub', 'Tree', 'Vine'];
  public usdaGovPlantProfileUrl: string = this._plantService.usdaGovPlantProfileUrl;

  private _allNativePlants$: Observable<ReadonlyArray<PlantData>> = this._plantService.loadAllDefiniteNativePlantData()
    .pipe(
      takeUntil(this._ngDestroy$)
    );


  /**
   * Begin positoin service point lel
   */
  // TODO switch to plantcompositedata
  private _filteredNativePlantsByState$: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    this._positionService.stateEmitter$,
    this._allNativePlants$])
    .pipe(
      map(([state, plants]) => this.filterForState(state, plants)),
      // TODO use state info to filter gbifoccurences ? 
      takeUntil(this._ngDestroy$)
    );

  // TODO finish lel
  private _filteredNativePlantsByCounty$: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    this._positionService.countyEmitter$,
    this._filteredNativePlantsByState$
  ]).pipe(
    map(([county, plants]: [County, any]) => []),
    takeUntil(this._ngDestroy$)
  );

  // Using a combineLatest to combine multiple state changes at once for filtering easy
  private _fullyFilteredNativePlants: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    this._growthHabitEmitter$,
    this._filteredNativePlantsByState$,
    this._nationwideFilterEmitter$
  ]).pipe(
    tap(() => this.filterInProgress$.next(true)),
    map(
      (([growthHabit, plants, includeNationwidePlants]: [GrowthHabit | null, ReadonlyArray<Readonly<PlantData>>, boolean]) => {
        const filteredNationwide = this.filterForNationwidePlants(plants, includeNationwidePlants);
        return this.filterForGrowthHabit(growthHabit, filteredNationwide);
      }),
    ),
    tap(() => this.filterInProgress$.next(false)),
    takeUntil(this._ngDestroy$)
  );

  public get filteredNativePlants$(): Observable<ReadonlyArray<PlantData>> {
    return this._fullyFilteredNativePlants;
  }

  /**
   * end pos service maybe lel
   */

  private _lastUnfilteredSearch$: Subject<GbifOccurrence[]> = new Subject<GbifOccurrence[]>();
  private _lastSearch$: Observable<GbifOccurrence[]> = this._lastUnfilteredSearch$.pipe(
    //HACK gets all the non copies of plants
    map((values) => {
      const plantMap: Map<string, GbifOccurrence> = new Map<string, GbifOccurrence>()
      values?.map((value: GbifOccurrence) => plantMap.set(value.species, value));
      return ([...plantMap.values()] as GbifOccurrence[]);
    }),
    map((values) => values.sort((x, y) => x.acceptedScientificName.localeCompare(y.acceptedScientificName))),
    // tap((values) => console.log('without duplicates', values)),
    // switchMap((values) => from(values)),
    // // tap((occurrence) => {
    // //   this._gbifService.searchLiterature(occurrence.speciesKey).subscribe((value) => console.log(value));
    // // }),
    // // switchMap((occurrence: GbifOccurrence) => forkJoin([of(occurrence), this._gbifService.isNativeSpecies(occurrence.speciesKey)])),
    // // filter((value: [GbifOccurrence, boolean]) => value[1]),
    // // map((value: [GbifOccurrence, boolean]) => value[0]),
    // reduce((aggregate: GbifOccurrence[], current: GbifOccurrence) => {
    //   aggregate.push(current);
    //   return aggregate;
    // }, [] as GbifOccurrence[]),

    // TODO search each species to ensure its native somehow using gbif service again
    // TODO the socal area used to belong to the tongva people. visit the tongva community garden in pomona to learn more
    shareReplay(1)
  );

  public get lastSearch$(): Observable<GbifOccurrence[]> {
    return this._lastSearch$;
  }

  // PRIORITIES 

  // LOW 
  // TODO make a json reader for the plant_list_2024012.json.gz aka zenodo.org records low prior because no occurence / nativity data
  // HACK theres also a sql file if im lazy and i want to query against a db but that feels.... unnecessary

  // MEDIUM 
  // TODO possibly use webcrawlers to gather information about local flora using more local websites?? low priority
  // TODO make a calflora service cuz their db is extensive possibly with many records
  // TODO on search, might be cool to scrape the web for results on most common name associated with scientific name if i cant find an official mapping 

  // HIGH 
  // TODO make a reader for the gbif occurrence download records
  // HACK the plant list json / sql would probably have common name mappings
  // TODO use d3-geo and us-atlas to display maps of the geo locations
  // Maps are drawn on canvas btw its not like ur unfamiliar with it
  // TODO use d3-geo / us-atlas maps to display gbif occurence data and other occurence data??? 
  // TODO use inaturalist api for occurrences as well, research grade only, use for occurrences because its community driven
  // https://explorer.natureserve.org/api-docs/#_species_search OnlyNatives for locationCriteria will get only the native species we search !! might have some info on occurrences here too not sure could also get a combined accurate record of native plants 
  // TODO trefle api has open source botanical indexed plants and stuff too, probably use for occurrences because native declaration is weak

  // HIGHEST 
  // Create web scraper to scrape the downloads from the boostrap modal that contains the county information 
  // Remove some of the plants where native data is unsure aka on site it might say not in pfa


  public constructor(
    private readonly _gbifService: GbifService,
    private readonly _plantService: GovPlantsDataService,
    private readonly _stateGeometryService: StateGeometryService,
    private readonly _positionService: PositionService,
  ) { }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
    this._ngDestroy$.complete();
  }

  ngOnInit(): void {
    // Load plant data and share the result to avoid multiple HTTP requests
    this._allNativePlants$.subscribe({
      error: err => console.error(err)
    });

    // // todo fix magic number for counties??
    // this._gbifService.getUSAStateCounties(5).subscribe({
    //   next: (value) => console.log(value),
    //   error: err => console.error(err)
    // });

    // this._positionEmitter$.pipe(
    //   switchMap((pos: GeolocationPosition) => this._gbifService.searchNativePlants(pos.coords.latitude, pos.coords.longitude)),
    // ).subscribe({
    //   next: (value: GbifOccurrence[]) => {
    //     this._lastUnfilteredSearch$.next(value);
    //   },
    //   error: err => console.error(err)
    // });
  }

  public changeGrowthHabit(event: any) {
    const target = event.target as HTMLSelectElement;
    this._growthHabitEmitter$.next(target.value as GrowthHabit);
  }
  public setNationwideFilter(event: any) {
    const target = event.target as HTMLInputElement;
    this._nationwideFilterEmitter$.next(target.checked as boolean);
  }

  private filterForGrowthHabit(growthHabit: GrowthHabit | null, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    if (growthHabit == 'Any') {
      return plants;
    }
    return plants.filter(plant => plant.growthHabit?.some(x => x == growthHabit));
  }

  private filterForNationwidePlants(plants: ReadonlyArray<Readonly<PlantData>>, includeNationwidePlants: boolean): ReadonlyArray<Readonly<PlantData>> {
    return plants.filter(plant => includeNationwidePlants ? true : (plant.growthHabit.some(x => x == 'Lichenous') ? true : plant.nativeStateAndProvinceCodes?.size != validLocationCodes.size));
  }

  private filterForState(state: StateInfo, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    console.log(state.abbreviation, state.fip);
    return plants.filter(plant => plant.nativeStateAndProvinceCodes?.has(state.abbreviation as LocationCode));
  }

  // private emitPosition(position: GeolocationPosition): void {
  //   this._positionEmitter$.next(position);
  // }
}
