import React from 'react';
import { Card } from './Card';
import { CardBack } from './CardBack';
import { Card as CardType } from '../utils/cards';

interface PlayerProps {
  name: string;
  chips: number;
  cards: CardType[];
  isPlayer: boolean;
  isActive: boolean;
  lastAction?: string;
  avatar?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const Player: React.FC<PlayerProps> = ({
  name,
  chips,
  cards,
  isPlayer,
  isActive,
  lastAction,
  avatar = '🤖',
  position
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'flex-col items-center';
      case 'bottom':
        return 'flex-col-reverse items-center';
      case 'left':
        return 'flex-row items-center';
      case 'right':
        return 'flex-row-reverse items-center';
      default:
        return 'flex-col items-center';
    }
  };

  return (
    <div className={`
      flex gap-2 ${getPositionClasses()}
      ${isActive ? 'animate-pulse' : ''}
    `}>
      {/* プレイヤー情報 */}
      <div className={`
        flex flex-col items-center p-2 rounded-xl backdrop-blur-sm border text-center
        ${isActive 
          ? 'bg-yellow-200/30 border-yellow-300/50 shadow-lg shadow-yellow-300/20' 
          : 'bg-white/20 border-white/30'
        }
        ${isPlayer ? 'bg-green-200/30 border-green-300/50' : ''}
      `}>
        {/* アバターと名前 */}
        <div className="text-xl mb-1">{isPlayer ? '👤' : avatar}</div>
        <div className="text-white font-bold text-xs mb-1">{name}</div>

        {/* チップ情報 */}
        <div className="bg-black/20 rounded-full px-2 py-1 mb-1">
          <div className="text-yellow-300 font-bold text-xs">
            💰{chips.toLocaleString()}
          </div>
        </div>

        {/* 最後のアクション */}
        {lastAction && (
          <div className="bg-white/20 rounded-full px-1 py-1">
            <div className="text-white text-xs">
              {lastAction === 'fold' ? '降' : lastAction === 'call' ? 'C' : lastAction === 'bet' ? 'B' : lastAction}
            </div>
          </div>
        )}
      </div>

      {/* カード表示 */}
      <div className="flex gap-1">
        {cards.map((card, index) => (
          <div key={index} className="transform -rotate-1 first:rotate-1" style={{ transform: `scale(0.7) rotate(${index % 2 === 0 ? '-2' : '2'}deg)` }}>
            {isPlayer ? (
              <Card card={card} />
            ) : (
              <CardBack />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};