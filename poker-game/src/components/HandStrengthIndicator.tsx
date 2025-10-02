import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../types/poker';
import { evaluateHand } from '../utils/handEvaluator';

interface HandStrengthIndicatorProps {
  playerHand: Card[];
  communityCards: Card[];
}

const HandStrengthIndicator: React.FC<HandStrengthIndicatorProps> = ({
  playerHand,
  communityCards
}) => {
  if (playerHand.length === 0) return null;

  let evaluation = null;
  let strength = 0;
  let advice = '';
  let color = 'gray';

  try {
    if (communityCards.length >= 3) {
      // フロップ以降：実際の役で評価
      evaluation = evaluateHand([...playerHand, ...communityCards]);
      
      switch (evaluation.type) {
        case 'royal-flush':
        case 'straight-flush':
          strength = 100;
          advice = '最強！積極的にベットしよう！';
          color = 'purple';
          break;
        case 'four-of-a-kind':
          strength = 95;
          advice = 'とても強い！レイズしよう！';
          color = 'purple';
          break;
        case 'full-house':
          strength = 85;
          advice = '強い役！自信を持ってベット！';
          color = 'blue';
          break;
        case 'flush':
        case 'straight':
          strength = 75;
          advice = '良い役！積極的に行こう！';
          color = 'green';
          break;
        case 'three-of-a-kind':
          strength = 65;
          advice = 'そこそこ強い。様子を見ながら';
          color = 'green';
          break;
        case 'two-pair':
          strength = 50;
          advice = 'まあまあ。相手次第';
          color = 'yellow';
          break;
        case 'pair':
          strength = 35;
          advice = '弱め。慎重に';
          color = 'orange';
          break;
        default:
          strength = 20;
          advice = '弱い。フォールドを考えよう';
          color = 'red';
      }
    } else {
      // プリフロップ：手札のみで評価
      const ranks = playerHand.map(card => {
        switch (card.rank) {
          case 'A': return 14;
          case 'K': return 13;
          case 'Q': return 12;
          case 'J': return 11;
          default: return parseInt(card.rank) || 10;
        }
      }).sort((a, b) => b - a);

      if (ranks[0] === ranks[1]) {
        // ペア
        if (ranks[0] >= 10) {
          strength = 85;
          advice = 'ハイペア！強気でいこう！';
          color = 'blue';
        } else if (ranks[0] >= 7) {
          strength = 65;
          advice = 'ミドルペア。まずまず良い';
          color = 'green';
        } else {
          strength = 45;
          advice = 'ローペア。様子を見よう';
          color = 'yellow';
        }
      } else if (ranks[0] >= 11 && ranks[1] >= 10) {
        strength = 75;
        advice = 'ハイカード！期待できる';
        color = 'green';
      } else if (ranks[0] >= 11) {
        strength = 55;
        advice = 'まあまあ。慎重に';
        color = 'yellow';
      } else if (Math.abs(ranks[0] - ranks[1]) <= 4) {
        strength = 40;
        advice = '可能性あり。様子見';
        color = 'orange';
      } else {
        strength = 25;
        advice = '弱め。フォールド検討';
        color = 'red';
      }
    }
  } catch (error) {
    strength = 0;
    advice = '手札を確認中...';
    color = 'gray';
  }

  const colorClasses = {
    purple: 'bg-purple-600 border-purple-400',
    blue: 'bg-blue-600 border-blue-400',
    green: 'bg-green-600 border-green-400',
    yellow: 'bg-yellow-600 border-yellow-400',
    orange: 'bg-orange-600 border-orange-400',
    red: 'bg-red-600 border-red-400',
    gray: 'bg-gray-600 border-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 bg-opacity-95 rounded-lg p-2 border border-gray-600 w-full"
    >
      <div className="flex items-center justify-between">
        {/* 左側: 役名とアドバイス */}
        <div className="flex-1">
          {evaluation && (
            <div className="text-yellow-300 font-bold text-xs mb-1">
              {evaluation.description}
            </div>
          )}
          <div className="text-white text-xs font-medium">
            {advice}
          </div>
        </div>

        {/* 右側: 強度表示 */}
        <div className="flex flex-col items-end ml-2">
          <div className="text-xs text-gray-300 mb-1">強度</div>
          <div className="flex items-center space-x-2">
            {/* コンパクトメーター */}
            <div className="w-16 bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
              />
            </div>
            <span className="text-white text-xs font-bold">{strength}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HandStrengthIndicator;