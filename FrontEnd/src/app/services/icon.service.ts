import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);
  private static readonly icons: string[] = ['search', 'sunny', 'cloud', 'partly_cloudy_day', 'photo_size_select_actual', 'question_mark', 'sort_by_alpha'];

  public registerIcons() {
    // Register individual SVG icons
    IconService.icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(icon, this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`));
    });
  }
}
