import React from 'react';

interface CardBackProps {
  className?: string;
}

export const CardBack: React.FC<CardBackProps> = ({ className = '' }) => {
  return (
    <div className={`
      bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600
      rounded-xl border-2 border-white/30 shadow-lg
      flex flex-col items-center justify-center
      w-12 h-16 transition-all duration-200
      hover:scale-105 hover:-translate-y-1 relative overflow-hidden
      ${className}
    `}>
      {/* 装飾パターン */}
      <div className="absolute inset-2 rounded-lg border border-white/20 bg-white/5">
        <div className="absolute inset-1 rounded-md border border-white/10">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/80 text-lg font-bold">
              🎴
            </div>
          </div>
        </div>
      </div>
      
      {/* キラキラエフェクト */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
      <div className="absolute top-3 right-2 w-1 h-1 bg-white/40 rounded-full blur-sm"></div>
      <div className="absolute bottom-2 left-3 w-1 h-1 bg-white/50 rounded-full blur-sm"></div>
    </div>
  );
};