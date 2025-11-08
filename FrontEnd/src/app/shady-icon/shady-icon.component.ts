import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'shady-icon',
  imports: [MatIconModule],
  template: `
                              <div style="display: grid; grid: 1fr 1fr;">
                                <mat-icon class="overlapped-icon sun overlapped-sun">sunny</mat-icon>
                                <mat-icon class="overlapped-icon cloud overlapped-cloud">cloud</mat-icon>
                            </div>`,
  styleUrl: './shady-icon.component.css'
})
export class ShadyIconComponent {

}
