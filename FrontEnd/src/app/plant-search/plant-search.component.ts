import { Component, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { combineCountyFIP, County, CountyCSVItem, GrowthHabit, PlantData } from '../models/gov/models';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { PositionService } from '../services/position.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged, map, tap, switchMap, takeUntil, filter, bufferCount, shareReplay, take } from 'rxjs/operators';
import { combineLatest, merge, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type SortOption = keyof Pick<PlantData, 'commonName' | 'scientificName' | 'symbol'>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'plant-search',
  imports: [TranslocoPipe, UpperCasePipe, AsyncPipe],
  templateUrl: './plant-search.component.html',
  styleUrl: './plant-search.component.css'
})
export class PlantSearchComponent implements OnDestroy {
  public growthHabits: GrowthHabit[] = ['Any', 'Forb/herb', 'Graminoid', 'Nonvascular', 'Shrub', 'Subshrub', 'Tree', 'Vine'];
  private readonly _growthHabitEmitter$: BehaviorSubject<GrowthHabit> = new BehaviorSubject<GrowthHabit>('Any');

  private _isSortOptionAlphabeticOrderEmitter$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _searchDebounceTimeMs: number = 300;

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
  private readonly _sortOptionsEmitter$: BehaviorSubject<SortOption> = new BehaviorSubject<SortOption>('commonName');
  private get sortOptionsEmitter$(): Observable<SortOption> {
    return this._sortOptionsEmitter$.asObservable();
  }

  private readonly _destroy$: Subject<void> = new Subject<void>();
  @Output() public filterInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public _countyName: string = '';
  public get countyName(): string {
    return this._countyName;
  }
  private set countyName(value: string) {
    this._countyName = value;
  }

  @ViewChild('countiesDataList') public readonly countiesDataList!: ElementRef<HTMLDataListElement>;
  public readonly counties$: Observable<CountyCSVItem[]> = this._http.get<CountyCSVItem[]>('/api/counties').pipe(shareReplay({ bufferSize: 1, refCount: true }), takeUntil(this._destroy$));
  public trackCountyByCombinedFIP(county: CountyCSVItem): string {
    return combineCountyFIP(county);
  }

  private readonly _countyLookup$ = this.counties$.pipe(
    map(counties => {
      const map = new Map<string, CountyCSVItem>();
      for (const c of counties) {
        map.set(
          this.getCountyAndStateAbbrev(c),
          c
        );
      }
      return map;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly _searchStarter$: Subject<string> = new BehaviorSubject<string>('');
  private readonly _userSearchStarter$: Subject<string> = new Subject<string>();
  private get userSearchStarter$(): Observable<string> {
    return this._userSearchStarter$.pipe(debounceTime(this._searchDebounceTimeMs));
  }
  private readonly _search$: Observable<string> = merge(this.userSearchStarter$, this._searchStarter$).pipe(distinctUntilChanged(), takeUntil(this._destroy$));

  // Using a combineLatest to combine multiple state changes at once for filtering easy
  // TODO pass in batch size at some point?
  private readonly _fullyFilteredNativePlants: Observable<Readonly<PlantData>[]> = combineLatest([
    this._growthHabitEmitter$,
    this._positionService.countyEmitter$.pipe(map(val => combineCountyFIP(val))),
    this._search$,
    this.sortOptionsEmitter$,
    this.isSortOptionAlphabeticOrderEmitter$
  ]).pipe(
    switchMap(([growthHabit, combinedFIP, searchString, sortOption, isSortAlphabeticOrder]: [GrowthHabit, string, string, SortOption, boolean]) => {
      this.filterInProgress$.next(true);
      return this._plantService.searchNativePlantsBatched(searchString, combinedFIP, growthHabit, sortOption, isSortAlphabeticOrder);
    }),
    tap((plants: Readonly<PlantData>[]) => {
      this.filteredDataBatch.emit(plants);
      this.filterInProgress$.next(false);
    }),
    takeUntil(this._destroy$)
  );

  @Output() public filteredDataBatch: EventEmitter<ReadonlyArray<Readonly<PlantData>>> = new EventEmitter();

  public constructor(private readonly _plantService: GovPlantsDataService,
    private readonly _positionService: PositionService,
    private readonly _http: HttpClient) {
    // HACK starts the plant retrieval, sets start value for search bar
    // TODO change this maybe
    this._positionService.countyEmitter$.pipe(
      filter((x) => x != null && x != undefined),
      switchMap((x) => this._http.get<CountyCSVItem>(`/api/counties/${x.stateFip}/${x.countyFip}`)),
      takeUntil(this._destroy$)
    ).subscribe({
      next: (value) => {
        // TODO fill input dynamically
        // TODO remove countyName thing
        if (value)
          this.countyName = value.countyName;
      },
      error: err => console.error(err),
    });

    this._fullyFilteredNativePlants.subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // TODO swap between user location and specific location // county and state
  // TODO figure out use case when the plant is native to state but has no county data? do i just include all or none for now

  public search(searchValue: string): void {
    this._userSearchStarter$.next(searchValue);
  }

  public changeSortOption(option: string) {
    this._sortOptionsEmitter$.next(option as SortOption);
  }

  public changeGrowthHabit(habit: string) {
    this._growthHabitEmitter$.next(habit as GrowthHabit);
  }

 public handleNameInput(name: string | null): void {
  if (!name) return;

  this._countyLookup$
    .pipe(take(1),takeUntil(this._destroy$))
    .subscribe(map => {
      const county = map.get(name);
      if (!county) return; // TODO get all

      this._positionService.manualCounty = county;
    });
}

  public getCountyAndStateAbbrev(c: CountyCSVItem): string {
    return `${c.countyName} - ${c.stateAbbrev}`;
  }
}

