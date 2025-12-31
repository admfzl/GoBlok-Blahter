import { GridType, Point, ShapeDefinition } from '../types';
import { GRID_SIZE } from '../constants';

export const createEmptyGrid = (): GridType => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

export const canPlaceShape = (grid: GridType, shape: ShapeDefinition, position: Point): boolean => {
  for (let r = 0; r < shape.matrix.length; r++) {
    for (let c = 0; c < shape.matrix[r].length; c++) {
      if (shape.matrix[r][c] === 1) {
        const gridR = position.r + r;
        const gridC = position.c + c;

        // Check bounds
        if (gridR < 0 || gridR >= GRID_SIZE || gridC < 0 || gridC >= GRID_SIZE) {
          return false;
        }

        // Check collision
        if (grid[gridR][gridC] !== null) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeShape = (grid: GridType, shape: ShapeDefinition, position: Point): GridType => {
  const newGrid = grid.map(row => [...row]);
  for (let r = 0; r < shape.matrix.length; r++) {
    for (let c = 0; c < shape.matrix[r].length; c++) {
      if (shape.matrix[r][c] === 1) {
        newGrid[position.r + r][position.c + c] = shape.color;
      }
    }
  }
  return newGrid;
};

export const checkLines = (grid: GridType): { newGrid: GridType; clearedRows: number[]; clearedCols: number[] } => {
  const clearedRows: number[] = [];
  const clearedCols: number[] = [];
  const newGrid = grid.map(row => [...row]);

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    if (newGrid[r].every(cell => cell !== null)) {
      clearedRows.push(r);
    }
  }

  // Check cols
  for (let c = 0; c < GRID_SIZE; c++) {
    let full = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (newGrid[r][c] === null) {
        full = false;
        break;
      }
    }
    if (full) {
      clearedCols.push(c);
    }
  }

  // Clear cells
  // We need to clear any cell that is in a cleared row OR a cleared column
  if (clearedRows.length > 0 || clearedCols.length > 0) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (clearedRows.includes(r) || clearedCols.includes(c)) {
          newGrid[r][c] = null;
        }
      }
    }
  }

  return { newGrid, clearedRows, clearedCols };
};

export const hasValidMoves = (grid: GridType, shapes: (ShapeDefinition | null)[]): boolean => {
  const availableShapes = shapes.filter((s): s is ShapeDefinition => s !== null);
  
  if (availableShapes.length === 0) return true; // Waiting for refill, technically not game over

  for (const shape of availableShapes) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlaceShape(grid, shape, { r, c })) {
          return true;
        }
      }
    }
  }
  return false;
};
