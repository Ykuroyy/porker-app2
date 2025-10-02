import type { GameState, Player, PlayerAction, Card } from '../types/poker';
import { createDeck, dealCards } from './deck';
import { evaluateHand } from './handEvaluator';

export function initializeGame(): GameState {
  const deck = createDeck();
  
  const players: Player[] = [
    {
      id: 'player',
      name: 'あなた',
      hand: [],
      chips: 1000,
      currentBet: 0,
      folded: false,
      isAI: false
    },
    {
      id: 'ai1',
      name: 'アグレッシブ・アキラ',
      hand: [],
      chips: 1000,
      currentBet: 0,
      folded: false,
      isAI: true
    },
    {
      id: 'ai2',
      name: 'コンサバ・ユミ',
      hand: [],
      chips: 1000,
      currentBet: 0,
      folded: false,
      isAI: true
    }
  ];

  // 各プレイヤーに2枚ずつカードを配る
  players.forEach(player => {
    player.hand = dealCards(deck, 2);
  });

  const gameState: GameState = {
    players,
    communityCards: [],
    pot: 0,
    currentPlayerIndex: 0,
    phase: 'pre-flop',
    currentBet: 0,
    dealer: 0,
    smallBlind: 25,
    bigBlind: 50,
    deck,
    gameOver: false
  };

  // ブラインドを設定
  setBlindBets(gameState);
  
  return gameState;
}

function setBlindBets(gameState: GameState): void {
  const { players, smallBlind, bigBlind, dealer } = gameState;
  const numPlayers = players.length;
  
  const smallBlindIndex = (dealer + 1) % numPlayers;
  const bigBlindIndex = (dealer + 2) % numPlayers;
  
  console.log('Setting blind bets:', {
    dealer,
    smallBlindIndex,
    bigBlindIndex,
    smallBlind,
    bigBlind
  });
  
  players[smallBlindIndex].currentBet = smallBlind;
  players[smallBlindIndex].chips -= smallBlind;
  
  players[bigBlindIndex].currentBet = bigBlind;
  players[bigBlindIndex].chips -= bigBlind;
  
  gameState.pot = smallBlind + bigBlind;
  gameState.currentBet = bigBlind;
  
  // 最初の行動プレイヤーはビッグブラインドの次
  gameState.currentPlayerIndex = (bigBlindIndex + 1) % numPlayers;
  
  console.log('Blind bets set. First player:', players[gameState.currentPlayerIndex]?.name);
}

export function executePlayerAction(
  gameState: GameState, 
  playerId: string, 
  action: PlayerAction, 
  amount?: number
): GameState {
  const newState = { ...gameState };
  const player = newState.players.find(p => p.id === playerId);
  
  if (!player || player.folded) return newState;
  
  switch (action) {
    case 'fold':
      player.folded = true;
      break;
      
    case 'check':
      if (newState.currentBet > player.currentBet) {
        throw new Error('チェックできません。現在のベットに合わせる必要があります。');
      }
      break;
      
    case 'call':
      const callAmount = newState.currentBet - player.currentBet;
      const actualCallAmount = Math.min(callAmount, player.chips);
      player.chips -= actualCallAmount;
      player.currentBet += actualCallAmount;
      newState.pot += actualCallAmount;
      break;
      
    case 'raise':
      if (!amount || amount < newState.currentBet * 2) {
        throw new Error('レイズ額が不正です。');
      }
      const raiseAmount = amount - player.currentBet;
      const actualRaiseAmount = Math.min(raiseAmount, player.chips);
      player.chips -= actualRaiseAmount;
      player.currentBet += actualRaiseAmount;
      newState.pot += actualRaiseAmount;
      newState.currentBet = player.currentBet;
      break;
      
    case 'all-in':
      newState.pot += player.chips;
      player.currentBet += player.chips;
      if (player.currentBet > newState.currentBet) {
        newState.currentBet = player.currentBet;
      }
      player.chips = 0;
      break;
  }
  
  console.log(`Player ${player.name} performed ${action}`, { 
    amount, 
    newBet: player.currentBet, 
    chips: player.chips 
  });
  
  // 次のプレイヤーに移る
  moveToNextPlayer(newState);
  
  // ベッティングラウンドが終了したかチェック
  if (isBettingRoundComplete(newState)) {
    console.log('Advancing game phase from:', newState.phase);
    advanceGamePhase(newState);
    console.log('Advanced to phase:', newState.phase);
  }
  
  return newState;
}

