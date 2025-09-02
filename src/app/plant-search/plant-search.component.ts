import { Component, EventEmitter, Output } from '@angular/core';
import { combineCountyFIP, County, GrowthHabit, LocationCode, PlantData, StateInfo } from '../models/gov/models';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { PositionService } from '../services/position.service';
import { combineLatest, combineLatestWith, debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs';
import { FileService } from '../services/file.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'
import { TranslocoPipe } from '@jsverse/transloco';

export type SortOption = keyof Pick<PlantData, 'commonName' | 'scientificName' | 'symbol' | 'growthHabit'>;

@Component({
  selector: 'plant-search',
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MatSelectModule, TranslocoPipe, UpperCasePipe],
  templateUrl: './plant-search.component.html',
  styleUrl: './plant-search.component.css'
})
export class PlantSearchComponent {
  public growthHabits: GrowthHabit[] = ['Any', 'Forb/herb', 'Graminoid', 'Nonvascular', 'Shrub', 'Subshrub', 'Tree', 'Vine'];
  private _growthHabitEmitter$: Subject<GrowthHabit> = new BehaviorSubject<GrowthHabit>('Any');

  private _isSortOptionAlphabeticOrderEmitter$: Subject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _searchDebounceTime: number = 75;

  private get isSortOptionAlphabeticOrderEmitter$(): Observable<boolean> {
    return this._isSortOptionAlphabeticOrderEmitter$.asObservable();
  }
  private _sortOptionDirection: 'A-Z' | 'Z-A' = 'A-Z';
  public get sortOptionDirection(): 'A-Z' | 'Z-A' {
    return this._sortOptionDirection;
  }

  public toggleSortOptionDirection(): void {
    this._sortOptionDirection = this._sortOptionDirection == 'Z-A' ? 'A-Z' : 'Z-A';
    this._isSortOptionAlphabeticOrderEmitter$.next(this._sortOptionDirection === 'A-Z');
  }

  public sortOptions: SortOption[] = ['commonName', 'scientificName', 'growthHabit'];
  private _sortOptionsEmitter$: Subject<SortOption> = new BehaviorSubject<SortOption>('commonName');
  private get sortOptionsEmitter$(): Observable<SortOption> {
    return this._sortOptionsEmitter$.asObservable();
  }

  private _ngDestroy$: Subject<void> = new Subject<void>();
  public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public _countyName: string = '';
  public get countyName(): string {
    return this._countyName;
  }
  private set countyName(value: string) {
    this._countyName = value;
  }

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
    debounceTime(this._searchDebounceTime),
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
    combineLatestWith(this.sortOptionsEmitter$, this.isSortOptionAlphabeticOrderEmitter$),
    map(([plants, sort, isSortAlphabeticOrder]: [ReadonlyArray<Readonly<PlantData>>, SortOption, boolean]) => {
      return [...plants].sort((x, y) => {
        let xValue, yValue;
        if (sort === 'growthHabit') {
          xValue = x[sort][0];
          yValue = y[sort][0];

        }
        else {
          xValue = x[sort];
          yValue = y[sort];
        }
        const comparison: number = xValue.localeCompare(yValue);
        return isSortAlphabeticOrder ? comparison : -comparison;
      });
    }),
    tap((plants) => {
      this.filteredData.emit(plants);
      this.filterInProgress$.next(false);
    }),
    takeUntil(this._ngDestroy$)
  );

  public get filteredNativePlants$(): Observable<ReadonlyArray<PlantData>> {
    return this._fullyFilteredNativePlants;
  }

  private filterPlantsBySearchString(plants: ReadonlyArray<Readonly<PlantData>>, searchString: string): ReadonlyArray<Readonly<PlantData>> {
    searchString = searchString.toLowerCase();
    return plants.filter(plant => plant.commonName.toLowerCase().includes(searchString) || plant.scientificName.toLowerCase().includes(searchString));
  }

  @Output() public filteredData: EventEmitter<ReadonlyArray<Readonly<PlantData>>> = new EventEmitter();

  public constructor(private readonly _plantService: GovPlantsDataService,
    private readonly _positionService: PositionService,
    private readonly _fileService: FileService) {
    // HACK starts the plant retrieval, sets start value for search bar
    this._fullyFilteredNativePlants.subscribe();
    this._searchStarter$.next('');
    this._sortOptionsEmitter$.next('commonName');

    this._positionService.countyEmitter$.pipe(
      filter((x) => x != null && x != undefined),
      map((x) => combineCountyFIP(x)),
      tap((x) => console.log(x)),
      this._fileService.getCountyCSVItemAsync(),
    ).subscribe({
      next: (value) => {
        console.log(value);
        if (value)
          this.countyName = value.countyName;
      },
      error: err => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
    this._ngDestroy$.complete();
  }

  // TODO swap between user location and specific location // county and state
  // TODO figure out use case when the plant is native to state but has no county data? do i just include all or none for now

  public search(searchValue: string): void {
    this._searchStarter$.next(searchValue);
  }

  public changeSortOption(option: string) {
    this._sortOptionsEmitter$.next(option as SortOption);
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
    return plants.filter(plant => plant.combinedCountyFIPs.some(plantCounty => plantCounty == combineCountyFIP(county)));
  }

}
