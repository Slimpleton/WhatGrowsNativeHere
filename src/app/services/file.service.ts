import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { combineLatestWith, from, map, Observable, OperatorFunction, pipe, reduce, shareReplay, skip, Subject, switchMap, takeUntil, toArray, UnaryFunction } from "rxjs";
import { CountyCSVItem, ExtraInfo, StateCSVItem } from "../models/gov/models";

@Injectable({ providedIn: 'root' })
export class FileService implements OnDestroy {
    private readonly _extraDataCSVUrl: string = 'assets/PLANTS_EXTRA_DATA.csv';
    private readonly _stateCSVUrl: string = 'assets/statesFipsInfo.csv';
    private readonly _countyCSVUrl: string = 'assets/countyInfo.csv';
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();

    private readonly _extraInfo$: Observable<Map<string, ExtraInfo>> = this._client.get(this._extraDataCSVUrl, { responseType: 'text' }).pipe(
        this.getDataLines(),
        this.parseMap(),
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

    public get extraInfo$(): Observable<Map<string, ExtraInfo>> {
        return this._extraInfo$;
    }

    public constructor(private readonly _client: HttpClient) { }

    private parseState(line: string): StateCSVItem {
        const lineValues: string[] = line.split(',', 4);
        return <StateCSVItem>{
            fip: Number.parseInt(lineValues[0]),
            abbrev: lineValues[1],
            name: lineValues[2],
            gnisid: lineValues[3]
        };
    }

    private parseCounty(line: string): CountyCSVItem {
        const lineValues: string[] = line.split(',', 5);
        console.log(lineValues);
        return <CountyCSVItem>{
            stateAbbrev: lineValues[0],
            stateFip: Number.parseInt(lineValues[1]),
            countyFip: lineValues[2],
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

    private parseMap(): OperatorFunction<string, Map<string, ExtraInfo>> {
        return reduce((map, line) => {
            const lineValues = line.split(',');
            const info = <ExtraInfo>{
                commonName: this.parseValue(lineValues[1]),
                combinedFIPs: this.parseValue(lineValues[2])?.split('|') ?? [],
            };
            return map.set(this.parseValue(lineValues[0]), info);
        }, new Map<string, ExtraInfo>());
    }

    private parseValue(value: string): string {
        return value?.substring(1, value.length - 1);
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
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
}