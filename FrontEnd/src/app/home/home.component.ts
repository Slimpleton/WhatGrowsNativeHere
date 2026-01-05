import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport, } from '@angular/cdk/scrolling';
import { PlantSearchComponent } from '../plant-search/plant-search.component';
import { PlantData } from '../models/gov/models';
import { PlantTileComponent } from '../plant-tile/plant-tile.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { isPlatformBrowser, } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport, CdkVirtualForOf, PlantSearchComponent, PlantTileComponent, NavBarComponent],
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

  // TODO the socal area used to belong to the tongva people. visit the tongva community garden in pomona to learn more
  // shareReplay(1)
  // );

  // public get lastSearch$(): Observable<GbifOccurrence[]> {
  //   return this._lastSearch$;
  // }

  // PRIORITIES 
  // MEDIUM 
  // TODO make a calflora service cuz their db is extensive possibly with many records
  // TODO use d3-geo / us-atlas maps to display gbif occurence data and other occurence data??? 
  // TODO use inaturalist api for occurrences as well, research grade only, use for occurrences because its community driven
  // https://explorer.natureserve.org/api-docs/#_species_search OnlyNatives for locationCriteria will get only the native species we search !! might have some info on occurrences here too not sure could also get a combined accurate record of native plants 
  // TODO trefle api has open source botanical indexed plants and stuff too, probably use for occurrences because native declaration is weak


  // HIGH 
  // TODO make a reader for the gbif occurrence download records
  // TODO use d3-geo and us-atlas to display maps of the geo locatoins
  // TODO inaturalist images from occurrences, look for non copyright 
  // Maps are drawn on canvas btw its not like ur unfamiliar with it

  // TODO group the plant items into column rows based on the generated column number / result size
  public readonly itemSize: number = 248;
  public readonly itemWidth: number = this.itemSize * 1.5;
  public readonly gutterSize: number = 4;

  public columns: number = 1;
  public constructor(@Inject(PLATFORM_ID) private readonly _platformId: object, private readonly _cdr: ChangeDetectorRef) {
    afterNextRender({
      write: () => {
        this.calculateColumns();
      }
    });
  }

  private calculateColumns() {
    if (isPlatformBrowser(this._platformId)) {
      // TODO account for the gaps between columns
      const windowWidth = window.innerWidth;
      this.columns = Math.floor(windowWidth / (this.itemWidth));
      this._cdr.markForCheck();
    }
  }

  @HostListener('screen.orientation.change', ['$event'])
  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResizeOrRotate(_: Event) {
    this.calculateColumns();
  }

  public clearData(searchStart: boolean): void {
    if (searchStart) {
      this.plantData = [];
      this._cdr.markForCheck();
    }

  }

  public updatePlantData(receivedPlantData: ReadonlyArray<Readonly<PlantData>>) {
    // TODO calculate avg number of items on screen using variables above + added buffer of items to decide batch size and load what fills the page
    this.plantData = [...this.plantData, ...receivedPlantData];
    this._cdr.markForCheck();

  }

  public trackByPlant(_: number, plant: PlantData): string {
    return plant.acceptedSymbol;
  }
}
