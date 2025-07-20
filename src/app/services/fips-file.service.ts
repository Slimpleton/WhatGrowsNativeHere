import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { map, Observable, skip, Subject, takeUntil } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FipsFileService implements OnDestroy {
    private readonly _dataUrl: string = './assets/statesFipsInfo.csv';
    private readonly _ngDestroy$: Subject<void> = new Subject<void>();
    private readonly _states$: Observable<StateCSVItem[]> = this._client.get(this._dataUrl, { responseType: 'text' }).pipe(
        map((file: string) => file.split('\n')),
        skip(1),
        map((lines: string[]) => lines.map((line: string) =>{
            const lineValues: string[] = line.split(',');
            return <StateCSVItem>{
                fip: Number.parseInt(lineValues[0]),
                abbrev: lineValues[1],
                name: lineValues[2],
                gnisid: lineValues[3]
            }
        })),
    takeUntil(this._ngDestroy$));

    public constructor(private readonly _client: HttpClient) {
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