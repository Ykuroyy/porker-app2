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
    if (strength >= 8) return 'text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 shadow-lg';
    if (strength >= 6) return 'text-blue-700 bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 shadow-lg';
    if (strength >= 4) return 'text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-md';
    if (strength >= 2) return 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 shadow-md';
    return 'text-gray-600 bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300 shadow-sm';
  };

  const getResultEmoji = (strength: number) => {
    if (strength >= 8) return '🎉';
    if (strength >= 6) return '🌟';
    if (strength >= 4) return '✨';
    if (strength >= 2) return '🎯';
    return '🎲';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-4
                     bg-[length:200%_200%] animate-gradient-xy relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300/30 rounded-full blur-lg"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-300/25 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-blue-300/30 rounded-full blur-md"></div>
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="inline-block animate-bounce">🎴</span>
            <span className="mx-2 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              カワイイ♡ポーカー V2
            </span>
            <span className="inline-block animate-bounce delay-75">🎯</span>
          </h1>
          <p className="text-white/90 text-lg font-medium drop-shadow-md">
            ✨ シンプルな5カードポーカー ✨
          </p>
        </div>

        {/* Game Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/50 mb-6
                     hover:shadow-3xl transition-all duration-300">
          
          {/* Cards Display */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3 text-center">
              あなたの手札
            </h3>
            
            {playerHand.length > 0 ? (
              <div className="flex justify-center gap-3 mb-4">
                {playerHand.map((card) => (
                  <Card 
                    key={`${card.suit}-${card.rank}`} 
                    card={card}
                    className={isDealing ? 'animate-pulse' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center gap-3 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="w-18 h-24 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 
                             rounded-xl border-2 border-dashed border-purple-300 
                             flex items-center justify-center shadow-md
                             hover:shadow-lg transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-2xl">🂠</div>
                      <div className="text-xs text-purple-500 font-medium">?</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hand Result */}
          {handResult && (
            <div className={`
              p-5 rounded-2xl border-2 mb-6 text-center transform transition-all duration-500
              ${getResultColor(handResult.strength)}
              hover:scale-105
            `}>
              <div className="text-3xl mb-2">{getResultEmoji(handResult.strength)}</div>
              <div className="font-bold text-xl mb-2">
                {handResult.type}
              </div>
              <div className="text-sm opacity-90 mb-2">
                {handResult.description}
              </div>
              <div className="flex justify-center items-center gap-2">
                <div className="text-xs font-medium">
                  強さ: {handResult.strength}/9
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < handResult.strength ? 'bg-current opacity-80' : 'bg-current opacity-20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Deal Button */}
          <div className="text-center">
            <button
              onClick={dealNewHand}
              disabled={isDealing}
              className={`
                px-10 py-4 rounded-full font-bold text-white text-lg
                transition-all duration-300 transform relative overflow-hidden
                ${isDealing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl'
                }
                before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] 
                hover:before:translate-x-[100%] before:transition-transform before:duration-700 before:ease-out
              `}
            >
              {isDealing ? '配っています...' : playerHand.length > 0 ? 'もう一度' : 'カードを配る'}
            </button>
          </div>
        </div>

        {/* Simple Stats */}
        {handResult && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-white/50 
                         transform transition-all duration-300 hover:scale-105">
            <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3 text-center">
              🎊 今回の結果 🎊
            </h4>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent mb-2">
                {handResult.type}
              </div>
              <div className="text-lg font-medium">
                {handResult.strength >= 6 ? '🎉 素晴らしい！' : 
                 handResult.strength >= 3 ? '✨ いい感じ！' : 
                 '💪 もう一度挑戦！'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};