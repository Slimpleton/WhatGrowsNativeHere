import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { JsonPipe, TitleCasePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plant-overview',
  imports: [JsonPipe, TranslocoPipe, TitleCasePipe],
  templateUrl: './plant-overview.component.html',
  styleUrl: './plant-overview.component.css'
})
export class PlantOverviewComponent {
  public plant = input.required<PlantData>();
  public constructor() { }
}
