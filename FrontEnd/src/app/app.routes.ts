import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { csvResolver } from './services/PLANTS_data.service';
import { CountyMapComponent } from './county-map/county-map.component';
import { PlantOverviewComponent, plantOverviewResolver } from './plant-overview/plant-overview.component';

const mapRoute: string = 'map';
const searchRoute: string = 'search';
const plantRoute: string = 'plant/:id';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: () => {
            // TODO figure out how to navigate if no emission from positionService
            // const posService: PositionService = inject(PositionService);
            return (navigator.geolocation) ? searchRoute : mapRoute
        }
    },
    {
        path: searchRoute,
        resolve: csvResolver,
        component: HomeComponent
    },
    {
        path: mapRoute,
        component: CountyMapComponent,
    },
    {
        path: plantRoute,
        component: PlantOverviewComponent,
        resolve: {
            plant: plantOverviewResolver
        }
    }
];
