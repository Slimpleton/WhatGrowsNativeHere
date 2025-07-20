import { Injectable } from '@angular/core';
import * as USStates from 'us-atlas/states-10m.json';
import * as CANADA from 'us-atlas/states-albers-10m.json';
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';// With your type declaration from earlier:
import { County } from '../models/gov/models';
import { FipsFileService, StateCSVItem } from './fips-file.service';

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
  private canadaProvinces: any;

  constructor(private readonly _fipsFileService: FipsFileService) {
    // Convert TopoJSON to GeoJSON for US states
    this.usStates = topojson.feature(USStates as any, (USStates as any).objects.states);

    // Convert TopoJSON to GeoJSON for Canadian provinces (if available)
    this.canadaProvinces = topojson.feature(CANADA as any, (CANADA as any).objects.states);
  }

  /**
  * Find which US state contains the given latitude/longitude point
  * @param lat Latitude
  * @param lng Longitude
  * @returns StateInfo object or null if not found
  */
  findUSState(lat: number, lng: number): StateInfo | null {
    const point: [number, number] = [lng, lat]; // GeoJSON uses [longitude, latitude]

    for (const feature of this.usStates.features) {
      if (this.isPointInFeature(point, feature)) {
        const stateItem: StateCSVItem = this._fipsFileService.getStateCSVItem(feature.id);
        return {
          fip: feature.id,
          abbreviation: stateItem.abbrev,
          name: stateItem.name,
          properties: feature.properties,
          gnisid: stateItem.gnisid
        };
      }
    }

    return null;
  }

  /**
   * Find which Canadian province contains the given latitude/longitude point
   * @param lat Latitude
   * @param lng Longitude
   * @returns StateInfo object or null if not found
   */
  findCanadianProvince(lat: number, lng: number): StateInfo | null {
    if (!this.canadaProvinces) {
      return null;
    }

    const point: [number, number] = [lng, lat];

    for (const feature of this.canadaProvinces.features) {
      if (this.isPointInFeature(point, feature)) {
        return {
          fip: feature.id,
          abbreviation: feature.id || feature.properties?.GEOID || '',
          name: feature.properties?.NAME || feature.properties?.name || 'Unknown',
          properties: feature.properties
        };
      }
    }

    return null;
  }

  /**
   * Find which state/province contains the given point (checks both US and Canada)
   * @param lat Latitude
   * @param lng Longitude
   * @returns StateInfo object with country info or null if not found
   */
  findStateOrProvince(lat: number, lng: number): StateInfo | null {
    // Try US first (most common case)
    const usState = this.findUSState(lat, lng);
    if (usState) {
      return { ...usState, country: 'US' };
    }

    // Try Canada
    const canadianProvince = this.findCanadianProvince(lat, lng);
    if (canadianProvince) {
      return { ...canadianProvince, country: 'Canada' };
    }

    return null;
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
