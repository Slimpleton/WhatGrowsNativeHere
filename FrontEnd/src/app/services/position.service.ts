import { Injectable, OnDestroy } from '@angular/core';
import { filter, merge, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { County, StateInfo } from '../models/gov/models';
import { StateGeometryService } from './state-geometry.service';

@Injectable({
    providedIn: 'root'
})
export class PositionService implements OnDestroy {
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();
    private _positionEmitter$: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();

    private readonly _manualStateSetter$: Subject<StateInfo> = new Subject<StateInfo>();
    public set manualState(value: StateInfo) {
        this._manualStateSetter$.next(value);
    }

    private readonly _manualCountySetter$: Subject<County> = new Subject<County>();
    public set manualCounty(value: County) {
        this._manualCountySetter$.next(value);
    }

    private readonly _stateEmitter$: Observable<StateInfo> = this._positionEmitter$.pipe(
        this._stateGeometryService.findUSStateAsync(),
        filter((state: StateInfo | null): state is StateInfo => state != null),
        takeUntil(this._ngDestroy$));

    public readonly stateEmitter$: Observable<StateInfo> = merge(this._manualStateSetter$, this._stateEmitter$).pipe(
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    private readonly _countyEmitter$: Observable<County> = this._positionEmitter$.pipe(
        this._stateGeometryService.findUSCountyAsync(),
        filter((county: County | null): county is County => county != null),
        takeUntil(this._ngDestroy$));

    public readonly countyEmitter$: Observable<County> = merge(this._manualCountySetter$, this._countyEmitter$).pipe(
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    constructor(private readonly _stateGeometryService: StateGeometryService) {
        if ("geolocation" in navigator)
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => this.emitPosition(position), (err) => { console.error(err) });
        // TODO geolocation.watchPosition is a handler fcn register that gets updates use in future maybe ?? prob not tho
    }

    private emitPosition(position: GeolocationPosition): void {
        this._positionEmitter$.next(position);
    }

    public ngOnDestroy(): void {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
}
