import React from 'react';
import { Crown } from 'lucide-react';

interface HUDProps {
  score: number;
  highScore: number;
  onReset: () => void;
}

const HUD: React.FC<HUDProps> = ({ score, highScore, onReset }) => {
  return (
    <div className="w-full max-w-md flex flex-col gap-1 mb-2 px-2">
      {/* Game Title */}
      <div className="w-full text-center">
        <h1 className="text-xl font-black text-white/30 tracking-[0.2em] uppercase italic">
          GoBlok Blahter
        </h1>
      </div>

      {/* Scores Row */}
      <div className="flex justify-between items-end">
        {/* Current Score */}
        <div className="flex flex-col">
          <span className="text-5xl font-black text-white drop-shadow-md tracking-tight font-[system-ui] leading-[0.9]">
              {score}
          </span>
        </div>
        
        {/* High Score */}
        <div className="flex flex-col items-center pb-1">
          <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-sm mb-0" />
          <span className="text-xl font-bold text-yellow-400 drop-shadow-sm leading-none">
              {highScore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HUD;