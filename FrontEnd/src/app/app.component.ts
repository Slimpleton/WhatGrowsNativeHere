import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconService } from './services/icon.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'what-grows-native-here';

  public constructor(private readonly _iconService: IconService) {
  }

  public ngOnInit(): void {
    this._iconService.registerIcons();
  }
}
