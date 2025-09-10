import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import * as us from 'us-atlas/counties-albers-10m.json';
import { PositionService } from '../services/position.service';
import { filter, map, Subject, takeUntil, tap } from 'rxjs';
import { combineCountyFIP, County } from '../models/gov/models';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FileService } from '../services/file.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-county-map',
  imports: [NavBarComponent, AsyncPipe],
  templateUrl: './county-map.component.html',
  styleUrl: './county-map.component.css'
})
export class CountyMapComponent implements AfterViewInit {
  private readonly _destroy$: Subject<void> = new Subject<void>();

  private readonly _usa: any = us;
  public readonly counties = this.fileService.counties$.pipe(
    map((counties) => counties.sort((a,b) => a.countyName.localeCompare(b.countyName))),
    takeUntil(this._destroy$));
  public countyName: string | undefined | null = undefined;
  @ViewChild('mapCanvas') private readonly _canvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private readonly _positionService: PositionService, public readonly fileService: FileService){
  }

  public ngAfterViewInit(): void {
    const context = this._canvas.nativeElement.getContext('2d');
    if (!context)
      return;

    this._canvas.nativeElement.addEventListener('click', (ev: MouseEvent) => {
      const x : number = ev.offsetX;
      const y : number = ev.offsetY;
      console.log(x,y);      
      // TODO use the inverse of the transformation to display canvas to get lat/long
      // use that to find what county the click is in
    });

    const path = d3.geoPath(null, context);
    context.lineJoin = "round";
    context.lineCap = "round";

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

    this._positionService.countyEmitter$.pipe(
      filter((x) => x != null),
      map((county) => combineCountyFIP(county)),
      this.fileService.getCountyCSVItemAsync(),
      tap((county) => this.countyName = county?.countyName),
      takeUntil(this._destroy$)
    ).subscribe();

    this._positionService.countyEmitter$.pipe(
      takeUntil(this._destroy$)).subscribe({
      next: (county: County) => {
        const fullFip: string = combineCountyFIP(county);
        context.beginPath();
        // TODO this filter is mostly working?? not fully idk some bottom ca counties are missing not sure why
        path(topojson.mesh(this._usa, this._usa.objects.counties, (a, b) => a.id === fullFip || b.id == fullFip));
        context.strokeStyle = '#fff';
        context.lineWidth = 2;
        context.stroke();
      },
      error :(err) => console.error(err),
    });
  }

}
