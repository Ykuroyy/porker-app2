import React, { useState } from 'react';
import { createDeck, shuffleDeck, dealHand, Card as CardType } from '../utils/cards';
import { evaluateHand, HandResult } from '../utils/handEvaluator';
import { Card } from './Card';

export const SimplePokerGame: React.FC = () => {
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [isDealing, setIsDealing] = useState(false);

  const dealNewHand = () => {
    setIsDealing(true);
    
    // Simple animation delay
    setTimeout(() => {
      const deck = shuffleDeck(createDeck());
      const { hand } = dealHand(deck);
      const result = evaluateHand(hand);
      
      setPlayerHand(hand);
      setHandResult(result);
      setIsDealing(false);
    }, 300);
  };

  const getResultColor = (strength: number) => {
    if (strength >= 8) return 'text-purple-600 bg-purple-50';
    if (strength >= 6) return 'text-blue-600 bg-blue-50';
    if (strength >= 4) return 'text-green-600 bg-green-50';
    if (strength >= 2) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            カワイイ♡ポーカー V2
          </h1>
          <p className="text-gray-600 text-sm">
            シンプルな5カードポーカー
          </p>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          
          {/* Cards Display */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">
              あなたの手札
            </h3>
            
            {playerHand.length > 0 ? (
              <div className="flex justify-center gap-2 mb-4">
                {playerHand.map((card) => (
                  <Card 
                    key={`${card.suit}-${card.rank}`} 
                    card={card}
                    className={isDealing ? 'animate-pulse' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="w-16 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  >
                    <span className="text-gray-400 text-xs">?</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hand Result */}
          {handResult && (
            <div className={`
              p-4 rounded-xl border-2 mb-6 text-center
              ${getResultColor(handResult.strength)}
            `}>
              <div className="font-bold text-lg mb-1">
                {handResult.type}
              </div>
              <div className="text-sm opacity-90">
                {handResult.description}
              </div>
              <div className="text-xs mt-2 opacity-75">
                強さ: {handResult.strength}/9
              </div>
            </div>
          )}

          {/* Deal Button */}
          <div className="text-center">
            <button
              onClick={dealNewHand}
              disabled={isDealing}
              className={`
                px-8 py-3 rounded-full font-bold text-white text-lg
                transition-all duration-200 transform
                ${isDealing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:scale-105 active:scale-95 shadow-lg'
                }
              `}
            >
              {isDealing ? '配っています...' : playerHand.length > 0 ? 'もう一度' : 'カードを配る'}
            </button>
          </div>
        </div>

        {/* Simple Stats */}
        {handResult && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3 text-center">
              今回の結果
            </h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {handResult.type}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {handResult.strength >= 6 ? '素晴らしい！' : 
                 handResult.strength >= 3 ? 'いい感じ！' : 
                 'もう一度挑戦！'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};