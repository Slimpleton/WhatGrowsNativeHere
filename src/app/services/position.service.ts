import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { County, GrowthHabit, LocationCode, PlantCompositeData, PlantData, validLocationCodes } from '../models/gov/models';
import { StateGeometryService, StateInfo } from './state-geometry.service';


/**
 * 
 * TODO
 * Not sure whether or not to serve the plant data directly from the position service or just to offer different levels of location data from this service asyncrhonously
 * I think im leaning towards the second option more because its more flexible for using in other queries and better separation of services/ more work tho
 * 
 * ripppity
 * 
 */


@Injectable({
    providedIn: 'root'
})
export class PositionService implements OnDestroy {
    public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);
    private _positionEmitter$: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();
    private _stateEmitter$: Subject<StateInfo> = new Subject<StateInfo>();
    private _nationwideFilterEmitter$: Subject<boolean> = new BehaviorSubject<boolean>(true);

    private readonly _ngDestroy$: Subject<void> = new Subject<void>();
    constructor(private readonly _stateGeometryService: StateGeometryService) { }



    // private _filteredNativePlantsByState$: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    //     this._positionEmitter$.pipe(
    //         map((pos: GeolocationPosition) => this._stateGeometryService.findStateOrProvince(pos.coords.latitude, pos.coords.longitude)),
    //         filter((state: StateInfo | null): state is StateInfo => state != null)),
    //     this._allNativePlants$])
    //     .pipe(
    //         map(([state, plants]) => this.filterForState(state, plants)),
    //         // TODO filter even finer some day
    //         // TODO use state info to filter gbifoccurences ? 
    //         takeUntil(this._ngDestroy$)
    //     );

    // // TODO finish lel
    // private _filteredNativePlantsByCounty$: Observable<ReadonlyArray<Readonly<PlantCompositeData>>> = combineLatest([
    //     this._positionEmitter$.pipe(
    //         map((pos: GeolocationPosition) => this._stateGeometryService.findCounty(pos.coords)),
    //         filter((county: County | null): county is County => county != null)),
    //     this._filteredNativePlantsByState$
    // ]).pipe(
    //     map(([county, plants]: [County, any]) => []),
    //     takeUntil(this._ngDestroy$)
    // );

    // // Using a combineLatest to combine multiple state changes at once for filtering easy
    // private _fullyFilteredNativePlants: Observable<ReadonlyArray<Readonly<PlantData>>> = combineLatest([
    //     this._growthHabitEmitter$,
    //     this._filteredNativePlantsByState$,
    //     this._nationwideFilterEmitter$
    // ]).pipe(
    //     tap(() => this.filterInProgress$.next(true)),
    //     map(
    //         (([growthHabit, plants, includeNationwidePlants]: [GrowthHabit | null, ReadonlyArray<Readonly<PlantData>>, boolean]) => {
    //             const filteredNationwide = this.filterForNationwidePlants(plants, includeNationwidePlants);
    //             return this.filterForGrowthHabit(growthHabit, filteredNationwide);
    //         }),
    //     ),
    //     tap(() => this.filterInProgress$.next(false)),
    //     takeUntil(this._ngDestroy$)
    // );

    // public get filteredNativePlants$(): Observable<ReadonlyArray<PlantData>> {
    //     return this._fullyFilteredNativePlants;
    // }

    // private filterForNationwidePlants(plants: ReadonlyArray<Readonly<PlantData>>, includeNationwidePlants: boolean): ReadonlyArray<Readonly<PlantData>> {
    //     return plants.filter(plant => includeNationwidePlants ? true : (plant.growthHabit.some(x => x == 'Lichenous') ? true : plant.nativeLocationCodes?.size != validLocationCodes.size));
    // }

    // private filterForState(state: StateInfo, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    //     console.log(state.id);
    //     return plants.filter(plant => plant.nativeLocationCodes?.has(state.id as LocationCode));
    // }

    // private filterForGrowthHabit(growthHabit: GrowthHabit | null, plants: ReadonlyArray<Readonly<PlantData>>): ReadonlyArray<Readonly<PlantData>> {
    //     if (growthHabit == 'Any') {
    //         return plants;
    //     }
    //     return plants.filter(plant => plant.growthHabit?.some(x => x == growthHabit));
    // }

    // private emitPosition(position: GeolocationPosition): void {
    //     this._positionEmitter$.next(position);
    // }

    public ngOnDestroy(): void {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
}
