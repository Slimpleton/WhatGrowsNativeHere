import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule } from '@angular/material/grid-list';
import { PlantSearchComponent } from '../plant-search/plant-search.component';
import { PlantData } from '../models/gov/models';
import { MatIconModule } from '@angular/material/icon';
import { PlantTileComponent } from '../plant-tile/plant-tile.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ScrollingModule, MatGridListModule, PlantSearchComponent, MatIconModule, PlantTileComponent, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public plantData: Readonly<PlantData>[] = [];
  // private _lastUnfilteredSearch$: Subject<GbifOccurrence[]> = new Subject<GbifOccurrence[]>();
  // private _lastSearch$: Observable<GbifOccurrence[]> = this._lastUnfilteredSearch$.pipe(
  //   //HACK gets all the non copies of plants
  //   map((values) => {
  //     const plantMap: Map<string, GbifOccurrence> = new Map<string, GbifOccurrence>()
  //     values?.map((value: GbifOccurrence) => plantMap.set(value.species, value));
  //     return ([...plantMap.values()] as GbifOccurrence[]);
  //   }),
  //   map((values) => values.sort((x, y) => x.acceptedScientificName.localeCompare(y.acceptedScientificName))),
  // tap((values) => console.log('without duplicates', values)),
  // switchMap((values) => from(values)),
  // // tap((occurrence) => {
  // //   this._gbifService.searchLiterature(occurrence.speciesKey).subscribe((value) => console.log(value));
  // // }),
  // // switchMap((occurrence: GbifOccurrence) => forkJoin([of(occurrence), this._gbifService.isNativeSpecies(occurrence.speciesKey)])),
  // // filter((value: [GbifOccurrence, boolean]) => value[1]),
  // // map((value: [GbifOccurrence, boolean]) => value[0]),
  // reduce((aggregate: GbifOccurrence[], current: GbifOccurrence) => {
  //   aggregate.push(current);
  //   return aggregate;
  // }, [] as GbifOccurrence[]),

  // TODO search each species to ensure its native somehow using gbif service again
  // TODO the socal area used to belong to the tongva people. visit the tongva community garden in pomona to learn more
  // shareReplay(1)
  // );

  // public get lastSearch$(): Observable<GbifOccurrence[]> {
  //   return this._lastSearch$;
  // }

  // PRIORITIES 

  // LOW 
  // TODO possibly use webcrawlers to gather information about local flora using more local websites?? 

  // MEDIUM 
  // TODO on search, might be cool to scrape the web for results on most common name associated with scientific name if i cant find an official mapping 
  // TODO make a calflora service cuz their db is extensive possibly with many records
  // TODO use d3-geo / us-atlas maps to display gbif occurence data and other occurence data??? 
  // TODO use inaturalist api for occurrences as well, research grade only, use for occurrences because its community driven
  // https://explorer.natureserve.org/api-docs/#_species_search OnlyNatives for locationCriteria will get only the native species we search !! might have some info on occurrences here too not sure could also get a combined accurate record of native plants 
  // TODO trefle api has open source botanical indexed plants and stuff too, probably use for occurrences because native declaration is weak


  // HIGH 
  // TODO make a reader for the gbif occurrence download records
  // TODO use d3-geo and us-atlas to display maps of the geo locations
  // Maps are drawn on canvas btw its not like ur unfamiliar with it
  // TODO create indexing file so that searching via common name / scientific name / symbol be fast as fuck boi
  // TODO better home screen scaling


  // TODO use server side prerendering and  https://angular.dev/guide/ssr && https://angular.dev/guide/hydration to work to get the results of searches prerendered in html, therefore allowing better indexing / search times
  // TODO  different index files ??? one for each search variant? can execute all separately on the same file and combine the results ?? <- only good when ssr and prerender and hyrdation
  // I think we do this by analyzing how many different combinations of letters exist within the name??? 
  // i dont fully remember but it was probably a hashmap of letter groups to symbols would work
  //

  // HIGHEST 
  // Remove some of the plants where native data is unsure aka on site it might say not in pfa
  private readonly _MAGIC_MULTIPLIER = 4;
  public readonly itemSize: string = '96px';
  public readonly gutterSize: string = '.25em';
  public readonly rowHeightRatio: string = '1.75:1';
  public columns: number = Math.min(window.innerWidth / (Number.parseInt(this.itemSize) * this._MAGIC_MULTIPLIER), 6);

  public constructor() { }

  @HostListener('screen.orientation.change', ['$event'])
  @HostListener('window:resize', ['$event'])
  onResizeOrRotate(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.columns = width / (Number.parseInt(this.itemSize) * this._MAGIC_MULTIPLIER);
  }

  public clearData(searchStart: boolean): void {
    if (searchStart)
      this.plantData = [];
  }

  public updatePlantData(plantData: ReadonlyArray<Readonly<PlantData>>) {
    // TODO maybe by catching the event emitted via search or differently somehow idk. if i did clear it on search initialization, it would be easy to collect batches until next 
    // TODO calculate avg number of items on screen using variables above + added buffer of items to decide batch size and load what fills the page
    // TODO add awareness of when the search is going off vs when its just adding batches from the last search
    // this.plantData.push(...plantData);
    this.plantData = [...this.plantData, ...plantData];
    console.log(this.plantData, plantData);
  }
}
