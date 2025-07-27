import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { County } from '../models/gov/models';
import { StateGeometryService, StateInfo } from './state-geometry.service';

@Injectable({
    providedIn: 'root'
})
export class PositionService implements OnDestroy {
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();

    public filterInProgress$: Subject<boolean> = new BehaviorSubject<boolean>(false);
    private _positionEmitter$: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();

    private readonly _stateEmitter$: Observable<StateInfo> = this._positionEmitter$.pipe(
        this._stateGeometryService.findUSStateAsync(),
        filter((state: StateInfo | null): state is StateInfo => state != null),
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    private _countyEmitter$: Observable<County> = this._stateEmitter$.pipe(
        map((stateInfo: StateInfo) => this.findCounty(stateInfo)),
        filter((county: County | null): county is County => county != null),
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    constructor(private readonly _stateGeometryService: StateGeometryService) { }

    private findCounty(stateInfo: StateInfo): County | null {
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
