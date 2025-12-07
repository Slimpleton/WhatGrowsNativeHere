import { Inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { isPlatformServer } from "@angular/common";
import { Observable, of, pipe, UnaryFunction } from "rxjs";
import { combineLatestWith, map, switchMap, tap } from "rxjs/operators";
import { CountyCSVItem, StateCSVItem } from "../models/gov/models";

@Injectable({ providedIn: "root" })
export class FileService {
  private readonly _stateUrl = "api/FileData/states";
  private readonly _countyUrl = "api/FileData/counties";

  private readonly STATE_KEY = makeStateKey<StateCSVItem[]>("STATE_CSV_DATA");
  private readonly COUNTY_KEY = makeStateKey<CountyCSVItem[]>("COUNTY_CSV_DATA");

  public readonly states$: Observable<StateCSVItem[]>;
  public readonly counties$: Observable<CountyCSVItem[]>;

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID)private platformId: Object
  ) {
    this.states$ = this.getSSRData<StateCSVItem[]>(this.STATE_KEY, this._stateUrl);
    this.counties$ = this.getSSRData<CountyCSVItem[]>(this.COUNTY_KEY, this._countyUrl);
  }

  private getSSRData<T>(key: any, url: string): Observable<T> {
    // Client: If SSR already transferred the data → don't re-fetch
    if (this.transferState.hasKey(key)) {
      return of(this.transferState.get(key, null as any));
    }

    // Server: Fetch and store in TransferState
    return this.http.get<T>(url).pipe(
      tap(data => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(key, data);
        }
      })
    );
  }


      public getStateCSVItemAsync(): UnaryFunction<Observable<string | number>, Observable<StateCSVItem | undefined>> {
        return pipe(
            // TODO fix 
            combineLatestWith(this.getSSRData<StateCSVItem>(this.STATE_KEY, this._stateUrl)),
            map(([fip, states]: [number | string, StateCSVItem[]]) => states.find(x => x.fip == fip))
        );
    }

    public getCountyCSVItemAsync(): UnaryFunction<Observable<string>, Observable<CountyCSVItem | null>> {
        return pipe(
            switchMap((fip: string) => {
                const stateFip = parseInt(fip.substring(0, 2));
                const countyFip = fip.substring(2); 
                // TODO switch to here
                return this._client.get<CountyCSVItem | null>(this._countyUrl + '/' + stateFip + '/' + countyFip)
            }),
        );
    }

}
