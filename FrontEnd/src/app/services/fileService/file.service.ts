import { Inject, Injectable, makeStateKey, PLATFORM_ID, StateKey, TransferState } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformServer } from "@angular/common";
import { Observable, of, pipe, UnaryFunction } from "rxjs";
import { combineLatestWith, map, switchMap, tap } from "rxjs/operators";
import { CountyCSVItem, StateCSVItem } from "../../models/gov/models";
import { IFileService } from "./ifile-service";

@Injectable({ providedIn: "root" })
export class FileService implements IFileService {
  private readonly _stateUrl = "api/FileData/states";
  private readonly _countyUrl = "api/FileData/counties";
  private readonly STATES_KEY = makeStateKey<StateCSVItem[]>("STATE_CSV_DATA");
  private readonly COUNTIES_KEY = makeStateKey<CountyCSVItem[]>("COUNTY_CSV_DATA");
  private readonly COUNTY_KEY = makeStateKey<CountyCSVItem>('COUNTY_CSV_DATUM');

  public get states$(): Observable<StateCSVItem[]> {
    return this.getSSRData<StateCSVItem[]>(this.STATES_KEY, this._stateUrl);
  };
  public get counties$(): Observable<CountyCSVItem[]> {
    return this.getSSRData<CountyCSVItem[]>(this.COUNTIES_KEY, this._countyUrl);
  }

  public county$(stateFip: string | number, countyFip: string): Observable<CountyCSVItem> {
    const url = this._countyUrl + '/' + stateFip + '/' + countyFip;
    return this.getSSRData<CountyCSVItem>(this.COUNTY_KEY, url);
  }


  constructor(
    private readonly _http: HttpClient,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly _platformId: object
  ) {
  }

  private getSSRData<T>(key: StateKey<T>, url: string): Observable<T> {
    // Client: If SSR already transferred the data → don't re-fetch
    if (this._transferState.hasKey(key)) {
      return of(this._transferState.get(key, null as T));
    }

    // Server: Fetch and store in TransferState
    return this._http.get<T>(url).pipe(
      tap((data) => {
        if (isPlatformServer(this._platformId)) {
          this._transferState.set(key, data);
        }
      })
    );
  }


  public getStateCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<StateCSVItem | undefined>> {
    return pipe(
      combineLatestWith(this.states$),
      map(([fip, states]: [number | string, StateCSVItem[]]) => states.find(x => x.fip == fip))
    );
  }

  public getCountyCSVItemAsync(): UnaryFunction<Observable<string>, Observable<CountyCSVItem | null>> {
    return pipe(
      switchMap((fip: string) => {
        const stateFip = parseInt(fip.substring(0, 2));
        const countyFip = fip.substring(2);
        return this.county$(stateFip, countyFip);
      }),
    );
  }

}
