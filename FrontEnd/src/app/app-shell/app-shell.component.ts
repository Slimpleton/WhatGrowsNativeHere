import { Component } from "@angular/core";
import { RouterOutlet, RouterLinkWithHref } from "@angular/router";
import { TranslocoPipe } from "@jsverse/transloco";
import { Route } from "../app.routes";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TranslocoPipe, RouterLinkWithHref],
  templateUrl: 'app-shell.component.html',
  styleUrl: 'app-shell.component.css'
})
export class AppShellComponent {
  public Route = Route;
  public constructor() {
  }
}