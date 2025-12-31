import React from 'react';
import { GridType, Point, ShapeDefinition } from '../types';
import Block, { BlockConnections } from './Block';
import { motion, AnimatePresence } from 'framer-motion';
import { Popup } from '../hooks/useBlockBlast';

interface GridProps {
  grid: GridType;
  ghostShape: ShapeDefinition | null;
  ghostPos: Point | null;
  clearingLines: { rows: number[], cols: number[] };
  popups?: Popup[];
}

const Grid: React.FC<GridProps> = ({ grid, ghostShape, ghostPos, clearingLines, popups = [] }) => {
  const renderCell = (r: number, c: number) => {
    const isClearing = clearingLines.rows.includes(r) || clearingLines.cols.includes(c);
    const cellColor = grid[r][c];

    // Filled Block
    if (cellColor) {
        const connections: BlockConnections = {
            top: r > 0 && grid[r-1][c] === cellColor,
            bottom: r < grid.length - 1 && grid[r+1][c] === cellColor,
            left: c > 0 && grid[r][c-1] === cellColor,
            right: c < grid[0].length - 1 && grid[r][c+1] === cellColor,
        };

        return (
            <Block 
                key={`${r}-${c}-filled`} 
                color={cellColor} 
                isClearing={isClearing} 
                className="w-full h-full"
                connections={connections} 
            />
        );
    }
    
    // Ghost Calculation
    let isGhost = false;
    let ghostConnections: BlockConnections = { top: false, right: false, bottom: false, left: false };
    
    if (ghostShape && ghostPos) {
      const localR = r - ghostPos.r;
      const localC = c - ghostPos.c;
      if (
        localR >= 0 && localR < ghostShape.matrix.length && 
        localC >= 0 && localC < ghostShape.matrix[0].length
      ) {
        if (ghostShape.matrix[localR][localC] === 1) {
          isGhost = true;
          // Check ghost internal connections
          ghostConnections = {
            top: localR > 0 && ghostShape.matrix[localR-1][localC] === 1,
            bottom: localR < ghostShape.matrix.length - 1 && ghostShape.matrix[localR+1][localC] === 1,
            left: localC > 0 && ghostShape.matrix[localR][localC-1] === 1,
            right: localC < ghostShape.matrix[0].length - 1 && ghostShape.matrix[localR][localC+1] === 1,
          };
        }
      }
    }

    if (isGhost && ghostShape) {
         return (
            <Block 
                key={`${r}-${c}-ghost`} 
                color={ghostShape.color} 
                isGhost={true} 
                className="w-full h-full" 
                connections={ghostConnections}
            />
        );
    }

    return <Block key={`${r}-${c}-empty`} color={null} className="w-full h-full" />;
  };

  return (
    <div className="relative">
        {/* Updated Background: More transparent (60% opacity) to let Sunghoon show through clearly */}
        <div className="bg-[#1F2942]/60 backdrop-blur-sm p-3 rounded-2xl shadow-2xl border border-white/10">
          <div className="grid grid-rows-8 w-full aspect-square">
            {grid.map((row, r) => (
                <div key={r} className="grid grid-cols-8">
                    {row.map((_, c) => (
                        <div 
                            key={`${r}-${c}`} 
                            className="aspect-square relative"
                        >
                            {renderCell(r, c)}
                        </div>
                    ))}
                </div>
            ))}
          </div>
        </div>

        {/* Floating Scores Layer */}
        <div className="absolute inset-3 pointer-events-none overflow-hidden rounded-xl">
             <AnimatePresence>
                {popups.map((popup) => (
                    <motion.div
                        key={popup.id}
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: -20, scale: 1.2 }}
                        exit={{ opacity: 0, y: -40, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`absolute z-50 font-black drop-shadow-lg whitespace-nowrap ${
                            popup.type === 'combo' ? 'text-yellow-400 text-xl' : 'text-white text-lg'
                        }`}
                        style={{
                            top: `${(popup.r / 8) * 100}%`,
                            left: `${(popup.c / 8) * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                        }}
                    >
                        {popup.text}
                    </motion.div>
                ))}
             </AnimatePresence>
        </div>
    </div>
  );
};

export default Grid;