import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pic-search-icon',
  imports: [IconComponent],
  templateUrl: './pic-search-icon.component.html',
  styleUrl: './pic-search-icon.component.css'
})
export class PicSearchIconComponent {

}
