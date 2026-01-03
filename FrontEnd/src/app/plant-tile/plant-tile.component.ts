import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PicSearchIconComponent } from "../pic-search-icon/pic-search-icon.component";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { PlantOverviewRouteData } from '../app.routes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'plant-tile',
  imports: [MatIconModule, TitleCasePipe, TranslocoModule, PicSearchIconComponent, MatButtonModule],
  templateUrl: './plant-tile.component.html',
  styleUrl: './plant-tile.component.css'
})
export class PlantTileComponent implements OnInit {
  public usdaGovPlantProfileUrl: string = GovPlantsDataService.usdaGovPlantProfileUrl;
  @Input({ required: true }) public plant!: PlantData;
  private _translatedGrowthHabits?: string = undefined;

  public constructor(private readonly _router: Router, private readonly _translocoService: TranslocoService) {
  }

  public ngOnInit(): void {
    if (this.plant.growthHabit != null)
      this._translatedGrowthHabits = this._translocoService.translateObject<string>([...this.plant.growthHabit].map(x => 'GROWTH_HABITS.' + x.toUpperCase())).join(', ');
  }

  public openImageSearch(plant: PlantData): void {
    const query: string = plant.commonName?.length > 0 ? plant.commonName : plant.scientificName;
    const queryUrl: string = `https://www.google.com/search?q=${query}&tbm=isch`;
    window.open(queryUrl, '_blank');
  }

  public get plantDuration(): string {
    return [...this.plant.duration].join(', ');
  }

  public openInfoPage() {
    this._router.navigate(['plant/raw/' + this.plant.acceptedSymbol], { state: <PlantOverviewRouteData>{ plant: this.plant } });
  }

  public get growthHabits(): string | undefined {
    return this._translatedGrowthHabits;
  }

  public get iconName(): string {
    switch (this.plant.shadeTolerance) {
      case 'Intermediate':
        return 'partly_cloudy_day';
      case 'Intolerant':
        return 'sunny';
      case 'Tolerant':
        return 'cloud';
    }
  }
}
