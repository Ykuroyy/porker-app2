import type { Card, HandType, HandEvaluation } from '../types/poker';
import { getRankValue } from './deck';

export function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5) {
    throw new Error('ハンドの評価には5枚以上のカードが必要です');
  }

  // 7枚のカードから最高の5枚の組み合わせを見つける
  const bestHand = findBestHand(cards);
  return evaluateFiveCards(bestHand);
}

function findBestHand(cards: Card[]): Card[] {
  if (cards.length === 5) return cards;
  
  let bestHand = cards.slice(0, 5);
  let bestRank = evaluateFiveCards(bestHand).rank;
  
  // 7C5 = 21通りの組み合わせをチェック
  const combinations = getCombinations(cards, 5);
  
  for (const combination of combinations) {
    const evaluation = evaluateFiveCards(combination);
    if (evaluation.rank > bestRank) {
      bestHand = combination;
      bestRank = evaluation.rank;
    }
  }
  
  return bestHand;
}

function getCombinations(cards: Card[], k: number): Card[][] {
  if (k === 1) return cards.map(card => [card]);
  if (k === cards.length) return [cards];
  
  const result: Card[][] = [];
  
  for (let i = 0; i <= cards.length - k; i++) {
    const head = cards[i];
    const tailCombinations = getCombinations(cards.slice(i + 1), k - 1);
    
    for (const tail of tailCombinations) {
      result.push([head, ...tail]);
    }
  }
  
  return result;
}

function evaluateFiveCards(cards: Card[]): HandEvaluation {
  const sortedCards = [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
  const ranks = sortedCards.map(card => getRankValue(card.rank));
  const suits = sortedCards.map(card => card.suit);
  
  const rankCounts = new Map<number, number>();
  ranks.forEach(rank => {
    rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1);
  });
  
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
  const isFlush = suits.every(suit => suit === suits[0]);
  const isStraight = checkStraight(ranks);
  
  // ロイヤルフラッシュ
  if (isFlush && isStraight && ranks[0] === 14) {
    return {
      type: 'royal-flush',
      rank: 10000000,
      description: 'ロイヤルフラッシュ',
      cards: sortedCards
    };
  }
  
  // ストレートフラッシュ
  if (isFlush && isStraight) {
    return {
      type: 'straight-flush',
      rank: 9000000 + ranks[0],
      description: 'ストレートフラッシュ',
      cards: sortedCards
    };
  }
  
  // フォーカード
  if (counts[0] === 4) {
    const fourRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 4)?.[0] || 0;
    return {
      type: 'four-of-a-kind',
      rank: 8000000 + fourRank,
      description: 'フォーカード',
      cards: sortedCards
    };
  }
  
  // フルハウス
  if (counts[0] === 3 && counts[1] === 2) {
    const threeRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 3)?.[0] || 0;
    const pairRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 2)?.[0] || 0;
    return {
      type: 'full-house',
      rank: 7000000 + threeRank * 100 + pairRank,
      description: 'フルハウス',
      cards: sortedCards
    };
  }
  
  // フラッシュ
  if (isFlush) {
    return {
      type: 'flush',
      rank: 6000000 + ranks[0] * 10000 + ranks[1] * 1000 + ranks[2] * 100 + ranks[3] * 10 + ranks[4],
      description: 'フラッシュ',
      cards: sortedCards
    };
  }
  
  // ストレート
  if (isStraight) {
    return {
      type: 'straight',
      rank: 5000000 + ranks[0],
      description: 'ストレート',
      cards: sortedCards
    };
  }
  
  // スリーカード
  if (counts[0] === 3) {
    const threeRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 3)?.[0] || 0;
    return {
      type: 'three-of-a-kind',
      rank: 4000000 + threeRank,
      description: 'スリーカード',
      cards: sortedCards
    };
  }
  
  // ツーペア
  if (counts[0] === 2 && counts[1] === 2) {
    const pairs = Array.from(rankCounts.entries())
      .filter(([_, count]) => count === 2)
      .map(([rank]) => rank)
      .sort((a, b) => b - a);
    return {
      type: 'two-pair',
      rank: 3000000 + pairs[0] * 100 + pairs[1],
      description: 'ツーペア',
      cards: sortedCards
    };
  }
  
  // ワンペア
  if (counts[0] === 2) {
    const pairRank = Array.from(rankCounts.entries()).find(([_, count]) => count === 2)?.[0] || 0;
    return {
      type: 'pair',
      rank: 2000000 + pairRank,
      description: 'ワンペア',
      cards: sortedCards
    };
  }
  
  // ハイカード
  return {
    type: 'high-card',
    rank: 1000000 + ranks[0] * 10000 + ranks[1] * 1000 + ranks[2] * 100 + ranks[3] * 10 + ranks[4],
    description: 'ハイカード',
    cards: sortedCards
  };
}

function checkStraight(ranks: number[]): boolean {
  // 通常のストレートチェック
  for (let i = 0; i < ranks.length - 1; i++) {
    if (ranks[i] - ranks[i + 1] !== 1) {
      // A-2-3-4-5のストレートをチェック
      if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
        return true;
      }
      return false;
    }
  }
  return true;
}

export function getHandDescription(handType: HandType): string {
  const descriptions: Record<HandType, string> = {
    'royal-flush': 'ロイヤルフラッシュ - 同じスートのA-K-Q-J-10',
    'straight-flush': 'ストレートフラッシュ - 同じスートの連続した5枚',
    'four-of-a-kind': 'フォーカード - 同じランクの4枚',
    'full-house': 'フルハウス - スリーカード + ワンペア',
    'flush': 'フラッシュ - 同じスートの5枚',
    'straight': 'ストレート - 連続した5枚のランク',
    'three-of-a-kind': 'スリーカード - 同じランクの3枚',
    'two-pair': 'ツーペア - 2つのペア',
    'pair': 'ワンペア - 同じランクの2枚',
    'high-card': 'ハイカード - 上記のいずれでもない場合'
  };
  
  return descriptions[handType];
}