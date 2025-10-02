import React, { useState } from 'react';
import { createDeck, shuffleDeck, dealHand, Card as CardType } from '../utils/cards';
import { evaluateHand, HandResult } from '../utils/handEvaluator';

// シンプルで大きなカードコンポーネント
const BigCard: React.FC<{ card: CardType; className?: string }> = ({ card, className = '' }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  return (
    <div className={`
      bg-white rounded-lg border-2 border-gray-300 shadow-md
      w-20 h-28 flex flex-col items-center justify-center
      ${isRed ? 'text-red-600' : 'text-black'}
      ${className}
    `}>
      <div className="text-lg font-bold">{card.rank}</div>
      <div className="text-3xl">{card.suit}</div>
    </div>
  );
};

// カードの裏面（AI用）
const BigCardBack: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`
      bg-blue-600 rounded-lg border-2 border-blue-700 shadow-md
      w-20 h-28 flex items-center justify-center
      ${className}
    `}>
      <div className="text-white text-2xl">🎴</div>
    </div>
  );
};

// プレイヤー情報表示
const PlayerInfo: React.FC<{
  name: string;
  chips: number;
  cards: CardType[];
  showCards: boolean;
  isActive: boolean;
  lastAction?: string;
}> = ({ name, chips, cards, showCards, isActive, lastAction }) => {
  return (
    <div className={`text-center p-3 rounded-lg ${isActive ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}>
      <div className="font-bold text-lg mb-2">{name}</div>
      <div className="text-sm mb-2">💰 {chips}</div>
      {lastAction && <div className="text-xs bg-blue-100 px-2 py-1 rounded">{lastAction}</div>}
      <div className="flex gap-2 mt-3 justify-center">
        {cards.map((card, i) => (
          <div key={i}>
            {showCards ? <BigCard card={card} /> : <BigCardBack />}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimplePoker: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'showdown'>('waiting');
  const [players, setPlayers] = useState([
    { name: 'あなた', chips: 1000, cards: [] as CardType[], lastAction: undefined as string | undefined },
    { name: 'コンピューター', chips: 1000, cards: [] as CardType[], lastAction: undefined as string | undefined }
  ]);
  const [pot, setPot] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [playerHand, setPlayerHand] = useState<HandResult | null>(null);
  const [aiHand, setAiHand] = useState<HandResult | null>(null);

  const startGame = () => {
    const deck = shuffleDeck(createDeck());
    const playerCards = deck.slice(0, 5);
    const aiCards = deck.slice(5, 10);
    
    const playerResult = evaluateHand(playerCards);
    const aiResult = evaluateHand(aiCards);
    
    setPlayers([
      { name: 'あなた', chips: 1000, cards: playerCards, lastAction: undefined },
      { name: 'コンピューター', chips: 1000, cards: aiCards, lastAction: undefined }
    ]);
    
    setPlayerHand(playerResult);
    setAiHand(aiResult);
    setGameState('playing');
    setActivePlayer(0);
    setPot(0);
    setWinner(null);
  };

  const playerAction = (action: string) => {
    const newPlayers = [...players];
    
    if (action === 'bet') {
      newPlayers[0].chips -= 50;
      newPlayers[0].lastAction = 'ベット(50)';
      setPot(prev => prev + 50);
    } else if (action === 'fold') {
      newPlayers[0].lastAction = 'フォールド';
      setWinner('コンピューター');
      setGameState('showdown');
      setPlayers(newPlayers);
      return;
    } else {
      newPlayers[0].lastAction = 'コール';
    }
    
    setPlayers(newPlayers);
    
    // AI の行動
    setTimeout(() => {
      const aiActions = ['call', 'bet'];
      const aiAction = aiActions[Math.floor(Math.random() * aiActions.length)];
      
      if (aiAction === 'bet') {
        newPlayers[1].chips -= 50;
        newPlayers[1].lastAction = 'ベット(50)';
        setPot(prev => prev + 50);
      } else {
        newPlayers[1].lastAction = 'コール';
      }
      
      setPlayers(newPlayers);
      
      // 勝敗判定
      setTimeout(() => {
        if (playerHand && aiHand) {
          if (playerHand.strength > aiHand.strength) {
            setWinner('あなた');
          } else if (aiHand.strength > playerHand.strength) {
            setWinner('コンピューター');
          } else {
            setWinner('引き分け');
          }
        }
        setGameState('showdown');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-lg mx-auto">
        
        {/* タイトル */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            🎴 シンプルポーカー
          </h1>
          <p className="text-green-600">見やすい大きなカードで対戦！</p>
        </div>

        {gameState === 'waiting' && (
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl"
            >
              🎲 ゲーム開始
            </button>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'showdown') && (
          <>
            {/* ポット */}
            <div className="text-center mb-6 bg-yellow-100 p-4 rounded-lg">
              <div className="text-xl font-bold">💰 ポット: {pot}</div>
              {winner && (
                <div className="mt-2 text-lg font-bold text-green-700">
                  🏆 勝者: {winner}
                </div>
              )}
            </div>

            {/* AI プレイヤー */}
            <div className="mb-6">
              <PlayerInfo
                name={players[1].name}
                chips={players[1].chips}
                cards={players[1].cards}
                showCards={gameState === 'showdown'}
                isActive={activePlayer === 1}
                lastAction={players[1].lastAction}
              />
              {gameState === 'showdown' && aiHand && (
                <div className="text-center mt-2 bg-gray-200 p-2 rounded">
                  <strong>{aiHand.type}</strong> - {aiHand.description}
                </div>
              )}
            </div>

            {/* プレイヤー */}
            <div className="mb-6">
              <PlayerInfo
                name={players[0].name}
                chips={players[0].chips}
                cards={players[0].cards}
                showCards={true}
                isActive={activePlayer === 0}
                lastAction={players[0].lastAction}
              />
              {playerHand && (
                <div className="text-center mt-2 bg-blue-200 p-2 rounded">
                  <strong>{playerHand.type}</strong> - {playerHand.description}
                </div>
              )}
            </div>

            {/* アクションボタン */}
            {gameState === 'playing' && activePlayer === 0 && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => playerAction('fold')}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  😔 降りる
                </button>
                <button
                  onClick={() => playerAction('call')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  👌 コール
                </button>
                <button
                  onClick={() => playerAction('bet')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                  💪 ベット
                </button>
              </div>
            )}

            {gameState === 'showdown' && (
              <div className="text-center">
                <button
                  onClick={() => setGameState('waiting')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg"
                >
                  🔄 新しいゲーム
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};