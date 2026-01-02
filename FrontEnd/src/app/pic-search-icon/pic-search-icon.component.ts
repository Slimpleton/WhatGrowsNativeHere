import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pic-search-icon',
  imports: [MatIconModule],
  templateUrl: './pic-search-icon.component.html',
  styleUrl: './pic-search-icon.component.css'
})
export class PicSearchIconComponent {

}
