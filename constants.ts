import { ShapeDefinition } from './types';

export const GRID_SIZE = 8;

// We define the base styles for the "glossy" look here.
// Each color has a gradient definition.
export const COLORS = {
  red: 'from-rose-400 to-rose-600 shadow-rose-700',
  orange: 'from-orange-400 to-orange-600 shadow-orange-700',
  yellow: 'from-amber-300 to-amber-500 shadow-amber-600',
  green: 'from-emerald-400 to-emerald-600 shadow-emerald-700',
  cyan: 'from-cyan-300 to-cyan-600 shadow-cyan-700',
  blue: 'from-blue-400 to-blue-600 shadow-blue-700',
  purple: 'from-purple-400 to-purple-600 shadow-purple-700',
  pink: 'from-pink-400 to-pink-600 shadow-pink-700',
  indigo: 'from-indigo-400 to-indigo-600 shadow-indigo-700',
  teal: 'from-teal-400 to-teal-600 shadow-teal-700',
};

const createShape = (id: string, matrix: (0 | 1)[][], color: string): ShapeDefinition => ({
  id,
  matrix,
  color,
});

export const SHAPES: ShapeDefinition[] = [
  // --- SINGLES ---
  createShape('1x1', [[1]], COLORS.red),

  // --- LINES ---
  // 2-Line
  createShape('2x1', [[1, 1]], COLORS.orange),
  createShape('1x2', [[1], [1]], COLORS.orange),
  // 3-Line
  createShape('3x1', [[1, 1, 1]], COLORS.yellow),
  createShape('1x3', [[1], [1], [1]], COLORS.yellow),
  // 4-Line
  createShape('4x1', [[1, 1, 1, 1]], COLORS.cyan),
  createShape('1x4', [[1], [1], [1], [1]], COLORS.cyan),
  // 5-Line
  createShape('5x1', [[1, 1, 1, 1, 1]], COLORS.blue),
  createShape('1x5', [[1], [1], [1], [1], [1]], COLORS.blue),

  // --- SQUARES ---
  // 2x2
  createShape('2x2', [[1, 1], [1, 1]], COLORS.green),
  // 3x3
  createShape('3x3', [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ], COLORS.indigo),

  // --- RECTANGLES ---
  createShape('2x3', [
    [1, 1, 1],
    [1, 1, 1]
  ], COLORS.teal),
  createShape('3x2', [
    [1, 1],
    [1, 1],
    [1, 1]
  ], COLORS.teal),

  // --- SMALL CORNERS (3 Blocks) ---
  createShape('Cor-TL', [[1, 1], [1, 0]], COLORS.pink),
  createShape('Cor-TR', [[1, 1], [0, 1]], COLORS.pink),
  createShape('Cor-BL', [[1, 0], [1, 1]], COLORS.pink),
  createShape('Cor-BR', [[0, 1], [1, 1]], COLORS.pink),

  // --- TETRIS L (4 Blocks) ---
  // L Shape (Orange-ish in Tetris, sticking to our palette)
  createShape('L-Up', [[1, 0], [1, 0], [1, 1]], COLORS.orange),
  createShape('L-Right', [[1, 1, 1], [1, 0, 0]], COLORS.orange),
  createShape('L-Down', [[1, 1], [0, 1], [0, 1]], COLORS.orange),
  createShape('L-Left', [[0, 0, 1], [1, 1, 1]], COLORS.orange),
  // J Shape
  createShape('J-Up', [[0, 1], [0, 1], [1, 1]], COLORS.blue),
  createShape('J-Right', [[1, 0, 0], [1, 1, 1]], COLORS.blue),
  createShape('J-Down', [[1, 1], [1, 0], [1, 0]], COLORS.blue),
  createShape('J-Left', [[1, 1, 1], [0, 0, 1]], COLORS.blue),

  // --- BIG CORNERS (5 Blocks) ---
  createShape('Big-TL', [[1, 1, 1], [1, 0, 0], [1, 0, 0]], COLORS.indigo),
  createShape('Big-TR', [[1, 1, 1], [0, 0, 1], [0, 0, 1]], COLORS.indigo),
  createShape('Big-BL', [[1, 0, 0], [1, 0, 0], [1, 1, 1]], COLORS.indigo),
  createShape('Big-BR', [[0, 0, 1], [0, 0, 1], [1, 1, 1]], COLORS.indigo),

  // --- DIAGONAL / Z / S (4 Blocks) ---
  createShape('Z-H', [[1, 1, 0], [0, 1, 1]], COLORS.red),
  createShape('Z-V', [[0, 1], [1, 1], [1, 0]], COLORS.red),
  createShape('S-H', [[0, 1, 1], [1, 1, 0]], COLORS.green),
  createShape('S-V', [[1, 0], [1, 1], [0, 1]], COLORS.green),

  // --- T SHAPES ---
  createShape('T-Up', [[0, 1, 0], [1, 1, 1]], COLORS.purple),
  createShape('T-Down', [[1, 1, 1], [0, 1, 0]], COLORS.purple),
  createShape('T-Left', [[0, 1], [1, 1], [0, 1]], COLORS.purple),
  createShape('T-Right', [[1, 0], [1, 1], [1, 0]], COLORS.purple),
];