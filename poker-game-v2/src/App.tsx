import { useState } from 'react';
import { SimplePokerGame } from './components/SimplePokerGame';
import { HandRules } from './components/HandRules';

type ViewMode = 'game' | 'rules';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('rules');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600">
      {/* Navigation */}
      <nav className="bg-white/20 backdrop-blur-md shadow-xl border-b border-white/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-white/30 backdrop-blur-sm rounded-full p-2 mt-4 mb-4 shadow-lg border border-white/40">
              <button
                onClick={() => setCurrentView('rules')}
                className={`
                  px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 transform
                  ${currentView === 'rules' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                  }
                `}
              >
                🎯 役一覧
              </button>
              <button
                onClick={() => setCurrentView('game')}
                className={`
                  px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 transform
                  ${currentView === 'game' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                  }
                `}
              >
                🎴 ゲーム
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