import { Component, inject, InjectionToken } from '@angular/core';

export interface TooltipData {
  tooltip: string;
}
export const TOOLTIP_DATA = new InjectionToken<TooltipData>('TOOLTIP_DATA');

@Component({
  selector: 'app-tooltip',
  imports: [],
  template: `
    <div class="tooltip">
      {{ data.tooltip }}
    </div>
    `,
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  public readonly data: TooltipData = inject(TOOLTIP_DATA);
}
