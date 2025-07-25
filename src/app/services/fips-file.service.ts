import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { from, map, Observable, OperatorFunction, pipe, shareReplay, skip, skipLast, Subject, switchMap, takeUntil, toArray, UnaryFunction } from "rxjs";
import { ExtraInfo } from "../models/gov/models";

@Injectable({
    providedIn: 'root'
})
export class FileService implements OnDestroy {

    private readonly _extraDataJsonUrl: string = 'assets/PLANTS_Extra_Info.csv';
    private readonly _stateCSVUrl: string = 'assets/statesFipsInfo.csv';
    private readonly _countyCSVUrl: string = 'assets/countyInfo.csv';

    private readonly _ngDestroy$: Subject<void> = new Subject<void>();

    private readonly _extraInfo$ : Observable<ExtraInfo[]> = this._client.get(this._extraDataJsonUrl, { responseType: 'text' }).pipe(
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

    private _extraInfo: ExtraInfo[] = [];
    private _states: StateCSVItem[] = [];
    private _counties: CountyCSVItem[] = [];

    public constructor(private readonly _client: HttpClient) {
        // HACK lazy always loaded vibes
        this._states$.subscribe({
            next: (states) => this._states = states
        });

        this._counties$.subscribe({
            next: (counties) => this._counties = counties
        });

        this._extraInfo$.subscribe({
            next: (extraInfo) => this._extraInfo = extraInfo
        });
    }

    private parseExtraInfo(line: string) : ExtraInfo {
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

    public getStateCSVItem(fip: number): StateCSVItem {
        const state: StateCSVItem | undefined = this._states.find((state) => state.fip == fip);
        if (state == undefined)
            throw new Error('Invalid fip given for US state: ' + fip);
        return state;
    }

    public getStateCSVItemByAbbrev(abbrev: string): StateCSVItem | undefined {
        return this._states.find((state) => state.abbrev == abbrev);
    }

    public getCountyCSVItems(stateFip: number): CountyCSVItem[] {
        return this._counties.filter(x => x.stateFip === stateFip);
    }

    public getCountyCSVItem(countyFip: number): CountyCSVItem | undefined {
        return this._counties.find(x => x.countyFip === countyFip);
    }

    public get extraInfo(): ExtraInfo[]{
        return this._extraInfo;
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