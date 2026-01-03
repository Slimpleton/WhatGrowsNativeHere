import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private static readonly icons: string[] = ['search', 'sunny', 'cloud', 'partly_cloudy_day', 'photo_size_select_actual', 'question_mark', 'sort_by_alpha'];

  public constructor(private readonly _matIconRegistry: MatIconRegistry, private readonly _domSanitizer: DomSanitizer) { }

  public registerIcons() {
    // Register individual SVG icons
    IconService.icons.forEach(icon => {
      this._matIconRegistry.addSvgIcon(icon, this._domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`));
    });
  }
}
