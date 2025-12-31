import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { ShapeDefinition } from '../types';
import ShapeRenderer from './ShapeRenderer';

interface DraggableShapeProps {
  shape: ShapeDefinition;
  index: number;
  onDragStart: (shapeIndex: number) => void;
  onDragEnd: (shapeIndex: number) => void;
  onDragMove: (e: MouseEvent | TouchEvent | PointerEvent) => void;
  cellSize: number;
  isSelected?: boolean; // Keyboard selection
  isPickedUp?: boolean; // Keyboard "active" state
}

const DraggableShape: React.FC<DraggableShapeProps> = ({ 
    shape, 
    index, 
    onDragStart, 
    onDragEnd, 
    onDragMove, 
    cellSize,
    isSelected = false,
    isPickedUp = false
}) => {
  const controls = useDragControls();

  const trayScale = 0.6; 
  const dragScale = 1 / trayScale;

  return (
    <div className="relative flex items-center justify-center w-1/3 h-28 touch-none">
        
        {/* Selection Indicator (Pulsating Ring) */}
        {isSelected && !isPickedUp && (
             <motion.div 
                layoutId="selection-ring"
                className="absolute inset-1 bg-white/5 rounded-2xl border-[3px] border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                initial={false}
                animate={{ 
                    scale: [1, 1.03, 1],
                    borderColor: ["#facc15", "#fde047", "#facc15"]
                }}
                transition={{ 
                    layout: { duration: 0.1, ease: "easeOut" },
                    scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                    borderColor: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                }}
             />
        )}

        <motion.div
            drag
            dragControls={controls}
            dragSnapToOrigin={true}
            dragElastic={0.1}
            dragMomentum={false} 
            
            // Spawn Animation
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
                scale: isPickedUp ? 1 : 1, 
                opacity: isPickedUp ? 0.2 : 1, 
                y: 0 
            }}
            
            onDragStart={() => onDragStart(index)}
            onDrag={(e) => onDragMove(e as any)}
            onDragEnd={() => onDragEnd(index)}
            
            whileHover={{ scale: 1.05 }}
            whileDrag={{ 
                scale: dragScale, 
                zIndex: 100, 
                cursor: 'grabbing', 
                filter: "brightness(1.1) drop-shadow(0px 10px 15px rgba(0,0,0,0.5))" 
            }}
            
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            
            className="cursor-grab touch-none select-none relative z-10"
            style={{ touchAction: 'none' }}
        >
            <div className="pointer-events-none">
                <ShapeRenderer shape={shape} size={cellSize * trayScale} />
            </div>
        </motion.div>
    </div>
  );
};

export default DraggableShape;