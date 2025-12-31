import React from 'react';
import { motion } from 'framer-motion';

interface BlockProps {
  color?: string | null;
  size?: number;
  className?: string;
  isGhost?: boolean;
  isClearing?: boolean;
}

const Block: React.FC<BlockProps> = ({ color, size, className = "", isGhost = false, isClearing = false }) => {
  
  // 1. Empty Slot (Recessed Socket)
  if (!color) {
    return (
      <div 
        className={`bg-[#151E32] rounded-[6px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${className}`}
        style={{ width: size, height: size }}
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
        className={`bg-white/10 rounded-[6px] border-2 border-white/50 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 3. Filled Block (Glossy/Gummy Style)
  return (
    <motion.div
      animate={isClearing ? { scale: 0, opacity: 0, filter: "brightness(2)" } : { scale: 1, opacity: 1, filter: "brightness(1)" }}
      transition={{ duration: 0.15, ease: "backIn" }}
      
      className={`relative rounded-[6px] bg-gradient-to-br ${color} ${className}`}
      style={{ 
        width: size, 
        height: size,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
      }}
    >
        <div className="absolute top-[10%] left-[10%] w-[25%] h-[25%] bg-white rounded-full opacity-40 blur-[0.5px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[15%] h-[15%] bg-black opacity-10 rounded-full blur-[1px]" />
    </motion.div>
  );
};

export default Block;