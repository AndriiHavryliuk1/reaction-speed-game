import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-countdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-countdown.component.html',
  styleUrl: './game-countdown.component.scss',
})
export class GameCountdownComponent {
  readonly countdown = inject(GameService).countdown;
}
