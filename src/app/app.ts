import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GameContainerComponent } from './features/game';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
