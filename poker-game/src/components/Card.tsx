import React from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType } from '../types/poker';
import { getSuitColor } from '../utils/deck';

interface CardProps {
  card: CardType | null;
  faceDown?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  faceDown = false, 
  size = 'medium', 
  onClick, 
  className = '',
  animationDelay = 0 
}) => {
  const sizeClasses = {
    small: 'w-12 h-16 sm:w-14 sm:h-20 text-xs',
    medium: 'w-16 h-24 sm:w-20 sm:h-28 text-sm',
    large: 'w-20 h-28 sm:w-24 sm:h-32 text-base'
  };

  if (!card) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay, duration: 0.3 }}
        className={`
          ${sizeClasses[size]} 
          bg-gray-300 border-2 border-gray-400 rounded-lg
          flex items-center justify-center
          ${className}
        `}
      >
        <div className="w-2 h-2 bg-gray-500 rounded-full" />
      </motion.div>
    );
  }

  const suitColor = getSuitColor(card.suit);
  const textColor = suitColor === 'red' ? 'text-red-600' : 'text-gray-800';

  if (faceDown) {
    return (
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ delay: animationDelay, duration: 0.5 }}
        onClick={onClick}
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-red-800 via-red-900 to-red-950
          border-3 border-yellow-600 rounded-xl
          cursor-pointer transform transition-transform duration-200
          flex items-center justify-center relative overflow-hidden
          ${className}
        `}
        style={{
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* 装飾的なパターン */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
        <div className="relative text-yellow-300 font-bold text-2xl">
          ♠
        </div>
        <div className="absolute top-1 left-1 text-yellow-400 text-xs">♦</div>
        <div className="absolute bottom-1 right-1 text-yellow-400 text-xs">♣</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ delay: animationDelay, duration: 0.5 }}
      whileHover={{ scale: onClick ? 1.05 : 1, y: onClick ? -4 : 0 }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]} 
        bg-white border-3 border-gray-400 rounded-xl shadow-lg
        ${onClick ? 'cursor-pointer' : ''}
        transform transition-all duration-200
        flex flex-col items-center justify-between p-1.5
        ${className}
      `}
      style={{
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* 左上のランクとスート */}
      <div className={`${textColor} font-black text-left self-start leading-none`}>
        <div className="text-sm sm:text-base font-black">{card.rank}</div>
        <div className="text-sm font-bold">{card.suit}</div>
      </div>

      {/* 中央の大きなスート */}
      <div className={`${textColor} text-2xl sm:text-3xl font-bold drop-shadow-sm`}>
        {card.suit}
      </div>

      {/* 右下のランクとスート（反転） */}
      <div 
        className={`${textColor} font-black text-right self-end leading-none transform rotate-180`}
        style={{ fontSize: '0.7em' }}
      >
        <div className="font-black">{card.rank}</div>
        <div className="text-sm font-bold">{card.suit}</div>
      </div>
    </motion.div>
  );
};

export default Card;