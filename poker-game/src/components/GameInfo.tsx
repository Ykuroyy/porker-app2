import React from 'react';
import { motion } from 'framer-motion';
import type { GameState, GamePhase } from '../types/poker';
import { evaluateHand } from '../utils/handEvaluator';

interface GameInfoProps {
  gameState: GameState;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  const getPhaseDescription = (phase: GamePhase): string => {
    switch (phase) {
      case 'pre-flop':
        return 'プリフロップ - 手札を確認してベットしましょう';
      case 'flop':
        return 'フロップ - コミュニティカード3枚が公開されました';
      case 'turn':
        return 'ターン - 4枚目のカードが公開されました';
      case 'river':
        return 'リバー - 最後のカードが公開されました';
      case 'showdown':
        return 'ショーダウン - 勝負の結果が決まりました！';
      default:
        return '';
    }
  };

  const getPhaseColor = (phase: GamePhase): string => {
    switch (phase) {
      case 'pre-flop':
        return 'bg-blue-600';
      case 'flop':
        return 'bg-green-600';
      case 'turn':
        return 'bg-yellow-600';
      case 'river':
        return 'bg-orange-600';
      case 'showdown':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  // プレイヤーの現在のベストハンドを計算
  const player = gameState.players.find(p => !p.isAI);
  let currentBestHand = null;
  
  if (player && gameState.communityCards.length >= 3) {
    try {
      const allCards = [...player.hand, ...gameState.communityCards];
      currentBestHand = evaluateHand(allCards);
    } catch (error) {
      // エラーハンドリング
    }
  }

  return (
    <div className="space-y-3">
      {/* ゲームフェーズ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getPhaseColor(gameState.phase)} text-white px-5 py-3 rounded-xl text-center border-2 border-white border-opacity-30 shadow-lg`}
      >
        <div className="font-bold text-base tracking-wide">
          {getPhaseDescription(gameState.phase)}
        </div>
      </motion.div>

      {/* ポット情報 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-yellow-700 via-yellow-800 to-yellow-900 text-white rounded-xl p-4 text-center border-2 border-yellow-600 shadow-xl"
      >
        <div className="text-sm text-yellow-200 mb-2 font-semibold">💰 ポット</div>
        <div className="text-2xl font-black text-yellow-100">
          ¥{gameState.pot.toLocaleString()}
        </div>
        {gameState.currentBet > 0 && (
          <div className="text-sm text-yellow-200 mt-2 font-medium">
            現在のベット: ¥{gameState.currentBet.toLocaleString()}
          </div>
        )}
      </motion.div>

      {/* 現在のベストハンド（コミュニティカードが3枚以上の場合のみ） */}
      {currentBestHand && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-90 text-white rounded-lg p-3"
        >
          <div className="text-xs text-gray-300 mb-1">あなたの現在のハンド</div>
          <div className="font-semibold text-sm">
            {currentBestHand.description}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {getHandTypeDescription(currentBestHand.type)}
          </div>
        </motion.div>
      )}

      {/* ゲーム統計 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 bg-opacity-80 text-white rounded-xl p-4 border border-gray-600"
      >
        <div className="text-sm text-yellow-300 mb-3 font-bold text-center">📊 ゲーム状況</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>🎯 参加者:</span>
            <span className="font-bold text-green-300">{gameState.players.filter(p => !p.folded).length}人</span>
          </div>
          <div className="flex justify-between items-center">
            <span>💸 最小ベット:</span>
            <span className="font-bold text-yellow-300">¥{gameState.smallBlind.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>💰 基本ベット:</span>
            <span className="font-bold text-yellow-300">¥{gameState.bigBlind.toLocaleString()}</span>
          </div>
        </div>
        
        {/* 初心者向けミニヒント */}
        <div className="mt-4 p-2 bg-blue-900 bg-opacity-50 rounded-lg">
          <div className="text-xs text-blue-200 text-center">
            💡 強い手札なら積極的に、弱い手札は無理をしないことが大切！
          </div>
        </div>
      </motion.div>

      {/* 勝負結果 */}
      {gameState.gameOver && gameState.winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg p-4 text-center"
        >
          <div className="text-lg font-bold mb-2">🎉 ゲーム終了！</div>
          <div className="text-sm">
            勝者: <span className="font-semibold">{gameState.winner.name}</span>
          </div>
          <div className="text-xs mt-1">
            獲得ポット: ¥{gameState.pot.toLocaleString()}
          </div>
        </motion.div>
      )}
    </div>
  );
};

function getHandTypeDescription(handType: string): string {
  const descriptions: Record<string, string> = {
    'royal-flush': '最強のハンド！',
    'straight-flush': '非常に強いハンドです',
    'four-of-a-kind': '強力なハンド！',
    'full-house': '強いハンドです',
    'flush': '良いハンドです',
    'straight': '良いハンドです',
    'three-of-a-kind': 'まあまあのハンドです',
    'two-pair': 'そこそこのハンドです',
    'pair': '弱いハンドです',
    'high-card': '最も弱いハンドです'
  };
  
  return descriptions[handType] || '';
}

export default GameInfo;