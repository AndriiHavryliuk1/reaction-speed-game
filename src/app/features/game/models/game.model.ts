export type CellState = 'idle' | 'active' | 'success' | 'fail';

export type GameWinner = 'player' | 'computer';

export interface Cell {
  readonly index: number;
  readonly state: CellState;
}

export interface GameScore {
  readonly player: number;
  readonly computer: number;
}

export interface GameResult {
  readonly winner: GameWinner;
  readonly score: GameScore;
}
