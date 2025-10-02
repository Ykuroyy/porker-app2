import React, { useState, useEffect } from 'react';
import { createDeck, shuffleDeck, dealHand, Card as CardType } from '../utils/cards';
import { evaluateHand, HandResult } from '../utils/handEvaluator';
import { Player } from './Player';
import { Card } from './Card';

interface PlayerData {
  id: number;
  name: string;
  chips: number;
  cards: CardType[];
  isPlayer: boolean;
  lastAction?: string;
  avatar: string;
  handResult?: HandResult;
}

export const PokerTable: React.FC = () => {
  const [players, setPlayers] = useState<PlayerData[]>([
    { id: 1, name: 'あなた', chips: 1000, cards: [], isPlayer: true, avatar: '👤' },
    { id: 2, name: 'さくら', chips: 1000, cards: [], isPlayer: false, avatar: '🌸' },
    { id: 3, name: 'ひなた', chips: 1000, cards: [], isPlayer: false, avatar: '☀️' },
  ]);
  
  const [pot, setPot] = useState(0);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'dealing' | 'betting' | 'showdown'>('waiting');
  const [activePlayer, setActivePlayer] = useState(0);
  const [winner, setWinner] = useState<PlayerData | null>(null);

  const dealCards = () => {
    setGamePhase('dealing');
    const deck = shuffleDeck(createDeck());
    
    // 各プレイヤーに5枚ずつカードを配る
    const newPlayers = players.map((player, index) => {
      const startIndex = index * 5;
      const playerCards = deck.slice(startIndex, startIndex + 5);
      const handResult = evaluateHand(playerCards);
      
      return {
        ...player,
        cards: playerCards,
        handResult,
        lastAction: undefined
      };
    });
    
    setPlayers(newPlayers);
    
    // ディール完了後、ベッティングフェーズへ
    setTimeout(() => {
      setGamePhase('betting');
      setActivePlayer(0);
    }, 1500);
  };

  const handlePlayerAction = (action: string) => {
    const currentPlayer = players[activePlayer];
    const newPlayers = [...players];
    newPlayers[activePlayer] = { ...currentPlayer, lastAction: action };
    
    if (action === 'bet') {
      newPlayers[activePlayer].chips -= 50;
      setPot(prev => prev + 50);
    }
    
    setPlayers(newPlayers);
    
    // 次のプレイヤーまたはAI行動
    if (activePlayer < players.length - 1) {
      setActivePlayer(prev => prev + 1);
    } else {
      // 全員行動完了、ショーダウンへ
      setTimeout(() => {
        setGamePhase('showdown');
        determineWinner(newPlayers);
      }, 500);
    }
  };

  const determineWinner = (gamePlayers: PlayerData[]) => {
    const playerWithBestHand = gamePlayers.reduce((best, current) => {
      if (!best.handResult || !current.handResult) return best;
      return current.handResult.strength > best.handResult.strength ? current : best;
    });
    
    setWinner(playerWithBestHand);
  };

  // AI行動の自動化
  useEffect(() => {
    if (gamePhase === 'betting' && activePlayer > 0) {
      const timer = setTimeout(() => {
        const actions = ['call', 'bet', 'fold'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        handlePlayerAction(randomAction);
      }, 1000 + Math.random() * 1500);
      
      return () => clearTimeout(timer);
    }
  }, [activePlayer, gamePhase]);

  const resetGame = () => {
    setPlayers(prev => prev.map(p => ({ ...p, cards: [], lastAction: undefined, handResult: undefined })));
    setPot(0);
    setGamePhase('waiting');
    setActivePlayer(0);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 p-4 relative overflow-hidden">
      {/* テーブル背景装飾 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🎴 カワイイ♡ポーカーテーブル 🎯
          </h1>
          <p className="text-white/90 text-lg">AI相手と本格ポーカー対戦！</p>
        </div>

        {/* ポーカーテーブル */}
        <div className="relative">
          {/* テーブル面 */}
          <div className="bg-green-600/80 backdrop-blur-sm rounded-full w-full h-96 border-8 border-amber-600/50 shadow-2xl relative overflow-hidden">
            {/* テーブルの質感 */}
            <div className="absolute inset-4 rounded-full border-4 border-amber-700/30 bg-gradient-to-br from-green-700/50 to-green-800/50"></div>
            
            {/* ポット表示 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-4 border border-yellow-400/50">
                <div className="text-center">
                  <div className="text-yellow-300 text-2xl font-bold">💰 ポット</div>
                  <div className="text-white text-xl font-bold">{pot.toLocaleString()}</div>
                </div>
                
                {gamePhase === 'showdown' && winner && (
                  <div className="mt-4 text-center">
                    <div className="text-yellow-300 text-lg">🏆 勝者</div>
                    <div className="text-white font-bold">{winner.name}</div>
                    <div className="text-sm text-white/80">{winner.handResult?.type}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* プレイヤー配置 */}
          <div className="absolute inset-0">
            {/* 上部 - AI プレイヤー */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Player
                {...players[1]}
                isActive={activePlayer === 1 && gamePhase === 'betting'}
                position="top"
              />
            </div>

            {/* 右部 - AI プレイヤー */}
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
              <Player
                {...players[2]}
                isActive={activePlayer === 2 && gamePhase === 'betting'}
                position="right"
              />
            </div>

            {/* 下部 - 人間プレイヤー */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <Player
                {...players[0]}
                isActive={activePlayer === 0 && gamePhase === 'betting'}
                position="bottom"
              />
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-8 text-center">
          {gamePhase === 'waiting' && (
            <button
              onClick={dealCards}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white font-bold rounded-full text-lg shadow-xl 
                       hover:from-purple-600 hover:to-pink-600 
                       transform hover:scale-105 transition-all duration-300"
            >
              🎲 ゲーム開始
            </button>
          )}

          {gamePhase === 'betting' && activePlayer === 0 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePlayerAction('fold')}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl 
                         hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
              >
                😔 フォールド
              </button>
              <button
                onClick={() => handlePlayerAction('call')}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl 
                         hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
              >
                👌 コール
              </button>
              <button
                onClick={() => handlePlayerAction('bet')}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl 
                         hover:bg-green-600 transform hover:scale-105 transition-all duration-200"
              >
                💪 ベット (50)
              </button>
            </div>
          )}

          {gamePhase === 'showdown' && (
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 
                       text-white font-bold rounded-full text-lg shadow-xl 
                       hover:from-green-600 hover:to-blue-600 
                       transform hover:scale-105 transition-all duration-300"
            >
              🔄 新しいゲーム
            </button>
          )}
        </div>

        {/* ゲーム状況表示 */}
        <div className="mt-6 text-center">
          <div className="text-white/80 text-sm">
            {gamePhase === 'waiting' && '🎯 ゲーム開始を待っています'}
            {gamePhase === 'dealing' && '🎴 カードを配っています...'}
            {gamePhase === 'betting' && `🎮 ${players[activePlayer]?.name}の番です`}
            {gamePhase === 'showdown' && '🏆 結果発表！'}
          </div>
        </div>
      </div>
    </div>
  );
};