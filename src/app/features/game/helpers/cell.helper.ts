import { Cell, CellState } from '../models/game.model';

export function createInitialCells(gridSize: number): Cell[] {
  return Array.from({ length: gridSize }, (_, i) => ({
    index: i,
    state: 'idle' as CellState,
  }));
}
