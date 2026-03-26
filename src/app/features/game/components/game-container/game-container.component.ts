import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';

import { GameBoardComponent } from '../game-board/game-board.component';
import { GameControlsComponent } from '../game-controls/game-controls.component';
import { GameCountdownComponent } from '../game-countdown/game-countdown.component';
import { GameScoreComponent } from '../game-score/game-score.component';
import { GameModalComponent } from '../game-modal/game-modal.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GameBoardComponent,
    GameControlsComponent,
    GameCountdownComponent,
    GameScoreComponent,
    GameModalComponent,
  ],
  templateUrl: './game-container.component.html',
  styleUrl: './game-container.component.scss',
})
export class GameContainerComponent {
  private readonly gameService = inject(GameService);
  private readonly boardAnchor = viewChild<ElementRef<HTMLElement>>('boardAnchor');

  readonly gameResult = this.gameService.gameResult;

  constructor() {
    effect(() => {
      if (this.gameService.isPreparing()) {
        // Wait for 1–2 frames so mobile browsers (iOS Safari) can finish
        // dismissing the keyboard and applying viewport/layout changes.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.boardAnchor()?.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest',
            });
          });
        });
      }
    });
  }

  onModalClose(): void {
    this.gameService.dismissResult();
  }
}
