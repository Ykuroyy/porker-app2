import React, { useState } from 'react';
import { SimplePokerGame } from './components/SimplePokerGame';
import { HandRules } from './components/HandRules';

type ViewMode = 'game' | 'rules';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('rules');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-full p-1 mt-3 mb-3">
              <button
                onClick={() => setCurrentView('rules')}
                className={`
                  px-6 py-2 rounded-full font-medium text-sm transition-all duration-200
                  ${currentView === 'rules' 
                    ? 'bg-pink-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                役一覧
              </button>
              <button
                onClick={() => setCurrentView('game')}
                className={`
                  px-6 py-2 rounded-full font-medium text-sm transition-all duration-200
                  ${currentView === 'game' 
                    ? 'bg-pink-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                ゲーム
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {currentView === 'rules' && <HandRules />}
        {currentView === 'game' && <SimplePokerGame />}
      </main>
    </div>
  );
}

export default App;