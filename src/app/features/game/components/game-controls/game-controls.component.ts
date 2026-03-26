import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { GAME_CONFIG } from '../../config/game.config';
import { GameService } from '../../services/game.service';

interface IntervalErrors {
  readonly min?: true;
  readonly max?: true;
  readonly integer?: true;
}

@Component({
  selector: 'app-game-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
})
export class GameControlsComponent {
  private readonly gameService = inject(GameService);
  readonly config = GAME_CONFIG;

  readonly isRunning = this.gameService.isRunning;
  readonly isPreparing = this.gameService.isPreparing;

  readonly intervalValue = signal<number>(this.config.defaultIntervalMs);
  readonly isTouched = signal(false);

  readonly errors = computed<IntervalErrors | null>(() => {
    const value = this.intervalValue();
    const errs: IntervalErrors = {
      ...(value < this.config.minIntervalMs && { min: true }),
      ...(value > this.config.maxIntervalMs && { max: true }),
      ...(!Number.isInteger(value) && { integer: true }),
    };
    return Object.keys(errs).length ? errs : null;
  });

  readonly isValid = computed(() => this.errors() === null);
  readonly showErrors = computed(() => this.isTouched() && !this.isValid());

  onInput(event: Event): void {
    this.intervalValue.set(Number((event.target as HTMLInputElement).value));
  }

  onBlur(): void {
    this.isTouched.set(true);
  }

  startGame(): void {
    this.isTouched.set(true);
    if (!this.isValid()) {
      return;
    }
    // iOS Safari will zoom in on focused inputs with small font-size.
    // Blurring on Start dismisses the keyboard and returns the viewport to normal.
    (document.activeElement as HTMLElement | null)?.blur?.();
    this.gameService.setIntervalMs(this.intervalValue());
    this.gameService.startGame();
  }
}
