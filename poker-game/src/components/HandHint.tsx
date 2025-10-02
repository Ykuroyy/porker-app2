import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../types/poker';
import { evaluateHand } from '../utils/handEvaluator';

interface HandHintProps {
  playerCards: Card[];
  communityCards: Card[];
}

const HandHint: React.FC<HandHintProps> = ({ playerCards, communityCards }) => {
  if (playerCards.length === 0) return null;

  // 現在の手札の強さを評価
  let handStrength = '';
  let hint = '';
  let color = 'text-gray-300';

  if (communityCards.length >= 3) {
    try {
      const allCards = [...playerCards, ...communityCards];
      const evaluation = evaluateHand(allCards);
      handStrength = evaluation.description;
      
      switch (evaluation.type) {
        case 'royal-flush':
        case 'straight-flush':
        case 'four-of-a-kind':
          hint = '🔥 超強い！積極的にベットしよう！';
          color = 'text-red-400';
          break;
        case 'full-house':
        case 'flush':
          hint = '💎 とても強い！レイズを考えよう！';
          color = 'text-yellow-400';
          break;
        case 'straight':
        case 'three-of-a-kind':
          hint = '⭐ 良い手札！コールかレイズで';
          color = 'text-green-400';
          break;
        case 'two-pair':
        case 'pair':
          hint = '👍 まあまあ！様子を見よう';
          color = 'text-blue-400';
          break;
        default:
          hint = '🤔 弱い手札...フォールドも考えて';
          color = 'text-gray-400';
      }
    } catch (error) {
      // エラー時のフォールバック
    }
  } else {
    // プリフロップでの手札評価
    const ranks = playerCards.map(card => {
      switch (card.rank) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 11;
        default: return parseInt(card.rank) || 10;
      }
    });

    const isPair = ranks[0] === ranks[1];
    const isHighCard = Math.max(...ranks) >= 11;
    const isSuited = playerCards[0].suit === playerCards[1].suit;

    if (isPair) {
      if (ranks[0] >= 11) {
        hint = '🔥 強いペア！積極的に行こう！';
        color = 'text-red-400';
      } else {
        hint = '👍 ペア！コールやレイズを考えて';
        color = 'text-yellow-400';
      }
    } else if (isHighCard && isSuited) {
      hint = '⭐ 高いカードでスート同じ！期待できる';
      color = 'text-green-400';
    } else if (isHighCard) {
      hint = '👌 高いカード！様子を見よう';
      color = 'text-blue-400';
    } else {
      hint = '🤔 普通の手札...慎重に';
      color = 'text-gray-400';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 bg-opacity-90 rounded-xl p-3 border border-gray-600 mb-2"
    >
      <div className="text-center">
        {handStrength && (
          <div className="text-white font-bold text-sm mb-1">
            現在の役: {handStrength}
          </div>
        )}
        <div className={`${color} font-semibold text-sm`}>
          {hint}
        </div>
      </div>
    </motion.div>
  );
};

export default HandHint;