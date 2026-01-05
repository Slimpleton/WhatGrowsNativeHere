import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TranslocoPipe],
  templateUrl: 'app-shell.component.html',
  styleUrl: 'app-shell.component.css'
})
export class AppShellComponent {
  public constructor() {
  }
}