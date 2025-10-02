import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameState, PlayerAction } from '../types/poker';
import { initializeGame, executePlayerAction, getAIAction, canPerformAction } from '../utils/gameLogic';
import { soundEffects } from '../utils/soundEffects';
import PlayerHand from './PlayerHand';
import CommunityCards from './CommunityCards';
import ActionButtons from './ActionButtons';
import GameInfo from './GameInfo';
import Tutorial from './Tutorial';
import BeginnerGuide from './BeginnerGuide';
import HandStrengthIndicator from './HandStrengthIndicator';

const PokerGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showBeginnerGuide, setShowBeginnerGuide] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const humanPlayer = gameState.players.find(p => !p.isAI);

  // カード配布時の効果音
  useEffect(() => {
    if (gameState.communityCards.length > 0) {
      soundEffects.cardDeal();
    }
  }, [gameState.communityCards.length]);

  // ゲーム終了時の効果音
  useEffect(() => {
    if (gameState.gameOver && gameState.winner) {
      if (gameState.winner.isAI) {
        soundEffects.gameLose();
      } else {
        soundEffects.gameWin();
      }
    }
  }, [gameState.gameOver, gameState.winner]);

  // AIプレイヤーの自動行動
  useEffect(() => {
    console.log('AI Effect triggered:', {
      gameOver: gameState.gameOver,
      currentPlayer: currentPlayer?.name,
      isAI: currentPlayer?.isAI,
      isProcessingAction,
      phase: gameState.phase
    });

    if (!gameState.gameOver && currentPlayer?.isAI && !isProcessingAction) {
      console.log(`AI ${currentPlayer.name} is taking action...`);
      
      const timer = setTimeout(() => {
        setIsProcessingAction(true);
        
        try {
          console.log('Getting AI action for:', currentPlayer.name);
          const aiAction = getAIAction(gameState, currentPlayer.id);
          console.log('AI chose action:', aiAction);
          
          // AI行動の効果音
          switch (aiAction.action) {
            case 'fold':
              soundEffects.fold();
              break;
            case 'call':
              soundEffects.call();
              break;
            case 'raise':
              soundEffects.raise();
              break;
            case 'check':
              soundEffects.check();
              break;
            case 'all-in':
              soundEffects.raise();
              break;
          }

          if (aiAction.action !== 'fold' && aiAction.action !== 'check') {
            setTimeout(() => soundEffects.chipsBet(), 100);
          }
          
          console.log('Executing AI action...');
          const newState = executePlayerAction(gameState, currentPlayer.id, aiAction.action, aiAction.amount);
          console.log('New game state after AI action:', {
            currentPlayerIndex: newState.currentPlayerIndex,
            currentPlayer: newState.players[newState.currentPlayerIndex]?.name,
            phase: newState.phase
          });
          
          setGameState(newState);
        } catch (error) {
          console.error('AI action error:', error);
          // エラーが発生した場合は強制的に次のプレイヤーに移る
          const newState = { ...gameState };
          newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
          setGameState(newState);
        }
        
        setTimeout(() => {
          setIsProcessingAction(false);
        }, 100);
        
      }, 1000); // AIの思考時間を短縮

      return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer, isProcessingAction]);

  // フェイルセーフ：AIが10秒以上行動しない場合の緊急処理
  useEffect(() => {
    if (!gameState.gameOver && currentPlayer?.isAI && !isProcessingAction) {
      const failsafeTimer = setTimeout(() => {
        console.warn('AI failsafe triggered - forcing action');
        setIsProcessingAction(true);
        
        // 強制的にチェックまたはフォールドさせる
        try {
          const forcedAction = gameState.currentBet > (currentPlayer.currentBet + currentPlayer.chips) 
            ? { action: 'fold' as PlayerAction }
            : gameState.currentBet === currentPlayer.currentBet 
              ? { action: 'check' as PlayerAction }
              : { action: 'call' as PlayerAction };
              
          console.log('Forced AI action:', forcedAction);
          const newState = executePlayerAction(gameState, currentPlayer.id, forcedAction.action);
          setGameState(newState);
        } catch (error) {
          console.error('Failsafe error:', error);
          // 最後の手段：単純に次のプレイヤーに移る
          const newState = { ...gameState };
          newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
          setGameState(newState);
        }
        
        setTimeout(() => setIsProcessingAction(false), 100);
      }, 10000); // 10秒のタイムアウト

      return () => clearTimeout(failsafeTimer);
    }
  }, [gameState, currentPlayer, isProcessingAction]);

  const handlePlayerAction = (action: PlayerAction, amount?: number) => {
    if (!humanPlayer || isProcessingAction || gameState.gameOver) return;

    // 効果音を再生
    switch (action) {
      case 'fold':
        soundEffects.fold();
        break;
      case 'call':
        soundEffects.call();
        break;
      case 'raise':
        soundEffects.raise();
        break;
      case 'check':
        soundEffects.check();
        break;
      case 'all-in':
        soundEffects.raise();
        break;
    }

    if (action !== 'fold' && action !== 'check') {
      soundEffects.chipsBet();
    }

    setIsProcessingAction(true);
    try {
      const newState = executePlayerAction(gameState, humanPlayer.id, action, amount);
      setGameState(newState);
    } catch (error) {
      console.error('Player action error:', error);
      alert('無効なアクションです');
    }
    setIsProcessingAction(false);
  };

  const getAvailableActions = (): PlayerAction[] => {
    if (!humanPlayer || isProcessingAction || gameState.gameOver || currentPlayer?.isAI) {
      return [];
    }

    const actions: PlayerAction[] = [];
    
    if (canPerformAction(gameState, humanPlayer.id, 'fold')) {
      actions.push('fold');
    }
    if (canPerformAction(gameState, humanPlayer.id, 'check')) {
      actions.push('check');
    }
    if (canPerformAction(gameState, humanPlayer.id, 'call')) {
      actions.push('call');
    }
    if (canPerformAction(gameState, humanPlayer.id, 'raise')) {
      actions.push('raise');
    }
    if (canPerformAction(gameState, humanPlayer.id, 'all-in')) {
      actions.push('all-in');
    }

    return actions;
  };

  const startNewGame = () => {
    soundEffects.buttonClick();
    soundEffects.cardShuffle();
    setGameState(initializeGame());
    setIsProcessingAction(false);
  };

  const aiPlayers = gameState.players.filter(p => p.isAI);

  // ヘルパー関数
  const getPhaseDescription = (phase: string): string => {
    switch (phase) {
      case 'pre-flop':
        return 'プリフロップ - 手札確認';
      case 'flop':
        return 'フロップ - カード3枚公開';
      case 'turn':
        return 'ターン - 4枚目公開';
      case 'river':
        return 'リバー - 最後のカード';
      case 'showdown':
        return 'ショーダウン - 勝負決定';
      default:
        return '';
    }
  };

  const getPhaseColor = (phase: string): string => {
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

  return (
    <div className="h-screen felt-texture text-white overflow-hidden flex flex-col">
      {/* モバイル最適化ヘッダー */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 bg-opacity-95 p-1.5 sm:p-2 shadow-xl border-b border-yellow-600 flex-shrink-0"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-yellow-400">
            🃏 ポーカー
          </h1>
          
          {/* ポット情報をヘッダーに統合 */}
          <div className="bg-yellow-700 px-2 py-1 rounded-lg">
            <div className="text-xs font-bold text-center">
              <div className="text-yellow-100">💰 ¥{gameState.pot.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => {
                soundEffects.buttonClick();
                setShowBeginnerGuide(true);
              }}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded font-bold text-xs transition-all"
            >
              💡
            </button>
            
            <button
              onClick={() => {
                soundEffects.buttonClick();
                setShowTutorial(true);
              }}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded font-bold text-xs transition-all"
            >
              📚
            </button>
            
            {gameState.gameOver && (
              <button
                onClick={startNewGame}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded font-bold text-xs transition-all"
              >
                🔄
              </button>
            )}
            
            {/* デバッグ用：強制進行ボタン */}
            {process.env.NODE_ENV === 'development' && currentPlayer?.isAI && (
              <button
                onClick={() => {
                  console.log('Force advancing game...');
                  const newState = { ...gameState };
                  newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
                  setGameState(newState);
                  setIsProcessingAction(false);
                }}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded font-bold text-xs transition-all"
              >
                ⏭
              </button>
            )}
          </div>
        </div>
        
        {/* ゲームフェーズ表示 */}
        <div className={`${getPhaseColor(gameState.phase)} text-center py-1 px-2 rounded mt-1`}>
          <div className="text-xs font-bold text-white">
            {getPhaseDescription(gameState.phase)}
          </div>
        </div>
      </motion.div>

      {/* モバイル最適化メインエリア */}
      <div className="flex-1 flex flex-col p-1 space-y-1">
        {/* 上部: AIプレイヤー */}
        <div className="flex justify-between items-center flex-shrink-0">
          {aiPlayers.map((player, index) => (
            <div key={player.id} className="relative">
              <div className="flex flex-col items-center">
                {/* AIプレイヤー情報（超コンパクト） */}
                <div className={`
                  bg-gray-800 bg-opacity-90 rounded-lg p-1.5 text-white border border-gray-600 mb-1
                  ${currentPlayer?.id === player.id ? 'ring-2 ring-yellow-400' : ''}
                  ${player.folded ? 'opacity-50' : ''}
                `}>
                  <div className="text-xs font-bold text-center">{player.name}</div>
                  <div className="text-xs text-green-300 text-center">¥{player.chips.toLocaleString()}</div>
                  {player.currentBet > 0 && (
                    <div className="text-xs text-yellow-300 text-center">¥{player.currentBet.toLocaleString()}</div>
                  )}
                </div>
                
                {/* AIプレイヤーカード */}
                <div className="flex space-x-1">
                  {player.hand.map((card, cardIndex) => (
                    <div key={cardIndex} className="w-8 h-12 bg-red-800 border border-yellow-600 rounded flex items-center justify-center">
                      <span className="text-yellow-300 text-xs">♠</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentPlayer?.id === player.id && isProcessingAction && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-80 rounded p-1 text-white text-xs">思考中</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 中央: コミュニティカード */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-gray-800 bg-opacity-80 rounded-xl p-2 border border-gray-600">
            <div className="text-yellow-300 text-xs font-bold text-center mb-2">コミュニティカード</div>
            <div className="flex space-x-1 justify-center">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className={`w-12 h-16 rounded border-2 flex items-center justify-center ${
                  index < gameState.communityCards.length 
                    ? 'bg-white border-gray-300' 
                    : 'bg-gray-600 border-gray-500 opacity-30'
                }`}>
                  {index < gameState.communityCards.length && gameState.communityCards[index] ? (
                    <div className="text-center">
                      <div className="text-xs font-black text-gray-800">{gameState.communityCards[index].rank}</div>
                      <div className={`text-lg ${gameState.communityCards[index].suit === '♥' || gameState.communityCards[index].suit === '♦' ? 'text-red-600' : 'text-gray-800'}`}>
                        {gameState.communityCards[index].suit}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs">?</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 下部: プレイヤーエリア */}
        <div className="flex-shrink-0 space-y-2">
          {humanPlayer && (
            <>
              {/* プレイヤー情報と手札 */}
              <div className="flex items-center justify-between bg-gray-800 bg-opacity-90 rounded-xl p-2 border border-gray-600">
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{humanPlayer.name}</div>
                  <div className="text-xs text-green-300">💰 ¥{humanPlayer.chips.toLocaleString()}</div>
                  {humanPlayer.currentBet > 0 && (
                    <div className="text-xs text-yellow-300">🎯 ¥{humanPlayer.currentBet.toLocaleString()}</div>
                  )}
                </div>
                
                {/* 手札 */}
                <div className="flex space-x-1">
                  {humanPlayer.hand.map((card, index) => (
                    <div key={index} className="w-12 h-16 bg-white border-2 border-gray-300 rounded flex flex-col items-center justify-between p-1">
                      <div className={`text-xs font-black ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-800'}`}>
                        {card.rank}
                      </div>
                      <div className={`text-lg font-bold ${card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-gray-800'}`}>
                        {card.suit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 手札強度 */}
              <HandStrengthIndicator 
                playerHand={humanPlayer.hand}
                communityCards={gameState.communityCards}
              />
            </>
          )}

          {/* アクションボタン */}
          <ActionButtons
            availableActions={getAvailableActions()}
            onAction={handlePlayerAction}
            currentBet={gameState.currentBet}
            playerChips={humanPlayer?.chips || 0}
            playerCurrentBet={humanPlayer?.currentBet || 0}
            disabled={!humanPlayer || currentPlayer?.isAI || isProcessingAction || gameState.gameOver}
          />
        </div>
      </div>

      {/* 初心者ガイド */}
      <BeginnerGuide
        isOpen={showBeginnerGuide}
        onClose={() => setShowBeginnerGuide(false)}
        currentPhase={gameState.phase}
        availableActions={getAvailableActions()}
      />

      {/* チュートリアルモーダル */}
      <Tutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* 初回プレイ時のチュートリアル表示 */}
      <AnimatePresence>
        {!localStorage.getItem('poker-tutorial-seen') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 m-4 max-w-md text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎮 ポーカーゲームへようこそ！
              </h2>
              <p className="text-gray-700 mb-6">
                初心者の方でも安心してプレイできます！<br/>
                まずは💡ヘルプボタンで遊び方を確認してみてください。
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowBeginnerGuide(true);
                    localStorage.setItem('poker-tutorial-seen', 'true');
                  }}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  💡 まずはヘルプを見る（おすすめ）
                </button>
                <button
                  onClick={() => {
                    setShowTutorial(true);
                    localStorage.setItem('poker-tutorial-seen', 'true');
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  📚 詳しいルール説明
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('poker-tutorial-seen', 'true');
                  }}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  ⚡ すぐにゲーム開始
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PokerGame;