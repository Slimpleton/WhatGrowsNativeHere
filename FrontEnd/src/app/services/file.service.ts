import { Injectable, OnDestroy } from "@angular/core";
import { combineLatestWith, map, Observable, pipe, shareReplay, Subject, takeUntil, UnaryFunction } from "rxjs";
import { CountyCSVItem, StateCSVItem } from "../models/gov/models";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class FileService implements OnDestroy {
    private readonly _destroy$: Subject<void> = new Subject<void>();
    private readonly _baseUrl: string = 'api/FileData/';
    private readonly _stateUrl: string = this._baseUrl + 'states';
    private readonly _countyUrl: string = this._baseUrl + 'counties';

    public constructor(private readonly _client: HttpClient) { }

    private readonly _states$: Observable<StateCSVItem[]> = this._client.get<StateCSVItem[]>(this._stateUrl).pipe(
        shareReplay(),
        takeUntil(this._destroy$));

    private readonly _counties$: Observable<CountyCSVItem[]> = this._client.get<CountyCSVItem[]>(this._countyUrl).pipe(
        shareReplay(),
        takeUntil(this._destroy$));

    public get counties$(): Observable<CountyCSVItem[]> {
        return this._counties$;
    }

    public get states$(): Observable<StateCSVItem[]> {
        return this._states$;
    }

    public getStateCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<StateCSVItem | undefined>> {
        return pipe(
            combineLatestWith(this.states$),
            map(([fip, states]: [number | string, StateCSVItem[]]) => states.find(x => x.fip == fip))
        );
    }

    public getCountyCSVItemAsync(): UnaryFunction<Observable<string>, Observable<CountyCSVItem | undefined>> {
        return pipe(
            combineLatestWith(this.counties$),
            // tap(([_, counties]) => console.log(counties)),
            map(([fip, counties]: [string, CountyCSVItem[]]) => {
                const stateFip = parseInt(fip.substring(0, 2));
                const countyFip = fip.substring(2);
                return counties.find(x => x.countyFip == countyFip && x.stateFip == stateFip);
            })
        );
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }
}