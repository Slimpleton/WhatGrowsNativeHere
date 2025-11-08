import { Component, inject, input } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { JsonPipe } from '@angular/common';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { GovPlantsDataService } from '../services/PLANTS_data.service';

export const plantOverviewResolver: ResolveFn<Readonly<PlantData> | RedirectCommand> = (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
  const acceptedSymbol: string | null = route.paramMap.get('id');
  if (acceptedSymbol == null || acceptedSymbol.length == 0) {
    console.error('Invalid symbol detected, rerouting to different view');
    return new RedirectCommand(inject(Router).parseUrl(''));
  }

  return inject(GovPlantsDataService).getPlantById(acceptedSymbol);
};

@Component({
  selector: 'app-plant-overview',
  imports: [JsonPipe],
  templateUrl: './plant-overview.component.html',
  styleUrl: './plant-overview.component.css'
})
export class PlantOverviewComponent {
  public plant = input.required<PlantData>();
  public constructor() {
  }

}
