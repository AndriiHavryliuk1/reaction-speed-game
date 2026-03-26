import { Injectable, computed, signal } from '@angular/core';

import { GAME_CONFIG } from '../config/game.config';
import { Cell, CellState, GameResult, GameScore, GameWinner } from '../models/game.model';
import { createInitialCells } from '../helpers/cell.helper';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly _cells = signal<Cell[]>(createInitialCells(GAME_CONFIG.gridSize));
  private readonly _score = signal<GameScore>({ player: 0, computer: 0 });
  private readonly _isRunning = signal(false);
  private readonly _gameResult = signal<GameResult | null>(null);
  private readonly _intervalMs = signal<number>(GAME_CONFIG.defaultIntervalMs);
  private readonly _countdown = signal<number | null>(null);

  readonly cells = this._cells.asReadonly();
  readonly score = this._score.asReadonly();
  readonly isRunning = this._isRunning.asReadonly();
  readonly gameResult = this._gameResult.asReadonly();
  readonly countdown = this._countdown.asReadonly();

  readonly isPreparing = computed(() => this._countdown() !== null);

  private roundTimer: ReturnType<typeof setTimeout> | null = null;
  private countdownTimer: ReturnType<typeof setTimeout> | null = null;
  private currentActiveCellIndex: number | null = null;

  setIntervalMs(ms: number): void {
    this._intervalMs.set(ms);
  }

  startGame(): void {
    this.resetState();
    this.beginCountdown(GAME_CONFIG.countdownSeconds);
  }

  handleCellClick(index: number): void {
    if (!this._isRunning() || this.currentActiveCellIndex !== index) {
      return;
    }

    this.clearRoundTimer();
    this.setCellState(index, 'success');
    this.currentActiveCellIndex = null;

    const updated: GameScore = {
      ...this._score(),
      player: this._score().player + 1,
    };
    this._score.set(updated);

    if (updated.player >= GAME_CONFIG.winScore) {
      this.finishGame('player');
      return;
    }

    this.scheduleNextRound();
  }

  dismissResult(): void {
    this._gameResult.set(null);
  }

  private beginCountdown(value: number): void {
    if (value <= 0) {
      this._countdown.set(null);
      this._isRunning.set(true);
      this.scheduleNextRound();
      return;
    }

    this._countdown.set(value);
    this.countdownTimer = setTimeout(() => this.beginCountdown(value - 1), 1000);
  }

  private scheduleNextRound(): void {
    const availableIndices = this._cells().reduce<number[]>((acc, c) => {
      if (c.state === 'idle') acc.push(c.index);
      return acc;
    }, []);

    if (availableIndices.length === 0) {
      this.finishGame(
        this._score().player > this._score().computer ? 'player' : 'computer',
      );
      return;
    }

    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];

    this.currentActiveCellIndex = randomIndex;
    this.setCellState(randomIndex, 'active');

    this.roundTimer = setTimeout(() => {
      this.onRoundTimeout(randomIndex);
    }, this._intervalMs());
  }

  private onRoundTimeout(cellIndex: number): void {
    this.setCellState(cellIndex, 'fail');
    this.currentActiveCellIndex = null;

    const updated: GameScore = {
      ...this._score(),
      computer: this._score().computer + 1,
    };
    this._score.set(updated);

    if (updated.computer >= GAME_CONFIG.winScore) {
      this.finishGame('computer');
      return;
    }

    this.scheduleNextRound();
  }

  private finishGame(winner: GameWinner): void {
    this._isRunning.set(false);
    this.clearRoundTimer();
    this._gameResult.set({ winner, score: this._score() });
  }

  private setCellState(index: number, state: CellState): void {
    this._cells.update((cells) =>
      cells.map((c) => (c.index === index ? { ...c, state } : c)),
    );
  }

  private clearRoundTimer(): void {
    if (this.roundTimer !== null) {
      clearTimeout(this.roundTimer);
      this.roundTimer = null;
    }
  }

  private clearCountdownTimer(): void {
    if (this.countdownTimer !== null) {
      clearTimeout(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private resetState(): void {
    this.clearCountdownTimer();
    this.clearRoundTimer();
    this.currentActiveCellIndex = null;
    this._countdown.set(null);
    this._score.set({ player: 0, computer: 0 });
    this._gameResult.set(null);
    this._cells.set(createInitialCells(GAME_CONFIG.gridSize));
  }
}
