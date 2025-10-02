import React from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../types/poker';
import Card from './Card';

interface PlayerHandProps {
  player: Player;
  isCurrentPlayer?: boolean;
  showCards?: boolean;
  position?: 'bottom' | 'top-left' | 'top-right';
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  player, 
  isCurrentPlayer = false, 
  showCards = false,
  position = 'bottom' 
}) => {
  const positionClasses = {
    bottom: 'items-center',
    'top-left': 'items-start',
    'top-right': 'items-end'
  };

  const cardSize = position === 'bottom' ? 'medium' : 'small';

  return (
    <motion.div 
      className={`flex flex-col ${positionClasses[position]} space-y-2 p-2 sm:p-3`}
      initial={{ opacity: 0, y: position === 'bottom' ? 50 : -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* プレイヤー情報 */}
      <div className={`
        bg-gray-800 bg-opacity-95 rounded-xl p-3 sm:p-4 text-white border border-gray-600
        ${isCurrentPlayer ? 'ring-3 ring-yellow-400 ring-opacity-90 bg-yellow-900 bg-opacity-20' : ''}
        ${player.folded ? 'opacity-60' : ''}
        min-w-0 max-w-xs w-full sm:w-auto shadow-xl
      `}
      style={{
        boxShadow: isCurrentPlayer 
          ? '0 0 20px rgba(255, 193, 7, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3)'
          : '0 8px 16px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold truncate text-white">{player.name}</h3>
          {isCurrentPlayer && (
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg" />
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-green-300">
            💰 {player.chips.toLocaleString()}
          </span>
          {player.currentBet > 0 && (
            <span className="text-yellow-300">
              🎯 {player.currentBet.toLocaleString()}
            </span>
          )}
        </div>
        
        {player.folded && (
          <div className="text-red-400 text-xs mt-1 font-medium">
            フォールド
          </div>
        )}
      </div>

      {/* カード */}
      <div className="flex space-x-2">
        {player.hand.map((card, index) => (
          <Card
            key={`${player.id}-${index}`}
            card={card}
            faceDown={!showCards && !player.isAI === false}
            size={cardSize}
            animationDelay={index * 0.1}
            className={player.folded ? 'opacity-50' : ''}
          />
        ))}
      </div>

      {/* ベット表示 */}
      {player.currentBet > 0 && !player.folded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold"
        >
          ¥{player.currentBet.toLocaleString()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlayerHand;