import React from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType } from '../types/poker';
import Card from './Card';

interface CommunityCardsProps {
  cards: CardType[];
  maxCards?: number;
}

const CommunityCards: React.FC<CommunityCardsProps> = ({ cards, maxCards = 5 }) => {
  // 最大枚数まで空のスロットを作成
  const cardSlots = Array.from({ length: maxCards }, (_, index) => 
    index < cards.length ? cards[index] : null
  );

  return (
    <motion.div 
      className="flex justify-center items-center space-x-2 p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 border border-gray-600 shadow-2xl">
        <h3 className="text-yellow-300 text-base font-bold text-center mb-4 tracking-wide">
          コミュニティカード
        </h3>
        
        <div className="flex space-x-2">
          {cardSlots.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ 
                delay: card ? index * 0.2 : 0, 
                duration: 0.5 
              }}
            >
              <Card
                card={card}
                size="large"
                animationDelay={card ? index * 0.1 : 0}
                className={!card ? 'opacity-30' : ''}
              />
            </motion.div>
          ))}
        </div>
        
        {cards.length > 0 && (
          <div className="text-center mt-3">
            <span className="text-gray-300 text-xs">
              {cards.length} / {maxCards} 枚
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommunityCards;