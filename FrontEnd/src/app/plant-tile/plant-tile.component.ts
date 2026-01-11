import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { TitleCasePipe } from '@angular/common';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { PlantOverviewRouteData } from '../app.routes';
import { IconComponent, IconName } from '../icon/icon.component';
import { MapService } from '../map.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'plant-tile',
  imports: [TitleCasePipe, TranslocoPipe, IconComponent],
  templateUrl: './plant-tile.component.html',
  styleUrl: './plant-tile.component.css',
  standalone: true
})
export class PlantTileComponent {
  public usdaGovPlantProfileUrl: string = GovPlantsDataService.usdaGovPlantProfileUrl;
  @Input({ required: true }) public plant!: PlantData;
  @ViewChild('map') public mapRef?: ElementRef<SVGSVGElement>;

  public static readonly WIDTH: number = 400;
  public static readonly HEIGHT: number = 140;

  public get viewBox(): string {
    return `0 0 ${PlantTileComponent.WIDTH} ${PlantTileComponent.HEIGHT}`
  }

  public showMap: boolean = false;
  private readonly _router = inject(Router);


  public constructor(private readonly _mapService: MapService) {
    afterNextRender({
      write: () => {
        // TODO create path and projection that fits the svg element here
        const path = null;
        const projection = null;
        // TODO add occurrences in the overview of the plant maybe with the same base native map
        // todo load occurrences in reverse chronological order and stream the new svgs onto the map idk man animated? 
      }
    });    
  }

  public get growthHabitKeys(): string[] {
    if (!this.plant?.growthHabit || this.plant.growthHabit.size === 0) {
      return [];
    }
    return [...this.plant.growthHabit].map(x => 'GROWTH_HABITS.' + x.toUpperCase());
  }

  public get plantDuration(): string {
    return [...this.plant.duration].join(', ');
  }

  public openInfoPage() {
    this._router.navigate(['plant/raw/' + this.plant.acceptedSymbol], { state: <PlantOverviewRouteData>{ plant: this.plant } });
  }

  public get iconName(): IconName {
    switch (this.plant.shadeTolerance) {
      case 'Intermediate':
        return 'partly-cloudy';
      case 'Intolerant':
        return 'sunny';
      case 'Tolerant':
        return 'cloud';
    }
  }
}
