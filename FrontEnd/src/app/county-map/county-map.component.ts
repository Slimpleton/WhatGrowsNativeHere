// import { afterNextRender, AfterViewInit, Component, ElementRef, Inject, Injector, PLATFORM_ID, runInInjectionContext, ViewChild } from '@angular/core';
// import { PositionService } from '../services/position.service';
// import { filter, takeUntil, tap } from 'rxjs/operators';
// import { combineCountyFIP, County, CountyCSVItem, StateCSVItem } from '../models/gov/models';
// import { NavBarComponent } from '../nav-bar/nav-bar.component';
// import { isPlatformBrowser } from '@angular/common';
// import { TranslocoModule } from '@jsverse/transloco';
// import { Subject } from 'rxjs';

// const [d3, { mesh, feature }, us]: [any, any, any] = await Promise.all([
//   import('d3'),
//   import('topojson-client'),
//   import('../../assets/counties-albers-10m.json')
// ]);

// @Component({
//   selector: 'app-county-map',
//   imports: [NavBarComponent, TranslocoModule,],
//   templateUrl: './county-map.component.html',
//   styleUrl: './county-map.component.css'
// })
// export class CountyMapComponent implements AfterViewInit {
//   private readonly _destroy$: Subject<void> = new Subject<void>();
//   public combineCountyFIP = combineCountyFIP;

//   public readonly states: StateCSVItem[] = this.fileService.states.sort((a, b) => a.name.localeCompare(b.name));

//   // Only need to be sorted once
//   private readonly allCounties = this.fileService.counties.sort((a, b) => a.countyName.localeCompare(b.countyName));

//   // Not reloading the counties list on selectedStateFip change, maybe use a setter to pop that off
//   private _counties = this.allCounties.filter((x) => x.stateFip == this.selectedStateFIP);
//   public get counties(): CountyCSVItem[] {
//     return this._counties;
//   }
//   private set counties(stateFip: number | undefined) {
//     this._counties = this.allCounties.filter((x) => x.stateFip === stateFip);
//     this._selectedCountyFIP = combineCountyFIP(this._counties[0]);
//   }

//   private _selectedStateFIP: number | undefined = undefined;
//   public get selectedStateFIP(): number | undefined {
//     return this._selectedStateFIP;
//   }
//   public set selectedStateFIP(value: number) {
//     this._selectedStateFIP = value;
//     this.counties = this.selectedStateFIP;
//   }

//   private _selectedCountyFIP: string | undefined = undefined;
//   public get selectedCountyFIP(): string | undefined {
//     return this._selectedCountyFIP;
//   }

//   public set selectedCountyFIP(value: string) {
//     this._selectedCountyFIP = value;
//     // TODO overwrite the position service value ?? make an overwrite public call to manually select a county
//     // TODO maybe only overwrite when we navigate away with a selected county???
//   }
//   // TODO make it so that this setter is a lookup for the name instead of setting the name manually every time so it uses this when we load in too
//   // dude im so fucking smart

//   public getSelectedCounty(): string | null {
//     if (this.selectedCountyFIP == undefined || this.selectedStateFIP == undefined)
//       return null;
//     const selectedCounty: County = { stateFip: this.selectedStateFIP, countyFip: this.selectedCountyFIP };
//     return combineCountyFIP(selectedCounty);
//   }

//   public onStateChange(event: Event) {
//     const select = event.target as HTMLSelectElement;
//     this.selectedStateFIP = parseInt(select.value, 10);

//     // Optionally select first county automatically
//     if (this.counties && this.counties.length > 0) {
//       this.selectedCountyFIP = this.combineCountyFIP(this.counties[0]);
//     }
//   }

//   public onCountyChange(event: Event) {
//     const select = event.target as HTMLSelectElement;
//     this.selectedCountyFIP = select.value;
//   }

//   public countyName: string | undefined | null = undefined;
//   @ViewChild('mapCanvas') private readonly _canvas!: ElementRef<HTMLCanvasElement>;

//   // TODO canvas cannot draw on angular ssr, if we switch to a plain svg drawn to an image and attach event listeners to diff areas, that would work for ssr
//   public constructor(@Inject(PLATFORM_ID) private readonly _platformId: object, private readonly _positionService: PositionService, private readonly _injector: Injector) { }
//   public ngAfterViewInit(): void {
//     runInInjectionContext(this._injector, () => {
//       if (isPlatformBrowser(this._platformId))
//         afterNextRender({
//           write: () => {
//             const context = this._canvas.nativeElement.getContext('2d');
//             if (!context)
//               return;

//             this._canvas.nativeElement.addEventListener('click', (ev: MouseEvent) => {
//               const x: number = ev.offsetX;
//               const y: number = ev.offsetY;
//               console.log(x, y);
//             });

//             const path = d3.geoPath(null, context);
//             context.lineJoin = "round";
//             context.lineCap = "round";

//             this.drawEntireMap(context, path);

//             this._positionService.countyEmitter$.pipe(
//               filter((x) => x != null),
//               tap((county: County) => {
//                 const fip: string = combineCountyFIP(county);
//                 this._selectedStateFIP = county.stateFip;
//                 this._selectedCountyFIP = fip;
//                 this.drawCountyLine(context, path, fip);
//                 this.countyName = this.fileService.getCounty(fip)?.countyName;
//               }),
//               takeUntil(this._destroy$)
//             ).subscribe();
//           }
//         });
//     })
//   }


//   private drawEntireMap(context: CanvasRenderingContext2D, path: d3.GeoPath<any, d3.GeoPermissibleObjects>) {
//     context.beginPath();
//     path(mesh(us, us.objects.counties, (a: any, b: any) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)));
//     context.lineWidth = 0.5;
//     context.strokeStyle = "#000";
//     context.stroke();

//     context.beginPath();
//     path(mesh(us, us.objects.states, (a: any, b: any) => a !== b));
//     context.lineWidth = 0.5;
//     context.strokeStyle = "#000";
//     context.stroke();

//     context.beginPath();
//     path(feature(us, us.objects.nation));
//     context.lineWidth = 1;
//     context.strokeStyle = "#000";
//     context.stroke();
//   }

//   private drawCountyLine(context: CanvasRenderingContext2D, path: d3.GeoPath<any, d3.GeoPermissibleObjects>, fullFip: string) {
//     context.beginPath();
//     // TODO this filter is mostly working?? not fully idk some bottom ca counties are missing not sure why
//     path(mesh(us, us.objects.counties, (a: any, b: any) => a.id === fullFip || b.id == fullFip));
//     context.strokeStyle = '#fff';
//     context.lineWidth = 2;
//     context.stroke();
//   }
// }
