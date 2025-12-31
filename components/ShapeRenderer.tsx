import React from 'react';
import { ShapeDefinition } from '../types';
import Block from './Block';

interface ShapeRendererProps {
  shape: ShapeDefinition;
  size?: number; // Size of each block
  className?: string;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ shape, size = 20, className = "" }) => {
  return (
    <div 
        className={`flex flex-col gap-[2px] ${className}`}
        style={{ width: 'max-content' }}
    >
      {shape.matrix.map((row, r) => (
        <div key={r} className="flex gap-[2px]">
          {row.map((cell, c) => (
            <div key={`${r}-${c}`} style={{ width: size, height: size }}>
               {cell === 1 ? (
                   <Block color={shape.color} className="w-full h-full" />
               ) : (
                   <div className="w-full h-full" />
               )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShapeRenderer;
