import { afterNextRender, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as us from 'us-atlas/counties-albers-10m.json';
import { PositionService } from '../services/position.service';
import { filter, map, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { combineCountyFIP, County } from '../models/gov/models';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FileService } from '../services/file.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-county-map',
  imports: [NavBarComponent, AsyncPipe, FormsModule, TranslocoModule],
  templateUrl: './county-map.component.html',
  styleUrl: './county-map.component.css'
})
export class CountyMapComponent {
  private readonly _destroy$: Subject<void> = new Subject<void>();
  public combineCountyFIP = combineCountyFIP;
  private readonly _usa: any = us;

  public readonly states$ = this.fileService.states$.pipe(
    map((counties) => counties.sort((a, b) => a.name.localeCompare(b.name))),
    takeUntil(this._destroy$));

  // Only need to be sorted once
  private readonly allCounties$ = this.fileService.counties$.pipe(
    map((counties) => counties.sort((a, b) => a.countyName.localeCompare(b.countyName))),
    shareReplay(),
    takeUntil(this._destroy$)
  );

  // Not reloading the counties list on selectedStateFip change, maybe use a setter to pop that off
  public counties$ = this.allCounties$.pipe(
    map((counties) => counties.filter((x) => x.stateFip == this.selectedStateFIP)),
    takeUntil(this._destroy$),
  );

  private _selectedStateFIP: number | undefined = undefined;
  public get selectedStateFIP(): number | undefined {
    return this._selectedStateFIP;
  }
  public set selectedStateFIP(value: number) {
    this._selectedStateFIP = value;
    this.counties$ = this.allCounties$.pipe(
      map((counties) => counties.filter((x) => x.stateFip == this.selectedStateFIP)),
      // Not trigger the on change effects, just select first in list
      tap((counties) => this._selectedCountyFIP = combineCountyFIP(counties[0])),
      takeUntil(this._destroy$));
  }

  private _selectedCountyFIP: string | undefined = undefined;
  public get selectedCountyFIP(): string | undefined {
    return this._selectedCountyFIP;
  }

  public set selectedCountyFIP(value: string) {
    this._selectedCountyFIP = value;
    // TODO overwrite the position service value ?? make an overwrite public call to manually select a county
    // TODO maybe only overwrite when we navigate away with a selected county???
  }
  // TODO make it so that this setter is a lookup for the name instead of setting the name manually every time so it uses this when we load in too
  // dude im so fucking smart

  public getSelectedCounty(): string | null {
    if (this.selectedCountyFIP == undefined || this.selectedStateFIP == undefined)
      return null;
    const selectedCounty: County = { stateFip: this.selectedStateFIP, countyFip: this.selectedCountyFIP };
    return combineCountyFIP(selectedCounty);
  }

  public countyName: string | undefined | null = undefined;
  @ViewChild('mapCanvas') private readonly _canvas!: ElementRef<HTMLCanvasElement>;

  // TODO canvas cannot draw on angular ssr, if we switch to a plain svg drawn to an image and attach event listeners to diff areas, that would work for ssr  
  public constructor(@Inject(PLATFORM_ID) private readonly _platformId: Object, private readonly _positionService: PositionService, public readonly fileService: FileService) {
    if (isPlatformBrowser(this._platformId))
      afterNextRender({
        write: () => {
          const context = this._canvas.nativeElement.getContext('2d');
          if (!context)
            return;

          this.handleCanvasClick();

          const path = d3.geoPath(null, context);
          context.lineJoin = "round";
          context.lineCap = "round";

          this.drawEntireMap(context, path);

          this._positionService.countyEmitter$.pipe(
            filter((x) => x != null),
            map((county) => {
              const fip: string = combineCountyFIP(county);
              this._selectedStateFIP = county.stateFip;
              this._selectedCountyFIP = fip;
              this.drawCountyLine(context, path, fip);
              return fip;
            }),
            this.fileService.getCountyCSVItemAsync(),
            tap((county) => this.countyName = county?.countyName),
            takeUntil(this._destroy$)
          ).subscribe();
        }
      });
  }

  private handleCanvasClick() {
    this._canvas.nativeElement.addEventListener('click', (ev: MouseEvent) => {
      const x: number = ev.offsetX;
      const y: number = ev.offsetY;
      console.log(x, y);
    });
  }

  private drawEntireMap(context: CanvasRenderingContext2D, path: d3.GeoPath<any, d3.GeoPermissibleObjects>) {
    context.beginPath();
    path(topojson.mesh(this._usa, this._usa.objects.counties, (a: any, b: any) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)));
    context.lineWidth = 0.5;
    context.strokeStyle = "#000";
    context.stroke();

    context.beginPath();
    path(topojson.mesh(this._usa, this._usa.objects.states, (a, b) => a !== b));
    context.lineWidth = 0.5;
    context.strokeStyle = "#000";
    context.stroke();

    context.beginPath();
    path(topojson.feature(this._usa, this._usa.objects.nation));
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.stroke();
  }

  private drawCountyLine(context: CanvasRenderingContext2D, path: d3.GeoPath<any, d3.GeoPermissibleObjects>, fullFip: string) {
    context.beginPath();
    // TODO this filter is mostly working?? not fully idk some bottom ca counties are missing not sure why
    path(topojson.mesh(this._usa, this._usa.objects.counties, (a, b) => a.id === fullFip || b.id == fullFip));
    context.strokeStyle = '#fff';
    context.lineWidth = 2;
    context.stroke();
  }
}
