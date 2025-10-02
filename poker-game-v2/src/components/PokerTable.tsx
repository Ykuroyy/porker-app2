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
    <div className="h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 p-2 relative overflow-hidden flex flex-col">
      {/* テーブル背景装飾 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full mx-auto relative z-10 flex flex-col h-full">
        {/* コンパクトヘッダー */}
        <div className="text-center py-2 flex-shrink-0">
          <h1 className="text-lg font-bold text-white drop-shadow-lg">
            🎴 AI対戦ポーカー 🎯
          </h1>
        </div>

        {/* コンパクトなゲームエリア */}
        <div className="flex-1 flex flex-col justify-between py-2 min-h-0">
          
          {/* 上部 - AI対戦相手たち */}
          <div className="flex justify-around items-start px-2">
            <div className="transform scale-75">
              <Player
                {...players[1]}
                isActive={activePlayer === 1 && gamePhase === 'betting'}
                position="top"
              />
            </div>
            <div className="transform scale-75">
              <Player
                {...players[2]}
                isActive={activePlayer === 2 && gamePhase === 'betting'}
                position="top"
              />
            </div>
          </div>

          {/* 中央 - ポットとゲーム状況 */}
          <div className="text-center py-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-yellow-400/50 inline-block">
              <div className="text-yellow-300 text-lg font-bold">💰 {pot.toLocaleString()}</div>
              
              {gamePhase === 'showdown' && winner && (
                <div className="mt-2">
                  <div className="text-yellow-300 text-sm">🏆 {winner.name}</div>
                  <div className="text-white text-xs">{winner.handResult?.type}</div>
                </div>
              )}
            </div>
            
            {/* ゲーム状況表示 */}
            <div className="mt-2 text-white/80 text-sm">
              {gamePhase === 'waiting' && '🎯 ゲーム開始を待っています'}
              {gamePhase === 'dealing' && '🎴 カード配布中...'}
              {gamePhase === 'betting' && `🎮 ${players[activePlayer]?.name}の番`}
              {gamePhase === 'showdown' && '🏆 結果発表！'}
            </div>
          </div>

          {/* 下部 - プレイヤー */}
          <div className="flex justify-center">
            <Player
              {...players[0]}
              isActive={activePlayer === 0 && gamePhase === 'betting'}
              position="bottom"
            />
          </div>
        </div>

        {/* コンパクトなアクションエリア */}
        <div className="flex-shrink-0 pb-2">
          {gamePhase === 'waiting' && (
            <div className="text-center">
              <button
                onClick={dealCards}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                         text-white font-bold rounded-full shadow-lg 
                         hover:from-purple-600 hover:to-pink-600 
                         transform hover:scale-105 transition-all duration-300"
              >
                🎲 ゲーム開始
              </button>
            </div>
          )}

          {gamePhase === 'betting' && activePlayer === 0 && (
            <div className="flex justify-center gap-2 px-2">
              <button
                onClick={() => handlePlayerAction('fold')}
                className="flex-1 max-w-24 py-3 bg-red-500 text-white font-bold rounded-xl 
                         hover:bg-red-600 transform hover:scale-105 transition-all duration-200 text-sm"
              >
                😔 降りる
              </button>
              <button
                onClick={() => handlePlayerAction('call')}
                className="flex-1 max-w-24 py-3 bg-blue-500 text-white font-bold rounded-xl 
                         hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 text-sm"
              >
                👌 コール
              </button>
              <button
                onClick={() => handlePlayerAction('bet')}
                className="flex-1 max-w-24 py-3 bg-green-500 text-white font-bold rounded-xl 
                         hover:bg-green-600 transform hover:scale-105 transition-all duration-200 text-sm"
              >
                💪 ベット
              </button>
            </div>
          )}

          {gamePhase === 'showdown' && (
            <div className="text-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 
                         text-white font-bold rounded-full shadow-lg 
                         hover:from-green-600 hover:to-blue-600 
                         transform hover:scale-105 transition-all duration-300"
              >
                🔄 新ゲーム
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};