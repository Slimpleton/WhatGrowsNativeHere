/* eslint-disable @typescript-eslint/no-explicit-any */

import * as topojson from 'topojson-client';
import * as USCountiesData from 'us-atlas/counties-10m.json';
import { geoContains } from 'd3-geo';
import { County, CountyCSVItem, StateCSVItem, StateInfo } from '../models/gov/models';
import { forkJoin, map, Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';
import { FileServiceServer } from './fileService/file.service.server';

export type Position = [longitude: number, latitude: number];

export class StateGeometryService {
  private readonly usStates: any[];
  private readonly usCounties: any[];

  // TODO do i need platform checks? not sure
  constructor(private readonly _fipsFileService: FileServiceServer) {
    // Convert once at construction time
    const data = USCountiesData as any;
    this.usStates = (topojson.feature(data, data.objects.states) as any).features as any[];
    this.usCounties = (topojson.feature(data, data.objects.counties) as any).features as any[];
  }

  findUSStateAsync(): UnaryFunction<Observable<Position>, Observable<StateInfo | null>> {
    return pipe(
      switchMap((pos: Position) => {
        const state: any | null = this.usStates.find((x: any) => this.isPointInFeature(pos, x));
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

  public findUSCountyAsync(): UnaryFunction<Observable<Position>, Observable<County | null>> {
    return pipe(
      switchMap((pos: Position) => {
        const county: any | null = this.usCounties.find((x: any) => this.isPointInFeature(pos, x));
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
  private isPointInFeature(point: Position, feature: any): boolean {
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
