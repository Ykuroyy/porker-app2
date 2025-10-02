import React from 'react';
import { getAllHandTypes } from '../utils/handEvaluator';

export const HandRules: React.FC = () => {
  const handTypes = getAllHandTypes();
  
  return (
    <div className="bg-white rounded-lg p-6 m-4 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
        カワイイ♡ポーカー
      </h2>
      <p className="text-center text-gray-600 mb-6 text-sm">
        5枚のカードで役を作ろう！
      </p>
      
      <div className="space-y-3">
        {handTypes.map((hand, index) => (
          <div key={hand.type} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            <div className="bg-pink-100 text-pink-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800 mb-1">
                {hand.type}
              </div>
              <div className="text-sm text-gray-600">
                {hand.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <div className="text-xs text-gray-500">
          弱い ← → 強い
        </div>
      </div>
    </div>
  );
};