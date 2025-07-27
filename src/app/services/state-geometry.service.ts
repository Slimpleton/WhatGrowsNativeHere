import { Injectable } from '@angular/core';
import * as USStates from 'us-atlas/states-10m.json';
// TODO do i need counties ?? 
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';// With your type declaration from earlier:
import { County } from '../models/gov/models';
import { FileService, StateCSVItem } from './fips-file.service';
import { forkJoin, map, Observable, of, pipe, switchMap, UnaryFunction } from 'rxjs';

export interface StateInfo {
  fip: number | string,
  abbreviation: string;
  name: string;
  properties?: any;
  country?: string;
  gnisid?: string;
}

// TODO optimize this class, the dependencies / jsons are loading whacky and causing it to be slower than it has to be prob
// no compiler warnings reeeeeeeee

@Injectable({
  providedIn: 'root'
})
export class StateGeometryService {
  private usStates: any;

  constructor(private readonly _fipsFileService: FileService) {
    // Convert TopoJSON to GeoJSON for US states
    this.usStates = topojson.feature(USStates as any, (USStates as any).objects.states);
    console.log('us', this.usStates);
  }

  findUSStateAsync(): UnaryFunction<Observable<GeolocationPosition>, Observable<StateInfo | null>> {
    return pipe(
      switchMap((pos: GeolocationPosition) => {
        console.log(pos);
        const state: any | null = (this.usStates.features as any[]).find((x: any) => this.isPointInFeature([pos.coords.longitude, pos.coords.latitude], x));
        const undefinedState: boolean = state == undefined || state == null;
        if (undefinedState) {
          console.log(state);

          return of(null);
        }
        else {
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
        }
      }));
  }

  public findCounty(coords: GeolocationCoordinates): County | null {
    return null;
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
