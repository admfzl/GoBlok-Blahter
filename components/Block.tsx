import React from 'react';
import { motion } from 'framer-motion';

export interface BlockConnections {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

interface BlockProps {
  color?: string | null;
  size?: number;
  className?: string;
  isGhost?: boolean;
  isClearing?: boolean;
  connections?: BlockConnections;
}

const Block: React.FC<BlockProps> = ({ 
    color, 
    size, 
    className = "", 
    isGhost = false, 
    isClearing = false,
    connections = { top: false, right: false, bottom: false, left: false }
}) => {
  
  // Calculate Border Radius based on connections
  // If connected to top/left, TL corner is 0. Else it is rounded.
  const radius = 8; // Slightly larger radius for the bigger blocks
  const tl = connections.top || connections.left ? 0 : radius;
  const tr = connections.top || connections.right ? 0 : radius;
  const bl = connections.bottom || connections.left ? 0 : radius;
  const br = connections.bottom || connections.right ? 0 : radius;
  
  const borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;

  // 1. Empty Slot (Recessed Socket)
  // We add a margin to empty slots so they look like separated grids
  if (!color) {
    return (
      <div 
        className={`bg-[#151E32] rounded-[8px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${className}`}
        style={{ 
            width: size ? size - 4 : 'calc(100% - 4px)', 
            height: size ? size - 4 : 'calc(100% - 4px)',
            margin: '2px' // Creates the visual gap for empty cells
        }}
      />
    );
  }

  // 2. Ghost Preview (Outline Pulse)
  if (isGhost) {
    return (
      <motion.div 
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`bg-white/10 border-2 border-white/50 ${className}`}
        style={{ 
            width: size, 
            height: size,
            borderRadius: borderRadius 
        }}
      />
    );
  }

  // 3. Filled Block (Glossy/Gummy Style)
  // Filled blocks have NO margin so they touch.
  return (
    <motion.div
      animate={isClearing ? { scale: 0, opacity: 0, filter: "brightness(2)" } : { scale: 1, opacity: 1, filter: "brightness(1)" }}
      transition={{ duration: 0.15, ease: "backIn" }}
      
      className={`relative bg-gradient-to-br ${color} ${className}`}
      style={{ 
        width: size, 
        height: size,
        borderRadius: borderRadius,
        // Slightly reduce shadow on connected sides? 
        // We keep simple shadow for now, as it gives a nice 'segmented' 3D look
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
        zIndex: 1 // Ensure filled blocks sit above empty ones visually if overlapping (though grid handles layout)
      }}
    >
        {/* Simple highlight that doesn't look too weird when tiled */}
        <div className="absolute top-[10%] left-[10%] w-[25%] h-[25%] bg-white rounded-full opacity-40 blur-[0.5px]" />
    </motion.div>
  );
};

export default Block;