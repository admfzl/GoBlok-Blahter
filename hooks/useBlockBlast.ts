import { useState, useCallback, useEffect } from 'react';
import { GridType, ShapeDefinition, Point } from '../types';
import { SHAPES } from '../constants';
import { createEmptyGrid, canPlaceShape, placeShape, checkLines, hasValidMoves } from '../lib/gameUtils';

// --- Smart Shape Generation Logic ---
const SHAPE_COSTS = SHAPES.map(s => ({
    shape: s,
    size: s.matrix.flat().filter(x => x === 1).length
}));

const SMALL_SHAPES = SHAPE_COSTS.filter(x => x.size <= 3).map(x => x.shape);
const MEDIUM_SHAPES = SHAPE_COSTS.filter(x => x.size === 4).map(x => x.shape);
const LARGE_SHAPES = SHAPE_COSTS.filter(x => x.size >= 5).map(x => x.shape);

const getSmartShapes = () => {
    const pick = (arr: ShapeDefinition[]) => arr[Math.floor(Math.random() * arr.length)];
    
    // Slot 1: High chance of Small/Medium (Playable)
    const s1 = Math.random() < 0.6 ? pick(SMALL_SHAPES) : pick(MEDIUM_SHAPES);
    
    // Slot 2: Balanced mix
    let s2;
    const r2 = Math.random();
    if (r2 < 0.35) s2 = pick(SMALL_SHAPES);
    else if (r2 < 0.85) s2 = pick(MEDIUM_SHAPES);
    else s2 = pick(LARGE_SHAPES);

    // Slot 3: Wildcard (but weighted slightly against Large to avoid "Death Rolls")
    let s3;
    const r3 = Math.random();
    if (r3 < 0.25) s3 = pick(SMALL_SHAPES);
    else if (r3 < 0.75) s3 = pick(MEDIUM_SHAPES);
    else s3 = pick(LARGE_SHAPES);

    return [s1, s2, s3];
};

export interface Popup {
    id: number;
    r: number;
    c: number;
    text: string;
    type: 'score' | 'combo' | 'clear';
}

export const useBlockBlast = () => {
  const [grid, setGrid] = useState<GridType>(createEmptyGrid());
  const [currentShapes, setCurrentShapes] = useState<(ShapeDefinition | null)[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Animation states
  const [clearingLines, setClearingLines] = useState<{ rows: number[], cols: number[] }>({ rows: [], cols: [] });
  const [comboCount, setComboCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);

  // Initialize
  useEffect(() => {
    const savedHigh = localStorage.getItem('blockBlastHighScore');
    if (savedHigh) setHighScore(parseInt(savedHigh, 10));
    setCurrentShapes(getSmartShapes());
  }, []);

  const addPopup = useCallback((r: number, c: number, text: string, type: 'score' | 'combo' | 'clear') => {
      const id = Date.now() + Math.random();
      setPopups(prev => [...prev, { id, r, c, text, type }]);
      setTimeout(() => {
          setPopups(prev => prev.filter(p => p.id !== id));
      }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    setIsGameOver(false);
    setCurrentShapes(getSmartShapes());
    setComboCount(0);
    setIsProcessing(false);
    setClearingLines({ rows: [], cols: [] });
    setPopups([]);
  }, []);

  const handleShapeDrop = useCallback((shapeIndex: number, target: Point | null) => {
    if (isGameOver || isProcessing || shapeIndex < 0 || shapeIndex >= currentShapes.length) return false;

    const shape = currentShapes[shapeIndex];
    if (!shape || !target) return false;

    if (canPlaceShape(grid, shape, target)) {
      // 1. Place shape
      const placedGrid = placeShape(grid, shape, target);
      
      const blocksPlaced = shape.matrix.flat().filter(x => x === 1).length;
      let moveScore = blocksPlaced;

      // Calculate center of shape for popup
      const rCenter = target.r + Math.floor(shape.matrix.length / 2);
      const cCenter = target.c + Math.floor(shape.matrix[0].length / 2);

      // 2. Remove shape from tray
      const newShapes = [...currentShapes];
      newShapes[shapeIndex] = null;
      setCurrentShapes(newShapes);

      // 3. Check for lines
      const { newGrid: gridAfterClear, clearedRows, clearedCols } = checkLines(placedGrid);
      const totalLines = clearedRows.length + clearedCols.length;

      if (totalLines > 0) {
        setIsProcessing(true); 
        setGrid(placedGrid); 
        
        // Complex scoring
        const baseLineScore = 10 * totalLines;
        const comboBonus = comboCount * 15 * totalLines; 
        const multiLineBonus = totalLines > 1 ? totalLines * 20 : 0;
        const clearPoints = baseLineScore + comboBonus + multiLineBonus;
        
        moveScore += clearPoints;
        
        const newCombo = comboCount + 1;
        setComboCount(newCombo);

        // Visuals
        setClearingLines({ rows: clearedRows, cols: clearedCols });
        
        // Show Score Popup for placement
        addPopup(rCenter, cCenter, `+${moveScore}`, totalLines > 1 || newCombo > 1 ? 'combo' : 'score');
        
        if (newCombo > 1) {
             setTimeout(() => addPopup(rCenter, cCenter, `${newCombo}x COMBO!`, 'combo'), 200);
        }

        setTimeout(() => {
            setGrid(gridAfterClear);
            setClearingLines({ rows: [], cols: [] });
            setScore(prev => prev + moveScore);
            handlePostTurnLogic(gridAfterClear, newShapes);
            setIsProcessing(false);
        }, 200);

      } else {
        setGrid(placedGrid);
        setComboCount(0);
        setScore(prev => prev + moveScore);
        addPopup(rCenter, cCenter, `+${moveScore}`, 'score');
        handlePostTurnLogic(placedGrid, newShapes);
      }
      
      if (score + moveScore > highScore) {
        setHighScore(score + moveScore);
        localStorage.setItem('blockBlastHighScore', (score + moveScore).toString());
      }

      return true;
    }

    return false;
  }, [grid, currentShapes, score, highScore, isGameOver, comboCount, isProcessing, addPopup]);

  const handlePostTurnLogic = (currentGrid: GridType, currentShapes: (ShapeDefinition | null)[]) => {
      if (currentShapes.every(s => s === null)) {
        setTimeout(() => {
            const nextShapes = getSmartShapes();
            setCurrentShapes(nextShapes);
            if (!hasValidMoves(currentGrid, nextShapes)) {
                setIsGameOver(true);
            }
        }, 150);
      } else {
         if (!hasValidMoves(currentGrid, currentShapes)) {
            setIsGameOver(true);
         }
      }
  };

  return {
    grid,
    currentShapes,
    score,
    highScore,
    isGameOver,
    handleShapeDrop,
    resetGame,
    clearingLines,
    popups
  };
};