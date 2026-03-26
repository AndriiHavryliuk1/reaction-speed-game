import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GAME_CONFIG } from '../../config/game.config';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-score',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss',
})
export class GameScoreComponent {
  private readonly gameService = inject(GameService);
  readonly config = GAME_CONFIG;

  readonly score = this.gameService.score;
  readonly pips = Array.from({ length: this.config.winScore });
}
