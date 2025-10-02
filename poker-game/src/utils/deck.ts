import type { Card, Suit, Rank } from '../types/poker';

export const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        id: `${rank}-${suit}`
      });
    }
  }
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function dealCard(deck: Card[]): Card | null {
  return deck.pop() || null;
}

export function dealCards(deck: Card[], count: number): Card[] {
  const cards: Card[] = [];
  
  for (let i = 0; i < count; i++) {
    const card = dealCard(deck);
    if (card) {
      cards.push(card);
    }
  }
  
  return cards;
}

export function getRankValue(rank: Rank): number {
  switch (rank) {
    case 'A': return 14; // エースは高位として扱う
    case 'K': return 13;
    case 'Q': return 12;
    case 'J': return 11;
    case '10': return 10;
    case '9': return 9;
    case '8': return 8;
    case '7': return 7;
    case '6': return 6;
    case '5': return 5;
    case '4': return 4;
    case '3': return 3;
    case '2': return 2;
    default: return 0;
  }
}

export function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === '♥' || suit === '♦' ? 'red' : 'black';
}

export function formatCard(card: Card): string {
  return `${card.rank}${card.suit}`;
}