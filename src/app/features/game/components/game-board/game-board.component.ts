import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GameCellComponent } from '../game-cell/game-cell.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GameCellComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  private readonly gameService = inject(GameService);

  readonly cells = this.gameService.cells;

  onBoardClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-index]');
    if (!button) {
      return;
    }

    const index = Number(button.dataset['index']);
    this.gameService.handleCellClick(index);
  }
}
