import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { combineLatestWith, filter, from, map, Observable, OperatorFunction, pipe, reduce, scan, shareReplay, skip, Subject, switchMap, takeUntil, tap, toArray, UnaryFunction } from "rxjs";
import { County, CountyCSVItem, ExtraInfo, StateCSVItem } from "../models/gov/models";

@Injectable({ providedIn: 'root' })
export class FileService implements OnDestroy {
    private readonly _extraDataJsonUrl: string = 'assets/PLANTS_EXTRA_DATA.json';
    private readonly _stateCSVUrl: string = 'assets/statesFipsInfo.csv';
    private readonly _countyCSVUrl: string = 'assets/countyInfo.csv';
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();

    private readonly _JSON_OBJECT_START = `{"symbol":"`;
    private readonly _JSON_OBJECT_GAP_1 = `","commonName":"`;

    private readonly _extraInfo$: Observable<Map<string, ExtraInfo>> = this._client.get(this._extraDataJsonUrl, { responseType: 'text' }).pipe(
        this.getDataLines(),
        filter((x) => x != '' && x != ']' && x != '\r\n' && x != '\r'),
        reduce((map: Map<string, ExtraInfo>, line: string) => {
            let reducedLine = line.substring(this._JSON_OBJECT_START.length, line.length - 3);

            let quotationIndex = reducedLine.indexOf('"');
            const symbol = reducedLine.substring(0, quotationIndex);
            reducedLine = reducedLine.substring(quotationIndex + this._JSON_OBJECT_GAP_1.length);

            quotationIndex = reducedLine.indexOf('"');
            const commonName = reducedLine.substring(0, quotationIndex);
            reducedLine = reducedLine.substring(reducedLine.indexOf('['));

            const counties: County[] = reducedLine.length < 3 ? [] : JSON.parse(reducedLine);
            return map.set(symbol, { counties: counties, commonName: commonName });
        }, new Map<string, ExtraInfo>()),
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
        const lineValues: string[] = line.split(',', 3);
        return <CountyCSVItem>{
            stateAbbrev: lineValues[0],
            stateFip: Number.parseInt(lineValues[1]),
            countyFip: lineValues[2],
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

    public getCountyCSVItemAsync(): UnaryFunction<Observable<string>, Observable<CountyCSVItem | undefined>> {
        return pipe(
            combineLatestWith(this.counties$),
            tap(([_, counties]) => console.log(counties)),
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