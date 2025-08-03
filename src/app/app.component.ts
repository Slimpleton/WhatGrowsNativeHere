import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GovPlantsDataService } from './services/PLANTS_data.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PlantMapper';

  public constructor(private readonly _plantService: GovPlantsDataService){
    this._plantService.loadAllDefiniteNativePlantData().subscribe();
  }
}
