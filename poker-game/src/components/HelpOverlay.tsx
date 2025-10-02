import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface HelpOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
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
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">
            🎮 ポーカーの遊び方
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* 基本説明 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
          {/* ゲームの目的 */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              🎯 ゲームの目的
            </h3>
            <p className="text-lg leading-relaxed">
              <strong className="text-green-300">5枚のカード</strong>で最も強い役を作って、
              他のプレイヤーに勝つことが目標です！
            </p>
          </div>

          {/* 基本的な流れ */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              📋 ゲームの流れ
            </h3>
            <ol className="text-lg space-y-2">
              <li><span className="text-blue-300">1.</span> 手札2枚が配られる</li>
              <li><span className="text-blue-300">2.</span> コミュニティカード5枚が順次公開</li>
              <li><span className="text-blue-300">3.</span> 最強の役を作った人が勝ち！</li>
            </ol>
          </div>

          {/* アクション説明 */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              🎲 あなたの選択肢
            </h3>
            <div className="space-y-3 text-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span><strong>フォールド</strong> - ゲームから降りる</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span><strong>チェック</strong> - そのまま様子を見る</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span><strong>コール</strong> - 相手に合わせてベット</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span><strong>レイズ</strong> - ベット額を上げる</span>
              </div>
            </div>
          </div>

          {/* 役の強さ（簡易版） */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h3 className="text-xl font-bold text-yellow-300 mb-3">
              🏆 役の強さ（上が最強）
            </h3>
            <div className="space-y-2 text-lg">
              <div className="text-red-400 font-bold">🌟 ロイヤルフラッシュ</div>
              <div className="text-orange-400 font-bold">🔥 ストレートフラッシュ</div>
              <div className="text-yellow-400 font-bold">💎 フォーカード</div>
              <div className="text-green-400 font-bold">🏠 フルハウス</div>
              <div className="text-blue-400">🌊 フラッシュ</div>
              <div className="text-purple-400">📈 ストレート</div>
              <div className="text-gray-300">👫 ペア・ツーペア</div>
            </div>
          </div>
        </div>

        {/* 初心者のコツ */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-3">
            💡 初心者のコツ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-lg">
            <div>
              <strong>✨ 良いカードの時</strong><br />
              ペアや絵札があったら積極的にベット！
            </div>
            <div>
              <strong>🤔 迷った時</strong><br />
              弱いカードならフォールドが安全
            </div>
            <div>
              <strong>👀 相手を観察</strong><br />
              AIの行動パターンを覚えよう
            </div>
            <div>
              <strong>🎯 練習あるのみ</strong><br />
              何度もプレイして慣れよう！
            </div>
          </div>
        </div>

        {/* 閉じるボタン */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl transition-colors border-2 border-green-800"
          >
            🎮 ゲームを始める！
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpOverlay;