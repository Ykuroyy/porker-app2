import { useState } from 'react';
import { SimplePokerGame } from './components/SimplePokerGame';
import { HandRules } from './components/HandRules';
import { PokerTable } from './components/PokerTable';
import { SimplePoker } from './components/SimplePoker';

type ViewMode = 'game' | 'rules' | 'table' | 'simple';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('simple');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600">
      {/* Navigation */}
      <nav className="bg-white/20 backdrop-blur-md shadow-xl border-b border-white/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-2">
          <div className="flex justify-center">
            <div className="flex bg-white/30 backdrop-blur-sm rounded-full p-1 mt-2 mb-2 shadow-lg border border-white/40">
              <button
                onClick={() => setCurrentView('simple')}
                className={`
                  px-3 py-2 rounded-full font-bold text-xs transition-all duration-300 transform
                  ${currentView === 'simple' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                  }
                `}
              >
                ✨ シンプル
              </button>
              <button
                onClick={() => setCurrentView('rules')}
                className={`
                  px-3 py-2 rounded-full font-bold text-xs transition-all duration-300 transform
                  ${currentView === 'rules' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                  }
                `}
              >
                📚 ルール
              </button>
              <button
                onClick={() => setCurrentView('game')}
                className={`
                  px-3 py-2 rounded-full font-bold text-xs transition-all duration-300 transform
                  ${currentView === 'game' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                  }
                `}
              >
                🎲 練習
              </button>
              <button
                onClick={() => setCurrentView('table')}
                className={`
                  px-3 py-2 rounded-full font-bold text-xs transition-all duration-300 transform
                  ${currentView === 'table' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                    : 'text-white/90 hover:text-white hover:bg-white/20'
                  }
                `}
              >
                🎯 対戦
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {currentView === 'simple' && <SimplePoker />}
        {currentView === 'rules' && <HandRules />}
        {currentView === 'game' && <SimplePokerGame />}
        {currentView === 'table' && <PokerTable />}
      </main>
    </div>
  );
}

export default App;