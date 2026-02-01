import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { CamelSplitPipe } from "../pipes/camel-split.pipe";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-plant-overview',
  imports: [TranslocoPipe, TitleCasePipe, KeyValuePipe, CamelSplitPipe],
  templateUrl: './plant-overview.component.html',
  styleUrl: './plant-overview.component.css'
})
export class PlantOverviewComponent {
  public get usdaGovPlantProfileUrl(): string { return GovPlantsDataService.usdaGovPlantProfileUrl; }
  public plant = input.required<PlantData>();
  public constructor() { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public isIterable(value: any): value is Iterable<any> {
    return value != null && typeof value[Symbol.iterator] === 'function' && typeof value !== 'string';
  }

  public getIterableString<T>(values: Iterable<T>): string {
    return [...values].join(', ');
  }
}
