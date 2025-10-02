export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  chips: number;
  currentBet: number;
  folded: boolean;
  isAI: boolean;
}

export type HandType = 
  | 'high-card'
  | 'pair' 
  | 'two-pair'
  | 'three-of-a-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-a-kind'
  | 'straight-flush'
  | 'royal-flush';

export interface HandEvaluation {
  type: HandType;
  rank: number;
  description: string;
  cards: Card[];
}

export type GamePhase = 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';

export type PlayerAction = 'fold' | 'check' | 'call' | 'raise' | 'all-in';

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentPlayerIndex: number;
  phase: GamePhase;
  currentBet: number;
  dealer: number;
  smallBlind: number;
  bigBlind: number;
  deck: Card[];
  gameOver: boolean;
  winner?: Player;
  showdown?: boolean;
}

export interface Tutorial {
  step: number;
  title: string;
  description: string;
  highlight?: string;
}

export interface GameSettings {
  startingChips: number;
  smallBlind: number;
  bigBlind: number;
  maxPlayers: number;
  difficulty: 'easy' | 'medium' | 'hard';
}