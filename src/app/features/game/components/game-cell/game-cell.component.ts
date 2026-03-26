import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Cell } from '../../models/game.model';

@Component({
  selector: 'app-game-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-cell.component.html',
  styleUrl: './game-cell.component.scss',
})
export class GameCellComponent {
  readonly cell = input.required<Cell>();
}
