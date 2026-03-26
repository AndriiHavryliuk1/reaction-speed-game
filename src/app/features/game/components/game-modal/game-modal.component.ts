import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { GameResult } from '../../models/game.model';

@Component({
  selector: 'app-game-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogComponent],
  templateUrl: './game-modal.component.html',
  styleUrl: './game-modal.component.scss',
})
export class GameModalComponent {
  readonly result = input.required<GameResult>();
  readonly close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
