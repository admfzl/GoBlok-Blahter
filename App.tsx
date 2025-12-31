import React, { useState, useRef, useEffect } from 'react';
import { useBlockBlast } from './hooks/useBlockBlast';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import Grid from './components/Grid';
import HUD from './components/HUD';
import DraggableShape from './components/DraggableShape';
import GameOverModal from './components/GameOverModal';
import { GRID_SIZE } from './constants';
import { Point } from './types';
import { canPlaceShape } from './lib/gameUtils';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const { 
    grid, 
    currentShapes, 
    score, 
    highScore, 
    isGameOver, 
    handleShapeDrop, 
    resetGame, 
    clearingLines,
    popups 
  } = useBlockBlast();

  // Mouse/Touch State
  const [activeShapeIndex, setActiveShapeIndex] = useState<number | null>(null);
  const [mouseGhostPos, setMouseGhostPos] = useState<Point | null>(null);

  // Keyboard State
  const { 
      keyboardMode, 
      keyboardTrayIndex, 
      keyboardCursorPos, 
      isShaking,
      setKeyboardMode 
  } = useKeyboardControls({
      currentShapes,
      onPlace: handleShapeDrop,
      isGameOver
  });

  const [cellSize, setCellSize] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive Layout Logic
  useEffect(() => {
    const updateSize = () => {
       const viewportWidth = window.innerWidth;
       const viewportHeight = window.innerHeight;
       
       const hudHeight = 140; 
       const trayHeight = 180;
       const pagePadding = 24;

       const availableWidth = Math.min(viewportWidth - pagePadding, 450); 
       const availableHeight = viewportHeight - hudHeight - trayHeight - pagePadding;
       const safeAvailableHeight = Math.max(availableHeight, 200);

       const GRID_INTERNAL_PADDING = 24; 
       const GRID_GAPS = (GRID_SIZE - 1) * 4; 

       const sizeBasedOnWidth = Math.floor((availableWidth - GRID_GAPS - GRID_INTERNAL_PADDING) / GRID_SIZE);
       const sizeBasedOnHeight = Math.floor((safeAvailableHeight - GRID_GAPS - GRID_INTERNAL_PADDING) / GRID_SIZE);
       const calculatedSize = Math.min(sizeBasedOnWidth, sizeBasedOnHeight);
       
       setCellSize(Math.max(calculatedSize, 20)); 
    };

    window.addEventListener('resize', updateSize);
    updateSize(); 
    setTimeout(updateSize, 100);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // --- MOUSE HANDLERS ---
  const handleDragStart = (index: number) => {
    if (isGameOver) return;
    setActiveShapeIndex(index);
    setKeyboardMode('TRAY'); // Mouse overrides keyboard
    if (typeof navigator.vibrate === 'function') navigator.vibrate(15);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent | PointerEvent) => {
    if (activeShapeIndex === null) return;
    
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
    } else {
        return;
    }
    
    if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const hitPadding = cellSize * 2; 

        if (
            clientX >= rect.left - hitPadding && 
            clientX <= rect.right + hitPadding && 
            clientY >= rect.top - hitPadding && 
            clientY <= rect.bottom + hitPadding
        ) {
            const gap = 4;
            const totalCellSize = cellSize + gap;
            
            const gridOriginX = rect.left + 12;
            const gridOriginY = rect.top + 12;
            const fingerYOffset = cellSize * 2.5; 
            const effectiveY = clientY - fingerYOffset;

            const relativeX = clientX - gridOriginX;
            const relativeY = effectiveY - gridOriginY;

            const rawCol = Math.round((relativeX - (cellSize / 2)) / totalCellSize);
            const rawRow = Math.round((relativeY - (cellSize / 2)) / totalCellSize);
            
            const shape = currentShapes[activeShapeIndex];
            if (shape) {
               const offsetR = Math.floor((shape.matrix.length - 1) / 2);
               const offsetC = Math.floor((shape.matrix[0].length - 1) / 2);
               const targetR = rawRow - offsetR;
               const targetC = rawCol - offsetC;

               if (canPlaceShape(grid, shape, { r: targetR, c: targetC })) {
                    setMouseGhostPos({ r: targetR, c: targetC });
                    return;
               }
            }
        }
    }
    setMouseGhostPos(null);
  };

  const handleDragEnd = (index: number) => {
    if (mouseGhostPos) {
        const success = handleShapeDrop(index, mouseGhostPos);
        if (success) {
            if (typeof navigator.vibrate === 'function') navigator.vibrate([30]); 
        }
    }
    setActiveShapeIndex(null);
    setMouseGhostPos(null);
  };

  // --- UNIFIED STATE CALCULATIONS ---
  const isReady = cellSize > 0;

  // Determine which Ghost to show (Mouse > Keyboard)
  let activeGhostPos: Point | null = null;
  let activeGhostShape = null;

  if (activeShapeIndex !== null) {
      // Mouse is dragging
      activeGhostPos = mouseGhostPos;
      activeGhostShape = currentShapes[activeShapeIndex];
  } else if (keyboardMode === 'GRID') {
      // Keyboard is placing
      activeGhostPos = keyboardCursorPos;
      activeGhostShape = currentShapes[keyboardTrayIndex];
  }

  const containerStyle = isReady ? {
      opacity: 1,
      width: (cellSize * GRID_SIZE) + ((GRID_SIZE - 1) * 4) + 24, 
      height: (cellSize * GRID_SIZE) + ((GRID_SIZE - 1) * 4) + 24
  } : { opacity: 0, width: 'auto', height: 'auto' };

  return (
    <div ref={containerRef} className="h-[100dvh] w-full flex flex-col items-center justify-between py-8 bg-[#293556] overflow-hidden select-none touch-none focus:outline-none relative">
      
      <HUD score={score} highScore={highScore} onReset={resetGame} />

      {/* Game Board with Glow & Shake */}
      <motion.div 
        className="relative z-10"
        animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.15 }} // Quicker shake
      >
        <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-xl" />
        
        <div 
            ref={gridRef}
            className="relative flex-shrink-0 transition-all duration-300 ease-out"
            style={containerStyle}
        >
            {isReady && (
                <Grid 
                    grid={grid} 
                    ghostShape={activeGhostShape} 
                    ghostPos={activeGhostPos}
                    clearingLines={clearingLines}
                    popups={popups}
                />
            )}
        </div>
      </motion.div>

      {/* Shapes Tray */}
      <div className="w-full max-w-lg h-44 flex justify-around items-center px-4 pb-6 z-20">
        {isReady && currentShapes.map((shape, idx) => (
            shape ? (
                <DraggableShape
                    key={`${shape.id}-${idx}`} 
                    index={idx}
                    shape={shape}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    cellSize={cellSize}
                    // Visual States
                    isSelected={keyboardMode === 'TRAY' && keyboardTrayIndex === idx}
                    isPickedUp={keyboardMode === 'GRID' && keyboardTrayIndex === idx}
                />
            ) : (
                <div key={`empty-${idx}`} className="w-1/3 h-full" />
            )
        ))}
      </div>

      {/* Game Over Modal - Moved to root level to cover everything */}
      {isGameOver && (
          <GameOverModal score={score} highScore={highScore} onRestart={resetGame} />
      )}

    </div>
  );
};

export default App;