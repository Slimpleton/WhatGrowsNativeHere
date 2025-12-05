import { ActivatedRouteSnapshot, RedirectCommand, ResolveData, ResolveFn, Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CountyMapComponent } from './county-map/county-map.component';
import { PlantOverviewComponent } from './plant-overview/plant-overview.component';
import { PlantData } from './models/gov/models';
import { of } from 'rxjs';
import { inject } from '@angular/core';
import { GovPlantsDataService } from './services/PLANTS_data.service';

export enum Route {
    mapRoute = 'map',
    searchRoute = 'search',
    plantRawRoute = 'plant/raw/:id'
};

const plantOverviewResolver: ResolveFn<Readonly<PlantData> | RedirectCommand> = (route: ActivatedRouteSnapshot) => {
    const acceptedSymbol: string | null = route.paramMap.get('id');
    if (acceptedSymbol == null || acceptedSymbol.length == 0) {
        console.error('Invalid symbol detected, rerouting to different view');
        return new RedirectCommand(inject(Router).parseUrl(''));
    }

    if (route.data) {
        const routeData = route.data as PlantOverviewRouteData;
        if (routeData.plant != null)
            return of(routeData.plant);
    }

    return inject(GovPlantsDataService).getPlantById(acceptedSymbol);
};

type UnwrapResolveFn<T> = T extends ResolveFn<infer U> ? U : T;

export interface PlantOverviewResolveData extends ResolveData {
    plant: ResolveFn<PlantData>;
}

export type PlantOverviewRouteData = {
    [K in keyof PlantOverviewResolveData]: UnwrapResolveFn<PlantOverviewResolveData[K]>
};

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        redirectTo: () => {
            // TODO figure out how to navigate if no emission from positionService
            // const posService: PositionService = inject(PositionService);
            return (navigator.geolocation) ? Route.searchRoute : Route.mapRoute
        }
    },
    {
        path: Route.searchRoute,
        component: HomeComponent
    },
    {
        path: Route.mapRoute,
        component: CountyMapComponent,
    },
    {
        path: Route.plantRawRoute,
        component: PlantOverviewComponent,
        resolve: <PlantOverviewResolveData>{
            plant: plantOverviewResolver
        },
    }
];
