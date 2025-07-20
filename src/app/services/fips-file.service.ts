import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { from, map, Observable, shareReplay, skip, Subject, switchMap, takeUntil, toArray } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FipsFileService implements OnDestroy {
    private readonly _dataUrl: string = 'assets/statesFipsInfo.csv';
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();
    private readonly _states$: Observable<StateCSVItem[]> = this._client.get(this._dataUrl, { responseType: 'text' }).pipe(
        switchMap((file: string) => from(file.split('\n'))),
        skip(1),
        map((line: string) => {
            console.log(line);
            const lineValues: string[] = line.split(',');
            return <StateCSVItem>{
                fip: Number.parseInt(lineValues[0]),
                abbrev: lineValues[1],
                name: lineValues[2],
                gnisid: lineValues[3]
            };
        }),
        toArray(),
        shareReplay(),
        takeUntil(this._ngDestroy$));

    public _states: StateCSVItem[] = [];

    public constructor(private readonly _client: HttpClient) {
        // HACK lazy always loaded vibes
        this._states$.subscribe({
            next: (states) => this._states = states
        });
    }

    public getStateCSVItem(fip: number): StateCSVItem {
        const state: StateCSVItem | undefined = this._states.find((state) => state.fip == fip);
        if (state == undefined)
            throw new Error('Invalid fip given for US state: ' + fip);
        return state;
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