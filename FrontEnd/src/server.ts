import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { join } from 'node:path';
import { FileServiceServer } from './app/services/fileService/file.service.server';
import { Position, StateGeometryService } from './app/services/state-geometry.service';
import { firstValueFrom, of } from 'rxjs';
import rateLimit from 'express-rate-limit';

const browserDistFolder = join(import.meta.dirname, '../browser');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();
app.use(compression(), express.json());

const angularApp = new AngularNodeAppEngine();
const fileService = new FileServiceServer();
const geomService = new StateGeometryService(fileService);

app.use('/api/geolocation', apiLimiter);

app.post('/api/geolocation/state', async (req, res) => {
  const pos: Position = req.body
  if (!pos || pos.length !== 2) {
    return res.status(400).json({ error: 'Invalid coords' });
  }

  try {
    console.log(req);
    const state = await firstValueFrom(
      of(pos).pipe(geomService.findUSStateAsync())
    );

    return res.json({ state });
  } catch (error) {
    console.error('State lookup error:', error);
    return res.status(500).json({ error: 'State lookup failed' });
  }
});

// TODO convert to using a worker thread high priority
app.post('/api/geolocation/county', async (req, res) => {
  const pos: Position = req.body
  if (!pos || pos.length !== 2) {
    return res.status(400).json({ error: 'Invalid coords', pos });
  }

  try {
    const county = await firstValueFrom(
      of(pos).pipe(geomService.findUSCountyAsync())
    );

    return res.json({ county });
  } catch (error) {
    console.error('County lookup error:', error);
    return res.status(500).json({ error: 'County lookup failed' });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
