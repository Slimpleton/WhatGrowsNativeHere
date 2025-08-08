import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { csvResolver } from './services/PLANTS_data.service';

export const routes: Routes = [
    {   
        path: '',
        component: HomeComponent,
        resolve: csvResolver
    },
];
