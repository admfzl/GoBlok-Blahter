import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Just list the filenames. The SafeImage component will figure out the path.
const IMAGE_FILENAMES = [
    "sunghoon-1.jpg", 
    "sunghoon-2.jpg", 
    "sunghoon-3.jpg", 
    "sunghoon-4.jpg", 
    "sunghoon-5.jpg", 
    "sunghoon-6.jpg", 
];

const COLUMN_1 = [...IMAGE_FILENAMES, ...IMAGE_FILENAMES, ...IMAGE_FILENAMES];
const COLUMN_2 = [...IMAGE_FILENAMES.reverse(), ...IMAGE_FILENAMES, ...IMAGE_FILENAMES];
const COLUMN_3 = [...IMAGE_FILENAMES.slice(2), ...IMAGE_FILENAMES, ...IMAGE_FILENAMES.slice(0, 2)];
const COLUMN_4 = [...IMAGE_FILENAMES.slice(3), ...IMAGE_FILENAMES.reverse(), ...IMAGE_FILENAMES.slice(0, 3)];

// --- SafeImage Component ---
// This component attempts to load the image from multiple potential paths.
// It solves the issue where "public" folders are served differently in different environments.
const SafeImage: React.FC<{ filename: string; alt: string; className?: string }> = ({ filename, alt, className }) => {
    // 1. Try Root (Standard Vite/Next.js) -> /sunghoon-1.jpg
    // 2. Try Relative Public (Simple Servers) -> public/sunghoon-1.jpg
    // 3. Try Dot Relative Public (Some IDEs) -> ./public/sunghoon-1.jpg
    // 4. Fallback Placeholder
    const [attemptIndex, setAttemptIndex] = useState(0);
    const [hasError, setHasError] = useState(false);

    const paths = [
        `/${filename}`,           // Attempt 0
        `public/${filename}`,     // Attempt 1
        `./public/${filename}`,   // Attempt 2
    ];

    const currentSrc = paths[attemptIndex];

    const handleError = () => {
        const nextIndex = attemptIndex + 1;
        if (nextIndex < paths.length) {
            setAttemptIndex(nextIndex);
        } else {
            setHasError(true);
        }
    };

    if (hasError) {
        // Fallback placeholder if absolutely nothing works
        return (
            <img 
                src={`https://placehold.co/400x600/1e293b/FFF?text=${filename}`} 
                alt="Missing" 
                className={`${className} opacity-50 grayscale`}
            />
        );
    }

    return (
        <img 
            src={currentSrc} 
            alt={alt} 
            className={className}
            loading="lazy"
            onError={handleError}
        />
    );
};

const BackgroundCollage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0f172a]">
      {/* 
         Dark Overlay
         Opacity set to 0.5 to balance visibility of background vs readability of game
      */}
      <div className="absolute inset-0 z-10 bg-[#0f172a]/50 backdrop-blur-[1px]" />

      <div className="absolute inset-0 flex justify-between gap-4 opacity-75">
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
                {images.map((filename, idx) => (
                    <div key={`a-${idx}`} className="w-full relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-slate-800">
                         <SafeImage 
                            filename={filename}
                            alt={`Background ${idx}`}
                            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 block"
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
                {images.map((filename, idx) => (
                    <div key={`b-${idx}`} className="w-full relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-slate-800">
                         <SafeImage 
                            filename={filename}
                            alt={`Background ${idx}`}
                            className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 block"
                         />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default BackgroundCollage;