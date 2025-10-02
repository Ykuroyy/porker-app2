import React from 'react';
import { Card as CardType } from '../utils/cards';

interface CardProps {
  card: CardType;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, className = '' }) => {
  const getSuitColor = (suit: string) => {
    switch (suit) {
      case '♥': return 'text-pink-600';
      case '♦': return 'text-blue-500';
      case '♠': return 'text-gray-700';
      case '♣': return 'text-green-600';
      default: return 'text-gray-700';
    }
  };

  const getSuitBg = (suit: string) => {
    switch (suit) {
      case '♥': return 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200';
      case '♦': return 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200';
      case '♠': return 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300';
      case '♣': return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200';
      default: return 'bg-white border-gray-300';
    }
  };
  
  return (
    <div className={`
      ${getSuitBg(card.suit)}
      rounded-xl border-2 shadow-lg hover:shadow-xl
      flex flex-col items-center justify-center
      w-18 h-24 font-bold transition-all duration-200
      hover:scale-105 hover:-translate-y-1
      ${getSuitColor(card.suit)}
      ${className}
    `}>
      <div className="text-lg leading-tight font-extrabold">
        {card.rank}
      </div>
      <div className="text-2xl leading-none filter drop-shadow-sm">
        {card.suit}
      </div>
    </div>
  );
};