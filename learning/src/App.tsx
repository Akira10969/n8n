import { useState } from 'react';
import { curriculum } from './data/curriculum';
import { Electricity } from './pages/Electricity';
import { OhmsLaw } from './pages/OhmsLaw';
import { Breadboard } from './pages/Breadboard';
import { LogicGates } from './pages/LogicGates';
import { ConductorsInsulators } from './pages/ConductorsInsulators';
import { DCvsAC } from './pages/DCvsAC';
import { SeriesParallelSimulator } from './pages/SeriesParallelSimulator';
import { ElectricCharge } from './pages/ElectricCharge';
import { PowerEnergySimulator } from './pages/PowerEnergySimulator';
import { VoltageCurrentResistance } from './pages/VoltageCurrentResistance';
import { GroundReference } from './pages/GroundReference';
import { UnitsPrefixes } from './pages/UnitsPrefixes';
import { CircuitSafety } from './pages/CircuitSafety';
import { WhatIsACircuit } from './pages/WhatIsACircuit';
import { PlaceholderTopic } from './pages/PlaceholderTopic';
import { CircuitBoard, Book, ChevronRight, Menu, X } from 'lucide-react';

function App() {
  const [currentTopicId, setCurrentTopicId] = useState<string>('what-is-electricity');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Find current topic and category
  let currentTopicTitle = '';
  let currentCategoryTitle = '';
  
  for (const cat of curriculum) {
    const found = cat.topics.find(t => t.id === currentTopicId);
    if (found) {
      currentTopicTitle = found.title;
      currentCategoryTitle = cat.title;
      break;
    }
  }

  const renderView = () => {
    switch (currentTopicId) {
      case 'what-is-electricity':
        return <Electricity />;
      case 'electric-charge':
      case 'electrons':
        return <ElectricCharge />;
      case 'voltage':
      case 'current':
      case 'resistance':
        return <VoltageCurrentResistance />;
      case 'ground-reference':
        return <GroundReference />;
      case 'conductors-insulators':
        return <ConductorsInsulators />;
      case 'dc-vs-ac':
        return <DCvsAC />;
      case 'units-prefixes':
        return <UnitsPrefixes />;
      case 'ohms-law':
        return <OhmsLaw />;
      case 'electrical-power':
      case 'electrical-energy':
      case 'power-formulas':
        return <PowerEnergySimulator />;
      case 'circuit-safety':
        return <CircuitSafety />;
      case 'what-is-circuit':
        return <WhatIsACircuit />;
      case 'series-circuits':
      case 'parallel-circuits':
      case 'equivalent-resistance':
        return <SeriesParallelSimulator />;
      case 'what-is-breadboard':
        return <Breadboard />;
      case 'and-gate':
        return <LogicGates />;
      default:
        return <PlaceholderTopic categoryTitle={currentCategoryTitle} topicTitle={currentTopicTitle} topicId={currentTopicId} />;
    }
  };

  const navItemClass = (id: string) => `
    w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left
    ${currentTopicId === id ? 'bg-engineering-accent text-white font-medium' : 'text-slate-400 hover:bg-engineering-light hover:text-white'}
  `;

  return (
    <div className="min-h-screen bg-engineering-dark text-slate-200 flex font-sans overflow-hidden">
      
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-engineering-base border border-engineering-light rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed md:relative md:translate-x-0 z-40
        w-80 h-screen bg-engineering-base border-r border-engineering-light flex flex-col shrink-0 transition-transform duration-300
      `}>
        <div className="p-6 border-b border-engineering-light flex items-center gap-3 bg-engineering-base shrink-0">
          <CircuitBoard className="text-engineering-accent w-8 h-8 shrink-0" />
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Computer Engineering<br/>Learning Platform</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-engineering-light scrollbar-track-transparent">
          {curriculum.map((category) => (
            <div key={category.id}>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-engineering-accent" /> {category.title}
              </h3>
              <ul className="space-y-1">
                {category.topics.map((topic) => (
                  <li key={topic.id}>
                    <button 
                      onClick={() => {
                        setCurrentTopicId(topic.id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }} 
                      className={navItemClass(topic.id)}
                    >
                      <span className="truncate pr-2">{topic.title.replace(/^\d+\.\s/, '')}</span>
                      {currentTopicId === topic.id && <ChevronRight className="w-4 h-4 opacity-75 shrink-0" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-engineering-dark">
        {/* Spacer for mobile menu button */}
        <div className="md:hidden h-16 w-full bg-engineering-base border-b border-engineering-light"></div>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
