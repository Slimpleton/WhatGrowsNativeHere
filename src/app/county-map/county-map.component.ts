import { Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import * as us from 'us-atlas/counties-10m.json';

@Component({
  selector: 'app-county-map',
  imports: [],
  templateUrl: './county-map.component.html',
  styleUrl: './county-map.component.css'
})
export class CountyMapComponent {

  @ViewChild('mapCanvas') public canvas!: ElementRef<HTMLCanvasElement>;
  private usa : any = us;

  public constructor() { }

  public fcn(): void {
    const width = 975;
    const height = 610;
    // TODO replace with canvas call wit angular
    const context = DOM.context2d(width, height);
    const path = d3.geoPath(null, context);
    context.canvas.style.maxWidth = "100%";
    context.lineJoin = "round";
    context.lineCap = "round";

    context.beginPath();
    path(topojson.mesh(this.usa, this.usa.objects.counties, (a, b) => a !== b && (a.id ?? 0 / 1000 | 0) === (b.id ?? 0 / 1000 | 0)));
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

    return context.canvas;
  }
}
