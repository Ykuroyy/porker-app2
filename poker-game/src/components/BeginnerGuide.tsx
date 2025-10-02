import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PlayerAction } from '../types/poker';

interface BeginnerGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: string;
  availableActions: PlayerAction[];
}

const BeginnerGuide: React.FC<BeginnerGuideProps> = ({ 
  isOpen, 
  onClose, 
  currentPhase, 
  availableActions 
}) => {
  const [currentTip, setCurrentTip] = useState(0);

  const getPhaseAdvice = () => {
    switch (currentPhase) {
      case 'pre-flop':
        return {
          title: '🎯 プリフロップのアドバイス',
          content: '手札2枚だけで判断する段階です。ペア（同じ数字2枚）や高い数字（A、K、Q、J）があれば強いです！',
          tips: [
            'ペアがあれば積極的に参加しましょう',
            'A、K、Q、Jなどの高いカードは有利',
            '弱い手札（2、3、4など）は無理せずフォールド'
          ]
        };
      case 'flop':
        return {
          title: '🃏 フロップのアドバイス',
          content: 'コミュニティカード3枚が公開されました！手札と合わせて役ができているかチェック！',
          tips: [
            'ペア以上の役ができていれば強い',
            'ストレートやフラッシュの可能性をチェック',
            '何もできていなければ様子見かフォールド'
          ]
        };
      case 'turn':
        return {
          title: '🎲 ターンのアドバイス',
          content: '4枚目のカードで状況が変わったかも。手持ちの役の強さを再確認しましょう！',
          tips: [
            'より強い役ができた場合は積極的に',
            '相手の行動パターンを観察',
            'ポットの大きさと手札の強さを比較'
          ]
        };
      case 'river':
        return {
          title: '🌊 リバーのアドバイス',
          content: '最後のカードです！最終的な手札の強さが決まりました。慎重に判断を！',
          tips: [
            '完成した役の強さを正確に把握',
            '相手も強い役を持っている可能性を考慮',
            '最後の勝負は慎重に'
          ]
        };
      default:
        return {
          title: '🎮 基本的なアドバイス',
          content: 'ポーカーは運と戦略のゲームです。焦らず、じっくり考えて判断しましょう！',
          tips: [
            'チュートリアルを読んでルールを理解',
            '無理をせず、弱い手札はフォールド',
            '相手の行動から情報を読み取る'
          ]
        };
    }
  };

  const getActionAdvice = () => {
    const advice: Record<PlayerAction, string> = {
      'fold': '❌ フォールド：負けを認めてゲームから降りる。損失を最小限に抑えられます',
      'check': '✅ チェック：お金を払わずに次に進む。ベットがない時のみ可能',
      'call': '💰 コール：相手と同じ金額をベット。勝負を続けたい時に',
      'raise': '🚀 レイズ：相手より多くベット。強い手札がある時や心理戦で',
      'all-in': '🔥 オールイン：全てのチップを賭ける！最強の手札がある時に'
    };

    return availableActions.map(action => advice[action]).filter(Boolean);
  };

  const phaseAdvice = getPhaseAdvice();
  const actionAdvice = getActionAdvice();

  const allTips = [
    {
      title: '🎯 今の状況',
      content: phaseAdvice.content,
      items: phaseAdvice.tips
    },
    {
      title: '🎮 選択できる行動',
      content: '現在あなたができる行動の説明です：',
      items: actionAdvice
    },
    {
      title: '🏆 勝利のコツ',
      content: '初心者が勝つためのポイント：',
      items: [
        '強い手札の時は積極的にベット',
        '弱い手札は早めにフォールド',
        'AIの行動パターンを観察して学習',
        '感情に左右されず冷静に判断'
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl shadow-2xl max-w-sm w-full mx-2 border-2 border-yellow-500 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-yellow-500">
            <h2 className="text-xl font-bold text-yellow-300">
              💡 初心者ガイド
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-green-700 rounded-lg transition-colors text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-3">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <h3 className="text-base font-bold text-yellow-200 mb-2">
                {allTips[currentTip].title}
              </h3>
              
              <p className="text-white text-xs leading-relaxed">
                {allTips[currentTip].content}
              </p>

              <div className="space-y-1">
                {allTips[currentTip].items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-2 bg-green-800 bg-opacity-50 rounded"
                  >
                    <span className="text-yellow-400 mr-2 text-xs">•</span>
                    <span className="text-white text-xs leading-tight">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ナビゲーション */}
          <div className="flex items-center justify-between p-3 border-t border-yellow-500">
            <div className="flex space-x-1">
              {allTips.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTip ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentTip(Math.max(0, currentTip - 1))}
                disabled={currentTip === 0}
                className="px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                前
              </button>
              
              {currentTip === allTips.length - 1 ? (
                <button
                  onClick={onClose}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded text-xs"
                >
                  開始！
                </button>
              ) : (
                <button
                  onClick={() => setCurrentTip(Math.min(allTips.length - 1, currentTip + 1))}
                  className="px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded text-xs"
                >
                  次
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BeginnerGuide;