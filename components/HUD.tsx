import React from 'react';
import { Crown } from 'lucide-react';

interface HUDProps {
  score: number;
  highScore: number;
  onReset: () => void;
}

const HUD: React.FC<HUDProps> = ({ score, highScore, onReset }) => {
  return (
    <div className="w-full max-w-md flex justify-between items-center px-2 mb-4">
      {/* Current Score */}
      <div className="flex flex-col">
        <span className="text-5xl font-black text-white drop-shadow-md tracking-tight font-[system-ui]">
            {score}
        </span>
      </div>
      
      {/* High Score */}
      <div className="flex flex-col items-center">
        <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-sm mb-0" />
        <span className="text-2xl font-bold text-yellow-400 drop-shadow-sm">
            {highScore}
        </span>
      </div>
    </div>
  );
};

export default HUD;