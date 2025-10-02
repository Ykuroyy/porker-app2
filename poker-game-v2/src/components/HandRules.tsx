import React from 'react';
import { getAllHandTypes } from '../utils/handEvaluator';

export const HandRules: React.FC = () => {
  const handTypes = getAllHandTypes();
  
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 m-4 shadow-2xl border border-white/50 
                   transform transition-all duration-300 hover:scale-105 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-cyan-200/30 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center mb-3">
          <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            🎴 カワイイ♡ポーカー 🎯
          </span>
        </h2>
        <p className="text-center text-gray-700 mb-8 text-lg font-medium">
          ✨ 5枚のカードで役を作ろう！ ✨
        </p>
      
        <div className="space-y-4">
          {handTypes.map((hand, index) => (
            <div key={hand.type} className="flex items-start gap-4 p-4 rounded-2xl 
                                          bg-gradient-to-r from-white via-gray-50 to-white
                                          shadow-md hover:shadow-lg transition-all duration-300 
                                          hover:scale-105 border border-gray-100">
              <div className={`
                rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0
                transform transition-all duration-300 hover:rotate-12 shadow-md
                ${index < 3 ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white' :
                  index < 6 ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white' :
                  'bg-gradient-to-r from-green-400 to-emerald-500 text-white'}
              `}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-800 mb-2 
                              bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  {hand.type}
                </div>
                <div className="text-gray-600 font-medium">
                  {hand.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-white 
                         rounded-full shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">💪 弱い</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
              ))}
            </div>
            <span className="text-purple-600 font-bold">🏆 強い</span>
          </div>
        </div>
      </div>
    </div>
  );
};