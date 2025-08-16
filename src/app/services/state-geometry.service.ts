import { Injectable } from '@angular/core';
import * as USCounties from 'us-atlas/counties-10m.json';
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';// With your type declaration from earlier:
import { County, CountyCSVItem, StateCSVItem, StateInfo } from '../models/gov/models';
import { FileService } from './file.service';
import { forkJoin, map, Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateGeometryService {
  private usStates: any;
  private usCounties: any;

  constructor(private readonly _fipsFileService: FileService) {
    // Convert TopoJSON to GeoJSON for US states
    this.usStates = topojson.feature(USCounties as any, (USCounties as any).objects.states);
    this.usCounties = topojson.feature(USCounties as any, (USCounties as any).objects.counties);
  }

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

  public findUSCountyAsync(): UnaryFunction<Observable<GeolocationPosition>, Observable<County | null>> {
    return pipe(
      switchMap((pos: GeolocationPosition) => {
        const county: any | null = (this.usCounties.features as any[]).find((x: any) => this.isPointInFeature([pos.coords.longitude, pos.coords.latitude], x));
        if (county == undefined || county == null)
          return of(null);

        return of(county.id).pipe(
          this._fipsFileService.getCountyCSVItemAsync(),
          map((countyItem: CountyCSVItem | undefined) => countyItem ? <County>{
            FIP: countyItem.countyFip,
            stateFIP: countyItem.stateFip
          } : null),
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
