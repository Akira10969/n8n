import { useState } from 'react';
import { CampaignMap } from './components/CampaignMap';
import { Mission01 } from './missions/Mission01';
import { Mission05 } from './missions/Mission05';
import { Mission17 } from './missions/Mission17';
import { CircuitBoard, Map } from 'lucide-react';

export type ViewState = 'map' | 'mission_01' | 'mission_05' | 'mission_17';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('map');

  const renderView = () => {
    switch (currentView) {
      case 'map':
        return <CampaignMap onSelectMission={setCurrentView} />;
      case 'mission_01':
        return <Mission01 onBack={() => setCurrentView('map')} />;
      case 'mission_05':
        return <Mission05 onBack={() => setCurrentView('map')} />;
      case 'mission_17':
        return <Mission17 onBack={() => setCurrentView('map')} />;
      default:
        return <CampaignMap onSelectMission={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-engineering-dark text-slate-200 flex flex-col font-sans">
      <header className="bg-engineering-base border-b border-engineering-light p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <CircuitBoard className="text-engineering-accent w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight text-white">CE Fundamentals</h1>
        </div>
        <nav className="flex gap-4">
          <button 
            onClick={() => setCurrentView('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentView === 'map' ? 'bg-engineering-light text-white' : 'text-slate-400 hover:text-white hover:bg-engineering-light/50'}`}
          >
            <Map className="w-4 h-4" />
            Campaign Map
          </button>
        </nav>
      </header>
      
      <main className="flex-1 overflow-auto relative">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
