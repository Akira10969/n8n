import { useState } from 'react';
import { Electricity } from './pages/Electricity';
import { OhmsLaw } from './pages/OhmsLaw';
import { Breadboard } from './pages/Breadboard';
import { CircuitBoard, Book, ChevronRight } from 'lucide-react';

export type TopicView = 'electricity' | 'ohms_law' | 'breadboard';

function App() {
  const [currentView, setCurrentView] = useState<TopicView>('electricity');

  const renderView = () => {
    switch (currentView) {
      case 'electricity':
        return <Electricity />;
      case 'ohms_law':
        return <OhmsLaw />;
      case 'breadboard':
        return <Breadboard />;
      default:
        return <Electricity />;
    }
  };

  const navItemClass = (view: TopicView) => `
    w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors
    ${currentView === view ? 'bg-engineering-accent text-white font-medium' : 'text-slate-400 hover:bg-engineering-light hover:text-white'}
  `;

  return (
    <div className="min-h-screen bg-engineering-dark text-slate-200 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 bg-engineering-base border-r border-engineering-light flex flex-col overflow-y-auto shrink-0">
        <div className="p-6 border-b border-engineering-light flex items-center gap-3 sticky top-0 bg-engineering-base z-10">
          <CircuitBoard className="text-engineering-accent w-6 h-6" />
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">CE Learning<br/>Platform</h1>
        </div>
        
        <nav className="p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
              <Book className="w-3 h-3" /> Electrical Fundamentals
            </h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setCurrentView('electricity')} className={navItemClass('electricity')}>
                  What is Electricity? <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('ohms_law')} className={navItemClass('ohms_law')}>
                  Ohm's Law <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
              <Book className="w-3 h-3" /> Breadboard Fundamentals
            </h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setCurrentView('breadboard')} className={navItemClass('breadboard')}>
                  Breadboard Prototyping <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