function moveToNextPlayer(gameState: GameState): void {
  const { players } = gameState;
  const startIndex = gameState.currentPlayerIndex;
  let nextIndex = (startIndex + 1) % players.length;
  let attempts = 0;
  
  console.log('Moving from player:', players[startIndex]?.name);
  
  // フォールドしていないプレイヤーを探す
  while (players[nextIndex].folded && attempts < players.length) {
    nextIndex = (nextIndex + 1) % players.length;
    attempts++;
  }
  
  // 無限ループ防止
  if (attempts >= players.length) {
    console.error('Could not find next active player - all players folded?');
    // ゲーム終了処理
    gameState.gameOver = true;
    return;
  }
  
  console.log('Moving to player:', players[nextIndex]?.name);
  gameState.currentPlayerIndex = nextIndex;
}

function isBettingRoundComplete(gameState: GameState): boolean {
  const activePlayers = gameState.players.filter(p => !p.folded);
  
  console.log('Checking if betting round complete:', {
    activePlayers: activePlayers.length,
    playerBets: activePlayers.map(p => ({ name: p.name, bet: p.currentBet, chips: p.chips })),
    currentBet: gameState.currentBet
  });
  
  if (activePlayers.length <= 1) {
    console.log('Round complete: only one active player');
    return true;
  }
  
  // 全員が同じベット額でラウンドを1周したかチェック
  const maxBet = Math.max(...activePlayers.map(p => p.currentBet));
  const allPlayersMatched = activePlayers.every(p => p.currentBet === maxBet || p.chips === 0);
  
  // さらに、全員が少なくとも一度は行動済みかチェック
  // 簡易的に、現在のベットが設定されている場合は完了とみなす
  const hasAction = maxBet > 0 || gameState.phase !== 'pre-flop';
  
  const isComplete = allPlayersMatched && hasAction;
  console.log('Betting round complete:', isComplete, { maxBet, allPlayersMatched, hasAction });
  
  return isComplete;
}

function advanceGamePhase(gameState: GameState): void {
  // ベットをリセット
  gameState.players.forEach(player => {
    player.currentBet = 0;
  });
  gameState.currentBet = 0;
  
  switch (gameState.phase) {
    case 'pre-flop':
      // フロップ - 3枚のコミュニティカードを配る
      gameState.communityCards = dealCards(gameState.deck, 3);
      gameState.phase = 'flop';
      break;
      
    case 'flop':
      // ターン - 1枚のコミュニティカードを追加
      gameState.communityCards.push(...dealCards(gameState.deck, 1));
      gameState.phase = 'turn';
      break;
      
    case 'turn':
      // リバー - 最後の1枚のコミュニティカードを追加
      gameState.communityCards.push(...dealCards(gameState.deck, 1));
      gameState.phase = 'river';
      break;
      
    case 'river':
      // ショーダウン
      gameState.phase = 'showdown';
      determineWinner(gameState);
      break;
  }
  
  if (gameState.phase !== 'showdown') {
    gameState.currentPlayerIndex = (gameState.dealer + 1) % gameState.players.length;
  }
}

function determineWinner(gameState: GameState): void {
  const activePlayers = gameState.players.filter(p => !p.folded);
  
  if (activePlayers.length === 1) {
    gameState.winner = activePlayers[0];
    gameState.winner.chips += gameState.pot;
    gameState.gameOver = true;
    return;
  }
  
  // 各プレイヤーのハンドを評価
  const playerEvaluations = activePlayers.map(player => ({
    player,
    evaluation: evaluateHand([...player.hand, ...gameState.communityCards])
  }));
  
  // 最高ランクを見つける
  const maxRank = Math.max(...playerEvaluations.map(pe => pe.evaluation.rank));
  const winners = playerEvaluations.filter(pe => pe.evaluation.rank === maxRank);
  
  // ポットを分割（引き分けの場合）
  const winnings = Math.floor(gameState.pot / winners.length);
  winners.forEach(({ player }) => {
    player.chips += winnings;
  });
  
  gameState.winner = winners[0].player;
  gameState.showdown = true;
  gameState.gameOver = true;
}

