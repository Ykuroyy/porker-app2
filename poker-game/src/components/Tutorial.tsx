import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { HandType } from '../types/poker';
import { getHandDescription } from '../utils/handEvaluator';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'ポーカーへようこそ！',
    content: 'テキサスホールデムポーカーの基本を学びましょう。このゲームは世界中で愛されているカードゲームです。'
  },
  {
    title: '基本ルール',
    content: '各プレイヤーは2枚の手札を受け取ります。5枚のコミュニティカード（共通カード）と合わせて、最強の5枚のポーカーハンドを作ることが目標です。'
  },
  {
    title: 'ゲームの流れ',
    content: `
      1. プリフロップ: 手札2枚が配られる
      2. フロップ: コミュニティカード3枚が公開
      3. ターン: 4枚目のコミュニティカードが公開
      4. リバー: 5枚目のコミュニティカードが公開
      5. ショーダウン: 残ったプレイヤーが手札を公開
    `
  },
  {
    title: 'アクションの種類',
    content: `
      • フォールド: ゲームから降りる
      • チェック: ベットせずにパス（ベットがない場合のみ）
      • コール: 相手のベットに合わせる
      • レイズ: ベット額を上げる
      • オールイン: 全てのチップを賭ける
    `
  },
  {
    title: 'ポーカーハンドランキング（強い順）',
    content: ''
  }
];

const handRankings: HandType[] = [
  'royal-flush',
  'straight-flush', 
  'four-of-a-kind',
  'full-house',
  'flush',
  'straight',
  'three-of-a-kind',
  'two-pair',
  'pair',
  'high-card'
];

const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentTutorial.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              {currentStep === tutorialSteps.length - 1 ? (
                // ハンドランキング表示
                <div className="space-y-4">
                  <p className="text-gray-700 mb-4">
                    ポーカーでは以下の順序でハンドが強くなります：
                  </p>
                  <div className="space-y-3">
                    {handRankings.map((handType, index) => (
                      <motion.div
                        key={handType}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="w-8 h-8 bg-poker-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getHandDescription(handType).split(' - ')[0]}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getHandDescription(handType).split(' - ')[1]}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentTutorial.content}
                </div>
              )}
            </div>

            {/* フッター */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-poker-green' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-1" />
                  前へ
                </button>

                {currentStep === tutorialSteps.length - 1 ? (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-poker-green hover:bg-poker-felt text-white rounded-lg font-semibold transition-colors"
                  >
                    始める
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 bg-poker-green hover:bg-poker-felt text-white rounded-lg font-semibold transition-colors"
                  >
                    次へ
                    <ChevronRightIcon className="w-5 h-5 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tutorial;