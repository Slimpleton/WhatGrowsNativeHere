import { Component } from '@angular/core';
import { PositionService } from '../services/position.service';
import { FileService } from '../services/file.service';
import { StateGeometryService } from '../services/state-geometry.service';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-county-map',
  imports: [],
  templateUrl: './county-map.component.html',
  styleUrl: './county-map.component.css'
})
export class CountyMapComponent {

  public constructor(
    private readonly _positionService: PositionService,
    private readonly _fileService: FileService,
    private readonly _geometryService: StateGeometryService) { }

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
    path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)));
    context.lineWidth = 0.5;
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    path(topojson.mesh(us, us.objects.states, (a, b) => a !== b));
    context.lineWidth = 0.5;
    context.strokeStyle = "#000";
    context.stroke();

    context.beginPath();
    path(topojson.feature(us, us.objects.nation));
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.stroke();

    return context.canvas;
  }
}
