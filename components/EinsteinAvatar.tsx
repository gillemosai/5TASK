import React, { useEffect, useState } from 'react';
import { Mood } from '../types';
import { AVATAR_IMAGES } from '../constants';

interface EinsteinAvatarProps {
  mood: Mood;
  quote: string;
}

export const EinsteinAvatar: React.FC<EinsteinAvatarProps> = ({ mood, quote }) => {
  const [animateQuote, setAnimateQuote] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setAnimateQuote(true);
    const timer = setTimeout(() => setAnimateQuote(false), 500);
    return () => clearTimeout(timer);
  }, [quote]);

  // Sempre que o humor mudar, reiniciamos o estado de loading e erro
  useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
  }, [mood]);

  const getEmojiForMood = (m: Mood) => {
    switch(m) {
      case Mood.HAPPY: return '😛';
      case Mood.THINKING: return '🤔';
      case Mood.EXCITED: return '🤩';
      case Mood.SHOCKED: return '😱';
      default: return '🧠';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 mb-6 relative w-full max-w-sm mx-auto">
      {/* Balão de Fala */}
      <div 
        className={`bg-white text-slate-900 rounded-2xl p-4 mb-6 shadow-[0_0_25px_rgba(0,243,255,0.3)] 
        w-full text-center border-2 border-neon-blue relative transform transition-all duration-300
        ${animateQuote ? 'scale-105' : 'scale-100'}`}
      >
        <p className="font-black text-sm md:text-base font-mono leading-tight tracking-tight px-2">
          "{quote}"
        </p>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-neon-blue rotate-45"></div>
      </div>

      {/* Avatar Container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Glow de Fundo */}
        <div className="absolute inset-0 bg-neon-purple rounded-full blur-2xl opacity-20 animate-pulse"></div>
        
        <div className="relative w-full h-full rounded-full border-4 border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.4)] z-10 bg-slate-900 flex items-center justify-center overflow-hidden">
          
          {/* Skeleton Loader - Aparece enquanto a imagem carrega */}
          {isImageLoading && !imageError && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-neon-blue/20 border-t-neon-blue animate-spin"></div>
            </div>
          )}

          {/* Imagem Principal com Fade-in */}
          {!imageError ? (
            <img 
              key={mood}
              src={AVATAR_IMAGES[mood]} 
              alt={`Einstein ${mood}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
              loading="eager"
              decoding="async"
              className={`w-full h-full object-cover transition-opacity duration-700 ease-out
                ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            />
          ) : (
             /* Fallback Mode */
             <div className="flex flex-col items-center gap-2 animate-fadeIn">
                <span className="text-6xl filter drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]">
                  {getEmojiForMood(mood)}
                </span>
                <span className="text-[7px] font-mono text-neon-blue/50 uppercase tracking-widest font-black">Offline Mode</span>
             </div>
          )}
        </div>
        
        {/* Ícone Flutuante Atom */}
        <div className="absolute -top-1 -right-1 text-2xl animate-bounce z-20 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
          ⚛️
        </div>
      </div>
    </div>
  );
};