export type Cell = string | null; // string is the color ID, null is empty
export type GridType = Cell[][];

export interface Point {
  r: number;
  c: number;
}

export interface ShapeDefinition {
  id: string;
  matrix: (0 | 1)[][]; // 1 means occupied
  color: string;
}

export interface DraggableShapeProps {
  shape: ShapeDefinition;
  index: number;
  onDragStart: (shapeIndex: number) => void;
  onDragEnd: (shapeIndex: number, clientX: number, clientY: number) => void;
  disabled: boolean;
}
