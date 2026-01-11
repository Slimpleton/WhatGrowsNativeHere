import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { feature } from 'topojson-client';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private geometry$?: Observable<{
    states: GeoJSON.Feature[];
    counties: GeoJSON.Feature[];
  }>;

  constructor(private readonly _http: HttpClient) { }

  private load(): Observable<{
    states: GeoJSON.Feature[];
    counties: GeoJSON.Feature[];
  }> {
    if (!this.geometry$) {
      this.geometry$ = this._http
        .get<any>('/assets/counties-10m.json')
        .pipe(
          map(topo => ({
            states: (feature(topo, topo.objects.states) as any).features,
            counties: (feature(topo, topo.objects.counties) as any).features
          })),
          // 🔑 this is the cache
          shareReplay(1)
        );
    }

    return this.geometry$;
  }

  public getStates(): Observable<GeoJSON.Feature[]> {
    return this.load().pipe(map(g => g.states));
  }

  public getCounties(): Observable<GeoJSON.Feature[]> {
    return this.load().pipe(map(g => g.counties));
  }

  // TODO render premade svg with baseline of all county / state lines to base all the other svgs off of
}
