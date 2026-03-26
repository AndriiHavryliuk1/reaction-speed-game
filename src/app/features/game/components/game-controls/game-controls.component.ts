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
  readonly required?: true;
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

  readonly intervalText = signal<string>(String(this.config.defaultIntervalMs));
  readonly isInteracted = signal(false);

  readonly intervalValue = computed<number | null>(() => {
    const text = this.intervalText().trim();
    if (text === '') {
      return null;
    }
    const value = Number(text);
    return Number.isFinite(value) ? value : null;
  });

  readonly errors = computed<IntervalErrors | null>(() => {
    const value = this.intervalValue();
    if (value === null) {
      return { required: true };
    }
    const errs: IntervalErrors = {
      ...(value < this.config.minIntervalMs && { min: true }),
      ...(value > this.config.maxIntervalMs && { max: true }),
      ...(!Number.isInteger(value) && { integer: true }),
    };
    return Object.keys(errs).length ? errs : null;
  });

  readonly isValid = computed(() => this.errors() === null);
  readonly showErrors = computed(() => this.isInteracted() && !this.isValid());

  onInput(event: Event): void {
    this.intervalText.set((event.target as HTMLInputElement).value);
    this.isInteracted.set(true);
  }

  onBlur(): void {
    this.isInteracted.set(true);
  }

  startGame(): void {
    this.isInteracted.set(true);
    if (!this.isValid()) {
      return;
    }
    // iOS Safari will zoom in on focused inputs with small font-size.
    // Blurring on Start dismisses the keyboard and returns the viewport to normal.
    (document.activeElement as HTMLElement | null)?.blur?.();
    const value = this.intervalValue();
    if (value === null) return;
    this.gameService.setIntervalMs(value);
    this.gameService.startGame();
  }
}