export function getAIAction(gameState: GameState, playerId: string): { action: PlayerAction; amount?: number } {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player || !player.isAI) {
    throw new Error('Invalid AI player');
  }
  
  console.log(`Getting AI action for ${player.name}:`, {
    chips: player.chips,
    currentBet: player.currentBet,
    gameCurrentBet: gameState.currentBet,
    callAmount: gameState.currentBet - player.currentBet
  });
  
  const callAmount = gameState.currentBet - player.currentBet;
  const handStrength = evaluateHandStrength(player.hand, gameState.communityCards);
  
  // フォールバック行動の確保
  if (callAmount === 0) {
    // チェックできる場合は必ずチェック
    console.log(`${player.name} choosing CHECK (no bet to call)`);
    return { action: 'check' };
  }
  
  if (player.chips === 0) {
    // チップがない場合はチェック（オールインしてる状態）
    console.log(`${player.name} choosing CHECK (no chips)`);
    return { action: 'check' };
  }
  
  // 簡略化されたAIロジック
  if (handStrength > 0.6) {
    // 強いハンド：コールかレイズ
    if (player.chips >= callAmount) {
      if (handStrength > 0.8 && player.chips >= callAmount * 2) {
        const raiseAmount = Math.min(gameState.currentBet * 2, player.chips + player.currentBet);
        console.log(`${player.name} choosing RAISE to ${raiseAmount}`);
        return { action: 'raise', amount: raiseAmount };
      } else {
        console.log(`${player.name} choosing CALL for ${callAmount}`);
        return { action: 'call' };
      }
    }
  } else if (handStrength > 0.3 && player.chips >= callAmount) {
    // 中程度のハンド：コール
    console.log(`${player.name} choosing CALL for ${callAmount}`);
    return { action: 'call' };
  }
  
  // 弱いハンドまたはチップ不足：フォールド
  console.log(`${player.name} choosing FOLD`);
  return { action: 'fold' };
}

function evaluateHandStrength(hand: Card[], communityCards: Card[]): number {
  if (communityCards.length === 0) {
    // プリフロップの場合は手札のペアや高いカードを評価
    const ranks = hand.map(card => {
      switch (card.rank) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 11;
        default: return parseInt(card.rank) || 10;
      }
    });
    
    if (ranks[0] === ranks[1]) return 0.8; // ペア
    if (Math.abs(ranks[0] - ranks[1]) <= 4) return 0.6; // 近いランク
    if (Math.max(...ranks) >= 11) return 0.4; // 高いカード
    return 0.2;
  }
  
  // コミュニティカードがある場合
  const allCards = [...hand, ...communityCards];
  const evaluation = evaluateHand(allCards);
  
  switch (evaluation.type) {
    case 'royal-flush': return 1.0;
    case 'straight-flush': return 0.95;
    case 'four-of-a-kind': return 0.9;
    case 'full-house': return 0.85;
    case 'flush': return 0.8;
    case 'straight': return 0.75;
    case 'three-of-a-kind': return 0.7;
    case 'two-pair': return 0.6;
    case 'pair': return 0.4;
    default: return 0.2;
  }
}

export function canPerformAction(gameState: GameState, playerId: string, action: PlayerAction): boolean {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player || player.folded || gameState.gameOver) return false;
  
  const callAmount = gameState.currentBet - player.currentBet;
  
  switch (action) {
    case 'fold':
      return true;
    case 'check':
      return callAmount === 0;
    case 'call':
      return callAmount > 0 && player.chips >= callAmount;
    case 'raise':
      return player.chips >= gameState.currentBet;
    case 'all-in':
      return player.chips > 0;
    default:
      return false;
  }
}