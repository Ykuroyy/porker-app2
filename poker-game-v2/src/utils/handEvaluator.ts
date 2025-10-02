// Simplified hand evaluation for 5-card poker
import { Card } from './cards';

export type HandType = 
  | 'ハイカード'      // High Card
  | 'ワンペア'        // One Pair  
  | 'ツーペア'        // Two Pair
  | 'スリーカード'    // Three of a Kind
  | 'ストレート'      // Straight
  | 'フラッシュ'      // Flush
  | 'フルハウス'      // Full House
  | 'フォーカード'    // Four of a Kind
  | 'ストレートフラッシュ'; // Straight Flush

export interface HandResult {
  type: HandType;
  strength: number; // 1-9 (higher is better)
  description: string;
}

// Hand rankings with Japanese descriptions (matching reference app style)
const HAND_RANKINGS: { [key in HandType]: { strength: number; description: string } } = {
  'ハイカード': { strength: 1, description: '同じマークや連続する数字がない' },
  'ワンペア': { strength: 2, description: '同じ数字のカードが2枚' },
  'ツーペア': { strength: 3, description: '同じ数字のペアが2組' },
  'スリーカード': { strength: 4, description: '同じ数字のカードが3枚' },
  'ストレート': { strength: 5, description: '連続する5つの数字' },
  'フラッシュ': { strength: 6, description: '同じマークのカードが5枚' },
  'フルハウス': { strength: 7, description: 'スリーカードとワンペア' },
  'フォーカード': { strength: 8, description: '同じ数字のカードが4枚' },
  'ストレートフラッシュ': { strength: 9, description: 'ストレートでフラッシュ' }
};

export const evaluateHand = (cards: Card[]): HandResult => {
  if (cards.length !== 5) {
    return {
      type: 'ハイカード',
      strength: 1,
      description: HAND_RANKINGS['ハイカード'].description
    };
  }

  // Count ranks and suits
  const rankCounts: { [key: number]: number } = {};
  const suitCounts: { [key: string]: number } = {};
  
  cards.forEach(card => {
    rankCounts[card.value] = (rankCounts[card.value] || 0) + 1;
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
  });

  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const isFlush = Object.values(suitCounts).some(count => count === 5);
  
  // Check for straight
  const sortedValues = [...new Set(cards.map(c => c.value))].sort((a, b) => a - b);
  const isStraight = sortedValues.length === 5 && 
    (sortedValues[4] - sortedValues[0] === 4 || 
     (sortedValues[0] === 1 && sortedValues[1] === 10)); // A-10-J-Q-K straight

  // Determine hand type
  let handType: HandType;
  
  if (isStraight && isFlush) {
    handType = 'ストレートフラッシュ';
  } else if (counts[0] === 4) {
    handType = 'フォーカード';
  } else if (counts[0] === 3 && counts[1] === 2) {
    handType = 'フルハウス';
  } else if (isFlush) {
    handType = 'フラッシュ';
  } else if (isStraight) {
    handType = 'ストレート';
  } else if (counts[0] === 3) {
    handType = 'スリーカード';
  } else if (counts[0] === 2 && counts[1] === 2) {
    handType = 'ツーペア';
  } else if (counts[0] === 2) {
    handType = 'ワンペア';
  } else {
    handType = 'ハイカード';
  }

  return {
    type: handType,
    strength: HAND_RANKINGS[handType].strength,
    description: HAND_RANKINGS[handType].description
  };
};

// Get all hand types for reference display
export const getAllHandTypes = (): Array<{ type: HandType; strength: number; description: string }> => {
  return Object.entries(HAND_RANKINGS)
    .map(([type, info]) => ({
      type: type as HandType,
      strength: info.strength,
      description: info.description
    }))
    .sort((a, b) => a.strength - b.strength);
};