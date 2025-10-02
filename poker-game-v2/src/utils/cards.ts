// Simple card types and utilities for V2
export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // A=1, 2-10=face, J=11, Q=12, K=13
}

// Create a standard deck
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      const value = rank === 'A' ? 1 : (rank === 'J' ? 11 : rank === 'Q' ? 12 : rank === 'K' ? 13 : parseInt(rank));
      deck.push({ suit, rank, value });
    }
  }
  
  return deck;
};

// Simple shuffle function
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal 5 cards from deck
export const dealHand = (deck: Card[]): { hand: Card[], remainingDeck: Card[] } => {
  const hand = deck.slice(0, 5);
  const remainingDeck = deck.slice(5);
  return { hand, remainingDeck };
};