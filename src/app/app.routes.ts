import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { csvResolver } from './services/PLANTS_data.service';
import { CountyMapComponent } from './county-map/county-map.component';
import { PlantOverviewComponent, plantOverviewResolver } from './plant-overview/plant-overview.component';

export const routes: Routes = [
    {   
        path: '',
        component: HomeComponent,
        resolve: csvResolver
    },
    {
        path:'counties',
        component: CountyMapComponent,
    },
    {
        path:'plant/:id',
        component:PlantOverviewComponent,
        resolve: {
            plant: plantOverviewResolver
        }
    }
];
