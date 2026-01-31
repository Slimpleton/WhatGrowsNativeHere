import { Component, inject, InjectionToken } from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipData {
  tooltip: string;
  position: TooltipPosition;
}
export const TOOLTIP_DATA = new InjectionToken<TooltipData>('TOOLTIP_DATA');

@Component({
  selector: 'app-tooltip',
  imports: [],
  template: `
    <div class="tooltip" [attr.data-position]="data.position">
      {{ data.tooltip }}
    </div>
    `,
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  public readonly data: TooltipData = inject(TOOLTIP_DATA);
}
