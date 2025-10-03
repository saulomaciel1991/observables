import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Lab } from "./lab/lab";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Lab],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('observables-lab');
}
