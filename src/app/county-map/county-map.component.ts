import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import * as us from 'us-atlas/counties-albers-10m.json';

@Component({
  selector: 'app-county-map',
  imports: [],
  templateUrl: './county-map.component.html',
  styleUrl: './county-map.component.css'
})
export class CountyMapComponent implements AfterViewInit {

  @ViewChild('mapCanvas') public canvas!: ElementRef<HTMLCanvasElement>;
  private usa: any = us;

  public constructor() {

  }
  ngAfterViewInit(): void {
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context)
      return;
    const path = d3.geoPath(null, context);
    context.lineJoin = "round";
    context.lineCap = "round";

    context.beginPath();
    path(topojson.mesh(this.usa, this.usa.objects.counties, (a: any, b: any) => a !== b && (a.id / 1000 | 0) === (b.id  / 1000 | 0)));
    context.lineWidth = 0.5;
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    path(topojson.mesh(this.usa, this.usa.objects.states, (a, b) => a !== b));
    context.lineWidth = 0.5;
    context.strokeStyle = "#000";
    context.stroke();

    context.beginPath();
    path(topojson.feature(this.usa, this.usa.objects.nation));
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.stroke();
  }

}
