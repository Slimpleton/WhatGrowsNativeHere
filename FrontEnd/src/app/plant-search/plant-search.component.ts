import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { combineCountyFIP, GrowthHabit, PlantData } from '../models/gov/models';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { PositionService } from '../services/position.service';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { FileService } from '../services/file.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'
import { TranslocoPipe } from '@jsverse/transloco';

export type SortOption = keyof Pick<PlantData, 'commonName' | 'scientificName' | 'symbol'>;

@Component({
  selector: 'plant-search',
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MatSelectModule, TranslocoPipe, UpperCasePipe],
  templateUrl: './plant-search.component.html',
  styleUrl: './plant-search.component.css'
})
export class PlantSearchComponent implements OnDestroy {
  public growthHabits: GrowthHabit[] = ['Any', 'Forb/herb', 'Graminoid', 'Nonvascular', 'Shrub', 'Subshrub', 'Tree', 'Vine'];
  private _growthHabitEmitter$: Subject<GrowthHabit> = new BehaviorSubject<GrowthHabit>('Any');

  private _isSortOptionAlphabeticOrderEmitter$: Subject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _searchDebounceTime: number = 400;

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

  public sortOptions: SortOption[] = ['commonName', 'scientificName'];
  private _sortOptionsEmitter$: Subject<SortOption> = new BehaviorSubject<SortOption>('commonName');
  private get sortOptionsEmitter$(): Observable<SortOption> {
    return this._sortOptionsEmitter$.asObservable();
  }

  private _ngDestroy$: Subject<void> = new Subject<void>();
  @Output() public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  public _countyName: string = '';
  public get countyName(): string {
    return this._countyName;
  }
  private set countyName(value: string) {
    this._countyName = value;
  }

  private _searchStarter$: Subject<string> = new Subject<string>();
  private _search$: Observable<string> = this._searchStarter$.pipe(
    debounceTime(this._searchDebounceTime),
    distinctUntilChanged(),
    tap((value) => console.log(value)),
  );

  // Using a combineLatest to combine multiple state changes at once for filtering easy
  private _fullyFilteredNativePlants: Observable<Readonly<PlantData>[]> = combineLatest([
    this._growthHabitEmitter$,
    this._positionService.countyEmitter$.pipe(map(val => combineCountyFIP(val))),
    this._search$,
    this.sortOptionsEmitter$,
    this.isSortOptionAlphabeticOrderEmitter$
  ]).pipe(
    tap(() => this.filterInProgress$.next(true)),
    // TODO pass in batch size at some point?
    switchMap(([growthHabit, combinedFIP, searchString, sortOption, isSortAlphabeticOrder]: [GrowthHabit, string, string, SortOption, boolean]) =>
      this._plantService.searchNativePlantsBatched(searchString, combinedFIP, growthHabit, sortOption, isSortAlphabeticOrder)),
    map((plants: Readonly<PlantData>[]) => {
      this.filteredDataBatch.emit(plants);
      this.filterInProgress$.next(false);
      return plants;
    }),
    takeUntil(this._ngDestroy$)
  );

  public get filteredNativePlants$(): Observable<ReadonlyArray<PlantData>> {
    return this._fullyFilteredNativePlants;
  }


  @Output() public filteredDataBatch: EventEmitter<ReadonlyArray<Readonly<PlantData>>> = new EventEmitter();

  public constructor(private readonly _plantService: GovPlantsDataService,
    private readonly _positionService: PositionService,
    private readonly _fileService: FileService) {
    // HACK starts the plant retrieval, sets start value for search bar
    this._positionService.countyEmitter$.pipe(
      filter((x) => x != null && x != undefined),
      map((x) => combineCountyFIP(x)),
      this._fileService.getCountyCSVItemAsync(),
      takeUntil(this._ngDestroy$)
    ).subscribe({
      next: (value) => {
        console.log(value);
        if (value)
          this.countyName = value.countyName;
      },
      error: err => console.error(err),
    });

    this._fullyFilteredNativePlants.subscribe();
    this._searchStarter$.next('');
    this._sortOptionsEmitter$.next('commonName');

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
}
