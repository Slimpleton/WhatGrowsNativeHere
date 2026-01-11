import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { mesh } from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _topo$: Observable<any> = this._http
    .get('/assets/counties-10m.json')
    .pipe(shareReplay(1));

  public countyMesh$: Observable<GeoJSON.MultiLineString> =
    this._topo$.pipe(
      map(topo => mesh(topo, topo.objects.counties, (a, b) => a !== b)),
      shareReplay(1)
    );

  constructor(private readonly _http: HttpClient) { }

  public getStatesGeometry(): Observable<GeometryCollection> {
    return this._topo$.pipe(map(topo => topo.objects.states as GeometryCollection));
  }

  public getCountiesGeometry(): Observable<GeometryCollection> {
    return this._topo$.pipe(map(topo => topo.objects.counties as GeometryCollection));
  }
}
