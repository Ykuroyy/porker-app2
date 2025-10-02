import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { PlayerAction } from '../types/poker';
import { soundEffects } from '../utils/soundEffects';

interface ActionButtonsProps {
  availableActions: PlayerAction[];
  onAction: (action: PlayerAction, amount?: number) => void;
  currentBet: number;
  playerChips: number;
  playerCurrentBet: number;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  availableActions,
  onAction,
  currentBet,
  playerChips,
  playerCurrentBet,
  disabled = false
}) => {
  const [raiseAmount, setRaiseAmount] = useState<number>(currentBet * 2);
  const [showRaiseInput, setShowRaiseInput] = useState(false);

  const callAmount = currentBet - playerCurrentBet;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const getButtonStyle = (action: PlayerAction) => {
    const baseClasses = "px-5 py-3 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2";
    
    switch (action) {
      case 'fold':
        return `${baseClasses} bg-red-600 hover:bg-red-500 text-white border-red-800 hover:border-red-600 shadow-red-900/30`;
      case 'check':
        return `${baseClasses} bg-blue-600 hover:bg-blue-500 text-white border-blue-800 hover:border-blue-600 shadow-blue-900/30`;
      case 'call':
        return `${baseClasses} bg-green-600 hover:bg-green-500 text-white border-green-800 hover:border-green-600 shadow-green-900/30`;
      case 'raise':
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-700 hover:border-yellow-600 shadow-yellow-900/30`;
      case 'all-in':
        return `${baseClasses} bg-purple-600 hover:bg-purple-500 text-white border-purple-800 hover:border-purple-600 shadow-purple-900/30`;
      default:
        return `${baseClasses} bg-gray-600 hover:bg-gray-500 text-white border-gray-800 hover:border-gray-600 shadow-gray-900/30`;
    }
  };

  const getActionLabel = (action: PlayerAction) => {
    switch (action) {
      case 'fold':
        return 'フォールド';
      case 'check':
        return 'チェック';
      case 'call':
        return `コール (¥${callAmount.toLocaleString()})`;
      case 'raise':
        return 'レイズ';
      case 'all-in':
        return `オールイン (¥${playerChips.toLocaleString()})`;
      default:
        return action;
    }
  };

  const getActionIcon = (action: PlayerAction) => {
    switch (action) {
      case 'fold':
        return '❌';
      case 'check':
        return '✅';
      case 'call':
        return '💰';
      case 'raise':
        return '🚀';
      case 'all-in':
        return '🔥';
      default:
        return '❓';
    }
  };

  const getActionName = (action: PlayerAction) => {
    switch (action) {
      case 'fold':
        return 'フォールド';
      case 'check':
        return 'チェック';
      case 'call':
        return 'コール';
      case 'raise':
        return 'レイズ';
      case 'all-in':
        return 'オールイン';
      default:
        return action;
    }
  };

  const handleRaiseSubmit = () => {
    if (raiseAmount >= currentBet * 2 && raiseAmount <= playerChips + playerCurrentBet) {
      onAction('raise', raiseAmount);
      setShowRaiseInput(false);
    }
  };

  if (disabled) {
    return (
      <div className="flex justify-center p-4">
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-4 text-white text-center">
          相手の番です...
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col items-center space-y-4 p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* レイズ入力 */}
      {showRaiseInput && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 bg-opacity-90 rounded-lg p-4 w-full max-w-xs"
        >
          <h4 className="text-white text-sm font-medium mb-3">レイズ額を入力</h4>
          
          <div className="space-y-3">
            <input
              type="range"
              min={currentBet * 2}
              max={playerChips + playerCurrentBet}
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            
            <div className="flex items-center justify-between text-white text-xs">
              <span>¥{(currentBet * 2).toLocaleString()}</span>
              <span className="font-bold">¥{raiseAmount.toLocaleString()}</span>
              <span>¥{(playerChips + playerCurrentBet).toLocaleString()}</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  soundEffects.buttonClick();
                  handleRaiseSubmit();
                }}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-xs font-semibold"
              >
                レイズ
              </button>
              <button
                onClick={() => {
                  soundEffects.buttonClick();
                  setShowRaiseInput(false);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-xs font-semibold"
              >
                キャンセル
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* アクションボタン */}
      <div className="space-y-2">
        {/* 初心者向け簡単説明 */}
        <div className="bg-blue-900 bg-opacity-60 rounded-lg p-2 text-center">
          <div className="text-blue-200 text-xs font-medium">
            💡 {availableActions.length > 0 ? 'あなたの番です！' : '相手の番を待っています...'}
          </div>
          {/* デバッグ情報 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 mt-1">
              Debug: Actions={availableActions.length}, Disabled={disabled}
            </div>
          )}
        </div>

        {/* ボタン - モバイル最適化 */}
        {availableActions.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {availableActions.map((action) => (
              <motion.button
                key={action}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  if (action === 'raise') {
                    setShowRaiseInput(true);
                  } else {
                    onAction(action);
                  }
                }}
                className={`${getButtonStyle(action)} text-xs px-2 py-3 flex flex-col items-center justify-center rounded-lg`}
                disabled={disabled}
              >
                <div className="text-lg mb-1">{getActionIcon(action)}</div>
                <div className="font-bold leading-none">{getActionName(action)}</div>
                {action === 'call' && callAmount > 0 && (
                  <div className="text-xs opacity-80 leading-none">¥{callAmount.toLocaleString()}</div>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 text-center">
            <div className="text-gray-300 text-sm">⏳ 待機中...</div>
          </div>
        )}

        {/* 簡易ゲーム情報 */}
        <div className="bg-gray-800 bg-opacity-80 rounded-lg p-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-300">現在ベット</div>
              <div className="text-yellow-300 font-bold">¥{currentBet.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-300">あなたのチップ</div>
              <div className="text-green-300 font-bold">¥{playerChips.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>


    </motion.div>
  );
};

export default ActionButtons;