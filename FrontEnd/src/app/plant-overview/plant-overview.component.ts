import { Component, input } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-plant-overview',
  imports: [JsonPipe],
  templateUrl: './plant-overview.component.html',
  styleUrl: './plant-overview.component.css'
})
export class PlantOverviewComponent {
  public plant = input.required<PlantData>();
  public constructor() { }
}
