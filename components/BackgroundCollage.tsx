import React from 'react';
import { motion } from 'framer-motion';

// Updated paths to reference the files in the public folder directly
const IMAGES = [
    "/sunghoon-1.jpg", 
    "/sunghoon-2.jpg", 
    "/sunghoon-3.jpg", 
    "/sunghoon-4.jpg", 
    "/sunghoon-5.jpg", 
    "/sunghoon-6.jpg", 
];

const COLUMN_1 = [...IMAGES, ...IMAGES, ...IMAGES];
const COLUMN_2 = [...IMAGES.reverse(), ...IMAGES, ...IMAGES];
const COLUMN_3 = [...IMAGES.slice(2), ...IMAGES, ...IMAGES.slice(0, 2)];
const COLUMN_4 = [...IMAGES.slice(3), ...IMAGES.reverse(), ...IMAGES.slice(0, 3)];

const BackgroundCollage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0f172a]">
      {/* 
         Dark Overlay
         Reduced opacity to 0.5 (50%) so the new images are more visible 
         while still keeping text readable.
      */}
      <div className="absolute inset-0 z-10 bg-[#0f172a]/50 backdrop-blur-[1px]" />

      <div className="absolute inset-0 flex justify-between gap-4 opacity-60">
        <Column images={COLUMN_1} duration={45} />
        <Column images={COLUMN_2} duration={60} reverse />
        <Column images={COLUMN_3} duration={50} className="hidden sm:flex" />
        <Column images={COLUMN_4} duration={65} reverse className="hidden lg:flex" />
      </div>
    </div>
  );
};

interface ColumnProps {
    images: string[];
    duration: number;
    reverse?: boolean;
    className?: string;
}

const Column: React.FC<ColumnProps> = ({ images, duration, reverse = false, className = "" }) => {
    return (
        <div className={`flex-1 flex flex-col gap-4 min-w-[25%] ${className}`}>
            <motion.div
                className="flex flex-col gap-4"
                initial={{ y: reverse ? -1200 : 0 }}
                animate={{ y: reverse ? 0 : -1200 }} 
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duration,
                    ease: "linear"
                }}
            >
                {images.map((src, idx) => (
                    <div key={idx} className="w-full relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-slate-800">
                         <img 
                            src={src} 
                            alt={`Sunghoon Collage ${idx}`} 
                            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 block"
                            loading="lazy"
                            onError={(e) => {
                                // Fallback just in case a file is missing or named differently
                                (e.target as HTMLImageElement).src = `https://placehold.co/400x600/1e293b/FFF?text=Sunghoon+${idx}`;
                            }}
                         />
                    </div>
                ))}
            </motion.div>
             {/* Duplicate for seamless loop */}
            <motion.div
                className="flex flex-col gap-4"
                initial={{ y: reverse ? -1200 : 0 }}
                animate={{ y: reverse ? 0 : -1200 }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duration,
                    ease: "linear"
                }}
            >
                {images.map((src, idx) => (
                    <div key={`dup-${idx}`} className="w-full relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-slate-800">
                         <img 
                            src={src} 
                            alt={`Sunghoon Collage ${idx}`} 
                            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 block"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/400x600/1e293b/FFF?text=Sunghoon+${idx}`;
                            }}
                         />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default BackgroundCollage;