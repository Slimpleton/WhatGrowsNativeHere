import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
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
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();

    public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);
    private _positionEmitter$: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();

    private readonly _stateEmitter$: Observable<StateInfo> = this._positionEmitter$.pipe(
        map((pos: GeolocationPosition) => this._stateGeometryService.findStateOrProvince(pos.coords.latitude, pos.coords.longitude)),
        filter((state: StateInfo | null): state is StateInfo => state != null),
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    private _countyEmitter$: Observable<County> = this._stateEmitter$.pipe(
        map((stateInfo: StateInfo) => this.findCounty(stateInfo)),
        filter((county: County | null): county is County => county != null),
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    

    constructor(private readonly _stateGeometryService: StateGeometryService) { }

    findCounty(stateInfo: StateInfo): any {
        throw new Error('Method not implemented.');
    }

    private emitPosition(position: GeolocationPosition): void {
        this._positionEmitter$.next(position);
    }

    public ngOnDestroy(): void {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
}
