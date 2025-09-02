import { Component, Input } from '@angular/core';
import { PlantData } from '../models/gov/models';
import { MatIconModule } from '@angular/material/icon';
import { ShadyIconComponent } from '../shady-icon/shady-icon.component';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { GovPlantsDataService } from '../services/PLANTS_data.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PicSearchIconComponent } from "../pic-search-icon/pic-search-icon.component";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';

@Component({
  selector: 'plant-tile',
  imports: [MatIconModule, ShadyIconComponent, TitleCasePipe, UpperCasePipe, TranslocoModule, PicSearchIconComponent, MatButtonModule],
  templateUrl: './plant-tile.component.html',
  styleUrl: './plant-tile.component.css'
})
export class PlantTileComponent {
  public usdaGovPlantProfileUrl: string = GovPlantsDataService.usdaGovPlantProfileUrl;
  @Input({ required: true }) public plant!: PlantData;

  public constructor(private readonly _router: Router) {
  }

  public openImageSearch(plant: PlantData) : void{
    const query : string = plant.commonName?.length > 0 ? plant.commonName : plant.scientificName;
    const queryUrl : string = `https://www.google.com/search?q=${query}&tbm=isch`;
    window.open(queryUrl, '_blank');
  }

  public getPlantDuration(plant: PlantData): string{
    if(Array.isArray(plant.duration))
      return plant.duration.join(', ');
    return plant.duration as string;
  }

  public openInfoPage(plant: PlantData){
    this._router.navigate(['plant/' + plant.acceptedSymbol]);
  }
}
