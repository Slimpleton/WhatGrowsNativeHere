import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { filter, map, merge, Observable, shareReplay, Subject, switchMap, takeUntil } from 'rxjs';
import { County, StateInfo } from '../models/gov/models';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PositionService implements OnDestroy {
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();
    private _positionEmitter$: Subject<GeolocationPosition> = new Subject<GeolocationPosition>();
    private get positionEmitter$(): Observable<GeolocationPosition> {
        return this._positionEmitter$.asObservable().pipe(filter(x => x != undefined));
    }

    private readonly _manualStateSetter$: Subject<StateInfo> = new Subject<StateInfo>();
    public set manualState(value: StateInfo) {
        this._manualStateSetter$.next(value);
    }

    private readonly _manualCountySetter$: Subject<County> = new Subject<County>();
    public set manualCounty(value: County) {
        this._manualCountySetter$.next(value);
    }

    private readonly _stateEmitter$: Observable<StateInfo> = this.positionEmitter$.pipe(
        switchMap((position: GeolocationPosition) =>
            this._http.post<{ state: StateInfo | null }>('/api/geolocation/state', [position.coords.longitude, position.coords.latitude]).pipe(map(response => response.state))),
        filter((state: StateInfo | null): state is StateInfo => state != null),
        takeUntil(this._ngDestroy$));

    public readonly stateEmitter$: Observable<StateInfo> = merge(this._manualStateSetter$, this._stateEmitter$).pipe(
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    private readonly _countyEmitter$: Observable<County> = this.positionEmitter$.pipe(
        switchMap((position: GeolocationPosition) =>
            this._http.post<{ county: County | null }>('/api/geolocation/county', [position.coords.longitude, position.coords.latitude]).pipe(map(response => response.county))),
        filter((county: County | null): county is County => county != null),
        takeUntil(this._ngDestroy$));

    public readonly countyEmitter$: Observable<County> = merge(this._manualCountySetter$, this._countyEmitter$).pipe(
        shareReplay(1),
        takeUntil(this._ngDestroy$));

    constructor(private readonly _http: HttpClient,
        @Inject(PLATFORM_ID) private readonly _platformId: object
    ) {
        if (isPlatformBrowser(this._platformId) && "geolocation" in navigator)
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
