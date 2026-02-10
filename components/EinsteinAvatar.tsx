
import React, { useEffect, useState } from 'react';
import { Mood } from '../types';
import { AVATAR_IMAGES } from '../constants';

interface EinsteinAvatarProps {
  mood: Mood;
  quote: string;
  isDarkMode?: boolean;
}

export const EinsteinAvatar: React.FC<EinsteinAvatarProps> = ({ mood, quote, isDarkMode }) => {
  const [animateQuote, setAnimateQuote] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setAnimateQuote(true);
    const timer = setTimeout(() => setAnimateQuote(false), 500);
    return () => clearTimeout(timer);
  }, [quote]);

  return (
    <div className="flex flex-col items-center justify-center p-4 mb-6 relative w-full max-w-sm mx-auto">
      {/* Balão de Fala */}
      <div 
        className={`rounded-2xl p-4 mb-6 shadow-xl w-full text-center border-2 relative transform transition-all duration-300
        ${animateQuote ? 'scale-105' : 'scale-100'}
        ${isDarkMode ? 'bg-white text-slate-900 border-neon-blue' : 'bg-slate-900 text-white border-slate-700'}`}
      >
        <p className="font-black text-sm md:text-base font-mono leading-tight tracking-tight">
          "{quote}"
        </p>
        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 border-r-2 border-b-2 rotate-45 ${isDarkMode ? 'bg-white border-neon-blue' : 'bg-slate-900 border-slate-700'}`}></div>
      </div>

      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <div className="absolute inset-0 bg-neon-purple rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className={`relative w-full h-full rounded-full border-4 shadow-lg z-10 flex items-center justify-center overflow-hidden transition-colors ${isDarkMode ? 'border-neon-blue bg-slate-900' : 'border-slate-300 bg-white'}`}>
          <img 
            src={AVATAR_IMAGES[mood]} 
            alt="Einstein"
            onLoad={() => setIsImageLoading(false)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
        <div className="absolute -top-1 -right-1 text-2xl animate-bounce z-20">⚛️</div>
      </div>
    </div>
  );
};
