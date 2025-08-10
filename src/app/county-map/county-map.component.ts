import { Component } from '@angular/core';
import { PositionService } from '../services/position.service';
import { FileService } from '../services/file.service';
import { StateGeometryService } from '../services/state-geometry.service';

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
    private readonly _geometryService: StateGeometryService){}
}
