import { Inject, Injectable, makeStateKey, PLATFORM_ID, StateKey, TransferState } from '@angular/core';
import * as USCounties from 'us-atlas/counties-10m.json';
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';// With your type declaration from earlier:
import { County, CountyCSVItem, StateCSVItem, StateInfo } from '../models/gov/models';
import { FileService } from './file.service';
import { defer, forkJoin, tap, map, Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

// TODO convert this to ssr somehow rip
export class StateGeometryService {
  private readonly statesKey: StateKey<any> = makeStateKey('GEOMETRY_STATES_KEY');
  private readonly countiesKey: StateKey<any> = makeStateKey('GEOMETRY_COUNTIES_KEY');

  private get usStates(): any {
    return this.getSSRData(this.statesKey);
  }

  private get usCounties(): any {
    return this.getSSRData(this.countiesKey);
  }

  constructor(private readonly _fipsFileService: FileService, @Inject(PLATFORM_ID) private readonly _platformId: object, private readonly _transferState: TransferState,
  ) {
    // Convert TopoJSON to GeoJSON for US states
    // this.usStates = topojson.feature(USCounties as any, (USCounties as any).objects.states);
    // this.usCounties = topojson.feature(USCounties as any, (USCounties as any).objects.counties);
  }

  private getSSRData<T>(key: StateKey<T>): Observable<T> {
    // Client: If SSR already transferred the data → don't re-fetch
    if (this._transferState.hasKey(key)) {
      return of(this._transferState.get(key, null as any));
    }

    const obs$ = (key == this.statesKey) ?
      defer(() => import('us-atlas/states-10m.json')) :
      defer(() => import('us-atlas/counties-10m.json'));
    return obs$.pipe(
      tap((data: any) => {
        if (isPlatformServer(this._platformId)) {
          const objectName = key === this.statesKey ? 'states' : 'counties';
          this._transferState.set(key, topojson.feature(data as any, (data as any).objects[objectName]) as any);
        }
      }));
  }

  // TODO swap to ssr compat
  findUSStateAsync(): UnaryFunction<Observable<GeolocationPosition>, Observable<StateInfo | null>> {
    return pipe(
      switchMap((pos: GeolocationPosition) => {
        const state: any | null = (this.usStates.features as any[]).find((x: any) => this.isPointInFeature([pos.coords.longitude, pos.coords.latitude], x));
        if (state == undefined || state == null)
          return of(null);

        return forkJoin([
          of(state),
          of(state.id).pipe(this._fipsFileService.getStateCSVItemAsync())
        ]).pipe(
          map(([feature, stateItem]: [any, StateCSVItem | undefined]) => stateItem ? <StateInfo>{
            fip: feature.id,
            abbreviation: stateItem.abbrev,
            name: stateItem.name,
            properties: feature.properties,
            gnisid: stateItem.gnisid
          } : null),
        );
      }));
  }

  // TODO swap to ssr compat
  public findUSCountyAsync(): UnaryFunction<Observable<GeolocationPosition>, Observable<County | null>> {
    return pipe(
      switchMap((pos: GeolocationPosition) => {
        const county: any | null = (this.usCounties.features as any[]).find((x: any) => this.isPointInFeature([pos.coords.longitude, pos.coords.latitude], x));
        if (county == undefined || county == null)
          return of(null);

        return of(county.id).pipe(
          this._fipsFileService.getCountyCSVItemAsync(),
          map((countyItem: CountyCSVItem | null) => countyItem ? countyItem as County : null),
        );
      }));
  }

  /**
   * Check if a point is inside a GeoJSON feature using d3-geo
   * @param point [longitude, latitude]
   * @param feature GeoJSON feature
   * @returns boolean
   */
  private isPointInFeature(point: [number, number], feature: any): boolean {
    try {
      // Handle different geometry types
      if (feature.geometry.type === 'Polygon') {
        return geoContains(feature, point);
      } else if (feature.geometry.type === 'MultiPolygon') {
        return geoContains(feature, point);
      }

      throw new Error('Invalid feature geometry type ' + feature.geometry.type);
    } catch (error) {
      console.error('Error checking point in feature:', error);
      return false;
    }
  }
}
