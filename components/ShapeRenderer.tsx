import React from 'react';
import { ShapeDefinition } from '../types';
import Block, { BlockConnections } from './Block';

interface ShapeRendererProps {
  shape: ShapeDefinition;
  size?: number; // Size of each block
  className?: string;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ shape, size = 20, className = "" }) => {
  return (
    <div 
        className={`flex flex-col ${className}`} // Removed gap
        style={{ width: 'max-content' }}
    >
      {shape.matrix.map((row, r) => (
        <div key={r} className="flex"> 
          {row.map((cell, c) => {
             // Calculate connections for tray items so they look solid too
             let connections: BlockConnections = { top: false, right: false, bottom: false, left: false };
             if (cell === 1) {
                connections = {
                    top: r > 0 && shape.matrix[r-1][c] === 1,
                    bottom: r < shape.matrix.length - 1 && shape.matrix[r+1][c] === 1,
                    left: c > 0 && shape.matrix[r][c-1] === 1,
                    right: c < shape.matrix[0].length - 1 && shape.matrix[r][c+1] === 1,
                };
             }

             return (
                <div key={`${r}-${c}`} style={{ width: size, height: size }}>
                    {cell === 1 ? (
                        <Block 
                            color={shape.color} 
                            className="w-full h-full" 
                            connections={connections}
                        />
                    ) : (
                        <div className="w-full h-full" />
                    )}
                </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ShapeRenderer;