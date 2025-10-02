import React from 'react';
import { Card as CardType } from '../utils/cards';

interface CardProps {
  card: CardType;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, className = '' }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  return (
    <div className={`
      bg-white rounded-lg border-2 border-gray-300 
      flex flex-col items-center justify-center
      w-16 h-20 text-sm font-bold shadow-sm
      ${isRed ? 'text-red-500' : 'text-black'}
      ${className}
    `}>
      <div className="text-xs leading-tight">
        {card.rank}
      </div>
      <div className="text-lg leading-none">
        {card.suit}
      </div>
    </div>
  );
};