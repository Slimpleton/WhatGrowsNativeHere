import { RenderMode, ServerRoute } from '@angular/ssr';
import { Route } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: Route.searchRoute,
    renderMode: RenderMode.Client
  },
  {
    path: Route.mapRoute,
    renderMode: RenderMode.Server
  }
];
