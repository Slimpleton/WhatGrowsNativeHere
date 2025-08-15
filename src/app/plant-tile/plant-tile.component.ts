import { Component, Input } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { MatIconModule } from '@angular/material/icon';
import { ShadyIconComponent } from '../shady-icon/shady-icon.component';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'plant-tile',
  imports: [MatIconModule, ShadyIconComponent, TitleCasePipe, UpperCasePipe, TranslocoModule],
  templateUrl: './plant-tile.component.html',
  styleUrl: './plant-tile.component.css'
})
export class PlantTileComponent {
  public usdaGovPlantProfileUrl: string = GovPlantsDataService.usdaGovPlantProfileUrl;
  @Input({required: true}) public plant!: PlantData;

  public constructor(){
  }
}
