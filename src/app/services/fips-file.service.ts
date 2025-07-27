import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { combineLatestWith, from, map, Observable, OperatorFunction, pipe, shareReplay, skip, skipLast, Subject, switchMap, takeUntil, toArray, UnaryFunction } from "rxjs";
import { ExtraInfo } from "../models/gov/models";

@Injectable({providedIn: 'root'})
export class FileService implements OnDestroy {
    private readonly _extraDataJsonUrl: string = 'assets/PLANTS_Extra_Info.csv';
    private readonly _stateCSVUrl: string = 'assets/statesFipsInfo.csv';
    private readonly _countyCSVUrl: string = 'assets/countyInfo.csv';
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();

    private readonly _extraInfo$: Observable<ExtraInfo[]> = this._client.get(this._extraDataJsonUrl, { responseType: 'text' }).pipe(
        this.getDataLines(),
        skipLast(1),
        this.parseObject(this.parseExtraInfo),
        toArray(),
        shareReplay(),
        takeUntil(this._ngDestroy$));

    private readonly _states$: Observable<StateCSVItem[]> = this._client.get(this._stateCSVUrl, { responseType: 'text' }).pipe(
        this.getDataLines(),
        this.parseObject(this.parseState),
        toArray(),
        shareReplay(),
        takeUntil(this._ngDestroy$));

    private readonly _counties$: Observable<CountyCSVItem[]> = this._client.get(this._countyCSVUrl, { responseType: 'text' }).pipe(
        this.getDataLines(),
        this.parseObject(this.parseCounty),
        toArray(),
        shareReplay(),
        takeUntil(this._ngDestroy$));

    public get counties$(): Observable<CountyCSVItem[]> {
        return this._counties$;
    }

    public get states$(): Observable<StateCSVItem[]> {
        return this._states$;
    }

    public get extraInfo$(): Observable<ExtraInfo[]> {
        return this._extraInfo$;
    }

    public constructor(private readonly _client: HttpClient) { }

    private parseExtraInfo(line: string): ExtraInfo {
        return JSON.parse(line);
    }

    private parseState(line: string): StateCSVItem {
        const lineValues: string[] = line.split(',');
        return <StateCSVItem>{
            fip: Number.parseInt(lineValues[0]),
            abbrev: lineValues[1],
            name: lineValues[2],
            gnisid: lineValues[3]
        };
    }

    private parseCounty(line: string): CountyCSVItem {
        const lineValues: string[] = line.split(',');
        return <CountyCSVItem>{
            stateAbbrev: lineValues[0],
            stateFip: Number.parseInt(lineValues[1]),
            countyFip: Number.parseInt(lineValues[2]),
            countyName: lineValues[4],
        };
    }

    private getDataLines(): UnaryFunction<Observable<string>, Observable<string>> {
        return pipe(
            switchMap((file: string) => from(file.split('\n'))),
            skip(1));
    }

    private parseObject<T>(parser: (line: string) => T): OperatorFunction<string, T> {
        return map((line: string) => parser(line));
    }


    public getStateCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<StateCSVItem | undefined>> {
        return pipe(
            combineLatestWith(this.states$),
            map(([fip, states]: [number | string, StateCSVItem[]]) => states.find(x => x.fip == fip))
        );
    }

    public getCountyCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<CountyCSVItem | undefined>> {
        return pipe(
            combineLatestWith(this.counties$),
            map(([fip, counties]: [number | string, CountyCSVItem[]]) => counties.find(x => x.countyFip == fip))
        );
    }

    ngOnDestroy(): void {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
}

export interface StateCSVItem {
    fip: number,
    abbrev: string,
    name: string,
    gnisid: string
}

export interface CountyCSVItem {
    stateAbbrev: string,
    stateFip: number,
    countyFip: number,
    countyName: string,
}