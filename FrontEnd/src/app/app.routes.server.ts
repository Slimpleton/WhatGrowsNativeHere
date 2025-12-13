import { RenderMode, ServerRoute } from '@angular/ssr';
import { Route } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: Route.searchRoute,
    renderMode: RenderMode.Server
  },
  {
    path: Route.mapRoute,
    renderMode: RenderMode.Server
  },
  {
    path: Route.plantRawRoute,
    renderMode: RenderMode.Server
  }
];
