import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { join } from 'node:path';
import rateLimit from 'express-rate-limit';
import { readFile } from 'node:fs/promises';
import { County, CountyCSVItem, StateCSVItem, StateInfo } from './app/models/gov/models';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import { Position } from './app/services/position.service';

const browserDistFolder = join(import.meta.dirname, '../browser');

// Serve preloaded CSVs as JSON
let statesCSVCache: StateCSVItem[] = [];
let countiesCSVCache: CountyCSVItem[] = [];

async function preloadCSV() {
  const statesContent = await readFile(join(browserDistFolder, 'assets/statesFipsInfo.csv'), 'utf-8');
  statesCSVCache = statesContent
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map(line => {
      const [fip, abbrev, name, gnisid] = line.split(',');
      return <StateCSVItem>{ fip: parseInt(fip, 10), abbrev, name, gnisid };
    });

  const countiesContent = await readFile(join(browserDistFolder, 'assets/countyInfo.csv'), 'utf-8');
  countiesCSVCache = countiesContent
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map(line => {
      const fields = line.split(',');
      return <CountyCSVItem>{
        stateAbbrev: fields[0],
        stateFip: parseInt(fields[1], 10),
        countyFip: fields[2],
        countyName: fields[4],
      };
    });
}

let usStatesGeometries: any[] = [];
let usCountiesGeometries: any[] = [];

async function preloadGeometry() {
  const topo = JSON.parse(
    await readFile(join(browserDistFolder, 'assets/counties-10m.json'), 'utf-8')
  );

  usStatesGeometries = (feature(topo, topo.objects.states) as any).features;
  usCountiesGeometries = (feature(topo, topo.objects.counties) as any).features;
  // TODO quadtree for the usCounties lookups to speedUp

  console.log('US geometry preloaded');
}

/**
 * Check if a point is inside a GeoJSON feature using d3-geo
 * @param point [longitude, latitude]
 * @param feature GeoJSON feature
 * @returns boolean
 */
function isPointInFeature(point: Position, feature: any): boolean {
  try {
    // Handle different geometry types
    if (feature.geometry.type === 'Polygon') {
      return geoContains(feature, point);
    } else if (feature.geometry.type === 'MultiPolygon') {
      return geoContains(feature, point);
    }

    throw new Error('Invalid feature geometry type ' + feature.geometry.type);
  } catch (error) {
    console.error('Error checking point in feature:', error);
    return false;
  }
}

function getCountyCSVItem(requestedStateFip: number, requestedCountyFip: string): CountyCSVItem | undefined {
  return countiesCSVCache.find(c => c.stateFip === requestedStateFip && c.countyFip == requestedCountyFip);
}

function getStateCSVItem(requestedStateFip: number): StateCSVItem | undefined {
  return statesCSVCache.find(c => c.fip === requestedStateFip);
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();
app.use(compression(), express.json());

const angularApp = new AngularNodeAppEngine();

// API endpoints
app.get('/api/states', (_, res) => {
  res.json(statesCSVCache);
});

app.get('/api/states/:stateFip', (req, res) => {
  const requestedStateFip = Number(req.params.stateFip);
  const stateCsvItem = getStateCSVItem(requestedStateFip);
  res.json(stateCsvItem);
});

app.get('/api/counties/:stateFip/:countyFip', (req, res) => {
  const requestedStateFip = Number(req.params.stateFip);
  const requestedCountyFip = req.params.countyFip;
  const countyCsvItem = getCountyCSVItem(requestedStateFip, requestedCountyFip)
  res.json(countyCsvItem);
});


app.use('/api/geolocation', apiLimiter);

app.post('/api/geolocation/state', async (req, res) => {
  const pos: Position = req.body
  if (!pos || pos.length !== 2) {
    return res.status(400).json({ error: 'Invalid coords' });
  }

  try {
    const state = usStatesGeometries.find(x => isPointInFeature(pos, x));
    if (state == undefined || state == null)
      return res.json(null);
    const stateCsv = getStateCSVItem(state.id as number)
    if (stateCsv == undefined || stateCsv == null)
      return res.json(null);

    const stateInfo = <StateInfo>{
      fip: state.id,
      abbreviation: stateCsv.abbrev,
      name: stateCsv.name,
      properties: state.properties,
      gnisid: stateCsv.gnisid
    };
    return res.json({ stateInfo });
  } catch (error) {
    console.error('State lookup error:', error);
    return res.status(500).json({ error: 'State lookup failed' });
  }
});

app.post('/api/geolocation/county', async (req, res) => {
  const pos: Position = req.body
  if (!pos || pos.length !== 2) {
    return res.status(400).json({ error: 'Invalid coords', pos });
  }

  try {
    const county = usCountiesGeometries.find(x => isPointInFeature(pos, x));
    if (county == undefined || county == null)
      return res.json(null);

    const stateFip = parseInt(county.id.substring(0, 2));
    const countyFip = county.id.substring(2);
    const countyCsvItem: County | undefined = getCountyCSVItem(stateFip, countyFip);

    return res.json({ countyCsvItem });
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

  await preloadCSV();
  await preloadGeometry();

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

