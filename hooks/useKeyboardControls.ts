import { useState, useEffect } from 'react';
import { Point, ShapeDefinition } from '../types';
import { GRID_SIZE } from '../constants';

interface UseKeyboardControlsProps {
  currentShapes: (ShapeDefinition | null)[];
  onPlace: (index: number, pos: Point) => boolean;
  isGameOver: boolean;
}

export const useKeyboardControls = ({ currentShapes, onPlace, isGameOver }: UseKeyboardControlsProps) => {
  const [mode, setMode] = useState<'TRAY' | 'GRID'>('TRAY');
  const [trayIndex, setTrayIndex] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<Point>({ r: 3, c: 3 });
  const [shake, setShake] = useState(false);

  // Auto-select first available shape if current selection is invalid/null
  // or initial load
  useEffect(() => {
    if (isGameOver) return;
    
    // If currently selected is null (used), try to find one
    if (currentShapes[trayIndex] === null) {
        const firstAvailable = currentShapes.findIndex(s => s !== null);
        if (firstAvailable !== -1) {
            setTrayIndex(firstAvailable);
        }
    }
  }, [currentShapes, trayIndex, isGameOver]);

  // Handle keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isGameOver) return;
        
        // Prevent default scrolling for game keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (mode === 'TRAY') {
            if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
                // Cycle backwards looking for non-null
                let next = trayIndex - 1;
                if (next < 0) next = currentShapes.length - 1;
                
                let attempts = 0;
                while (currentShapes[next] === null && attempts < 4) {
                     next--;
                     if (next < 0) next = currentShapes.length - 1;
                     attempts++;
                }
                if (currentShapes[next]) setTrayIndex(next);

            } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
                // Cycle forwards
                let next = trayIndex + 1;
                if (next >= currentShapes.length) next = 0;
                
                let attempts = 0;
                while (currentShapes[next] === null && attempts < 4) {
                     next++;
                     if (next >= currentShapes.length) next = 0;
                     attempts++;
                }
                if (currentShapes[next]) setTrayIndex(next);

            } else if ([' ', 'Enter'].includes(e.key)) {
                if (currentShapes[trayIndex]) {
                    setMode('GRID');
                    // Center cursor
                    const shape = currentShapes[trayIndex];
                    if (shape) {
                        const rOffset = Math.floor(shape.matrix.length / 2);
                        const cOffset = Math.floor(shape.matrix[0].length / 2);
                        setCursorPos({ 
                            r: Math.floor(GRID_SIZE / 2) - rOffset, 
                            c: Math.floor(GRID_SIZE / 2) - cOffset 
                        });
                    } else {
                        setCursorPos({ r: 3, c: 3 });
                    }
                }
            }
        } else if (mode === 'GRID') {
            if (['ArrowUp', 'w', 'W'].includes(e.key)) {
                setCursorPos(p => ({ ...p, r: Math.max(0, p.r - 1) }));
            } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
                setCursorPos(p => ({ ...p, r: Math.min(GRID_SIZE - 1, p.r + 1) }));
            } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
                setCursorPos(p => ({ ...p, c: Math.max(0, p.c - 1) }));
            } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
                setCursorPos(p => ({ ...p, c: Math.min(GRID_SIZE - 1, p.c + 1) }));
            } else if ([' ', 'Enter'].includes(e.key)) {
                const success = onPlace(trayIndex, cursorPos);
                if (success) {
                    setMode('TRAY');
                    // Selection update handled by first useEffect
                } else {
                    // Trigger shake feedback
                    setShake(true);
                    setTimeout(() => setShake(false), 300);
                }
            } else if (['Escape', 'Backspace'].includes(e.key)) {
                setMode('TRAY');
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, trayIndex, currentShapes, isGameOver, onPlace, cursorPos]);

  return {
    keyboardMode: mode,
    keyboardTrayIndex: trayIndex,
    keyboardCursorPos: cursorPos,
    isShaking: shake,
    setKeyboardMode: setMode,
    setKeyboardTrayIndex: setTrayIndex
  };
};