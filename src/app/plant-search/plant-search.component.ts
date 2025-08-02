import { Component, EventEmitter, Output } from '@angular/core';
import { County, GrowthHabit, LocationCode, PlantData, StateInfo } from '../models/gov/models';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { PositionService } from '../services/position.service';
import { combineLatest, combineLatestWith, debounceTime, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'plant-search',
  imports: [AsyncPipe, NgFor],
  templateUrl: './plant-search.component.html',
  styleUrl: './plant-search.component.css'
})
export class PlantSearchComponent {
  public growthHabits: GrowthHabit[] = ['Any', 'Forb/herb', 'Graminoid', 'Nonvascular', 'Shrub', 'Subshrub', 'Tree', 'Vine'];
  private _growthHabitEmitter$: Subject<GrowthHabit> = new BehaviorSubject<GrowthHabit>('Any');

  private _ngDestroy$: Subject<void> = new Subject<void>();
  public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  private _allNativePlants$: Observable<ReadonlyArray<PlantData>> = this._plantService.loadNativePlantData
    .pipe(takeUntil(this._ngDestroy$));

  private _filteredNativePlantsByState$: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    this._positionService.stateEmitter$,
    this._allNativePlants$])
    .pipe(
      map(([state, plants]: [StateInfo, ReadonlyArray<Readonly<PlantData>>]) => this.filterForState(state, plants)),
      // TODO use state info to filter gbifoccurences ? 
      takeUntil(this._ngDestroy$)
    );

  private _filteredNativePlantsByCounty$: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    this._positionService.countyEmitter$,
    this._filteredNativePlantsByState$
  ]).pipe(
    map(([county, plants]: [County, ReadonlyArray<Readonly<PlantData>>]) => this.filterForCounty(county, plants)),
    takeUntil(this._ngDestroy$)
  );

  private _searchStarter$: Subject<string> = new Subject<string>();
  private _search$: Observable<string> = this._searchStarter$.pipe(
    debounceTime(75),
    distinctUntilChanged(),
    tap((value) => console.log(value)),
  );

  // Using a combineLatest to combine multiple state changes at once for filtering easy
  private _fullyFilteredNativePlants: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    this._growthHabitEmitter$,
    this._filteredNativePlantsByCounty$,
  ]).pipe(
    tap(() => this.filterInProgress$.next(true)),
    map(([growthHabit, plants]: [GrowthHabit | null, ReadonlyArray<Readonly<PlantData>>]) => this.filterForGrowthHabit(growthHabit, plants)),
    combineLatestWith(this._search$),
    map(([plants, searchString]) => this.filterPlantsBySearchString(plants, searchString)),
    tap((plants) => this.filteredData.emit(plants)),
    tap(() => this.filterInProgress$.next(false)),
    takeUntil(this._ngDestroy$)
  );

  public get filteredNativePlants$(): Observable<ReadonlyArray<PlantData>> {
    return this._fullyFilteredNativePlants;
  }

  private filterPlantsBySearchString(plants: ReadonlyArray<Readonly<PlantData>>, searchString: string): ReadonlyArray<Readonly<PlantData>> {

    return plants;
  }

  @Output() public filteredData: EventEmitter<ReadonlyArray<Readonly<PlantData>>> = new EventEmitter();

  public constructor(private readonly _plantService: GovPlantsDataService,
    private readonly _positionService: PositionService,) {
    // HACK starts the plant retrieval, sets start value for search bar
    this._fullyFilteredNativePlants.subscribe();
    this._searchStarter$.next('');
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
    this._ngDestroy$.complete();
  }

  // TODO sorting system, want to be able to sort by common name / scientific name asc / desc
  // TODO swap between user location and specific location // county and state
  // TODO figure out use case when the plant is native to state but has no county data? do i just include all or none for now
  // TODO filtering system, make maybe the thing and above both into the search service??
  // TODO use input output to input unfiltered stuff output filtered stuff and display on the same html?? might work idk

  public search(searchValue: string): void {
    this._searchStarter$.next(searchValue);
  }

  public changeGrowthHabit(habit: string) {
    this._growthHabitEmitter$.next(habit as GrowthHabit);
  }

  private filterForGrowthHabit(growthHabit: GrowthHabit | null, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    if (growthHabit == 'Any') {
      return plants;
    }
    return plants.filter(plant => plant.growthHabit?.some(x => x == growthHabit));
  }

  private filterForState(state: StateInfo, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    return plants.filter(plant => plant.nativeStateAndProvinceCodes?.has(state.abbreviation as LocationCode));
  }

  private filterForCounty(county: County, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    return plants.filter(plant => plant.counties.some(plantCounty => county.FIP == plantCounty.FIP && plantCounty.stateFIP == county.stateFIP));
  }
}
