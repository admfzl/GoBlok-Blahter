import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart }) => {
  const isNewHigh = score >= highScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
      >
        <h2 className="text-3xl font-black text-white mb-2">Game Over!</h2>
        <p className="text-slate-400 mb-6">No more moves available</p>

        <div className="bg-slate-900/50 rounded-xl p-6 mb-8">
            <div className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Final Score</div>
            <div className="text-5xl font-black text-white mb-4">{score}</div>
            
            {isNewHigh && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                    <Trophy className="w-4 h-4" />
                    New High Score!
                </div>
            )}
            {!isNewHigh && (
                <div className="text-slate-500 text-sm font-semibold">
                    High Score: {highScore}
                </div>
            )}
        </div>

        <button 
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
        >
            <RotateCcw className="w-5 h-5" />
            Play Again
        </button>
      </motion.div>
    </div>
  );
};

export default GameOverModal;