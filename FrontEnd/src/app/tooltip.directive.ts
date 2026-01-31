import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ComponentRef,
  ViewContainerRef,
  EnvironmentInjector,
  Injector
} from '@angular/core';
import { Subject, timer, merge } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { TOOLTIP_DATA, TooltipComponent, TooltipData } from './tooltip/tooltip.component';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

// TODO turn this into extending the eventPluginManager so you can add all the event listeners codewise without hostlisteners and then add actual options to the creation

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  private readonly _mouseEnter$ = new Subject<void>();
  private readonly _mouseLeave$ = new Subject<void>();
  private readonly _touchStart$ = new Subject<void>();
  private readonly _touchEnd$ = new Subject<void>();
  private readonly _touchMove$ = new Subject<void>();
  private static readonly _PRESS_DURATION: number = 1_000;
  private static readonly _MOBILE_DISPLAY_DURATION: number = 2_500;
  private _tooltipComponent: ComponentRef<TooltipComponent> | null = null;
  private _isTooltipVisible: boolean = false;

  @Input() public tooltip: string = '';
  @Input() public tooltipPosition: TooltipPosition = 'top';
  @Input() public tooltipDelay: number = 0;

  constructor(
    private readonly _el: ElementRef,
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _injector: EnvironmentInjector
  ) {
    this._setupHoverTooltip();
    this._setupLongPressTooltip();
  }

  private _setupHoverTooltip(): void {
    this._mouseEnter$
      .pipe(
        switchMap(() => timer(this.tooltipDelay)),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._showTooltip());

    this._mouseLeave$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._hideTooltip());
  }

  private _setupLongPressTooltip(): void {
    const cancelTouch$ = merge(this._touchEnd$, this._touchMove$);

    this._touchStart$
      .pipe(
        switchMap(() => timer(TooltipDirective._PRESS_DURATION).pipe(
          takeUntil(cancelTouch$)
        )),
        switchMap(() => {
          this._showTooltip();
          return timer(TooltipDirective._MOBILE_DISPLAY_DURATION);
        }),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._hideTooltip());
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this._mouseEnter$.next();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this._mouseLeave$.next();
  }

  @HostListener('touchstart')
  public onTouchStart(): void {
    this._touchStart$.next();
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  public onTouchEnd(): void {
    this._touchEnd$.next();
  }

  @HostListener('touchmove')
  public onTouchMove(): void {
    this._touchMove$.next();
  }

  private _showTooltip(): void {
    if (this._isTooltipVisible || !this.tooltip) {
      return;
    }

    this._isTooltipVisible = true;

    const tooltipData: TooltipData = {
      tooltip: this.tooltip,
      position: this.tooltipPosition
    };

    const injector = Injector.create({
      providers: [
        { provide: TOOLTIP_DATA, useValue: tooltipData }
      ],
      parent: this._injector
    });

    this._tooltipComponent = this._viewContainerRef.createComponent(TooltipComponent, {
      injector
    });

    setTimeout(() => {
      if (this._tooltipComponent) {
        const tooltipElement = this._tooltipComponent.location.nativeElement;
        this._positionTooltip(tooltipElement);
      }
    });
  }

  private _hideTooltip(): void {
    if (!this._isTooltipVisible) {
      return;
    }

    this._isTooltipVisible = false;

    if (this._tooltipComponent) {
      const index = this._viewContainerRef.indexOf(this._tooltipComponent.hostView);
      if (index !== -1) {
        this._viewContainerRef.remove(index);
      }
      this._tooltipComponent = null;
    }
  }

  private _positionTooltip(tooltipElement: HTMLElement): void {
    const hostRect = this._el.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    const spacing = 8;

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height - spacing;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY + spacing;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width - spacing;
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + scrollX + spacing;
        break;
    }

    const maxLeft = window.innerWidth - tooltipRect.width - 10;
    const maxTop = window.innerHeight + scrollY - tooltipRect.height - 10;

    left = Math.max(10, Math.min(left, maxLeft));
    top = Math.max(scrollY + 10, Math.min(top, maxTop));

    tooltipElement.style.position = 'fixed';
    tooltipElement.style.top = `${top}px`;
    tooltipElement.style.left = `${left}px`;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._hideTooltip();
  }
}