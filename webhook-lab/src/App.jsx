import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronLeft, Menu, X, BookOpen, CheckCircle2, Lock, Heart, Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

import { curriculum } from './data/curriculum';
import VisualWorkflow from './components/VisualWorkflow';
import HandsOnLab from './components/HandsOnLab';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import MissionMap from './components/MissionMap';
import MissionBriefing from './components/MissionBriefing';
import RewardScreen from './components/RewardScreen';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(localStorage.getItem('webhook_current_index') || '0', 10));
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(() => parseInt(localStorage.getItem('webhook_highest_index') || '0', 10));
  const [absoluteHighestIndex, setAbsoluteHighestIndex] = useState(() => parseInt(localStorage.getItem('webhook_absolute_highest_index') || '0', 10));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('webhook_xp') || '0', 10));
  const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('webhook_hearts') || '3', 10));
  const [quizKey, setQuizKey] = useState(0);
  const [currentView, setCurrentView] = useState('map'); // 'map', 'learning', 'dashboard'
  const [missionState, setMissionState] = useState('briefing'); // 'briefing', 'content', 'reward'

  const currentStep = curriculum[currentIndex];

  useEffect(() => {
    localStorage.setItem('webhook_current_index', currentIndex);
    localStorage.setItem('webhook_highest_index', highestUnlockedIndex);
    localStorage.setItem('webhook_absolute_highest_index', absoluteHighestIndex);
    localStorage.setItem('webhook_xp', xp);
    localStorage.setItem('webhook_hearts', hearts);
  }, [currentIndex, highestUnlockedIndex, absoluteHighestIndex, xp, hearts]);

  const getRank = (currentXp) => {
    if (currentXp < 500) return 'IT Intern';
    if (currentXp < 1000) return 'IT Support';
    if (currentXp < 1500) return 'Help Desk Engineer';
    if (currentXp < 2000) return 'Jr. SysAdmin';
    if (currentXp < 2500) return 'SysAdmin';
    if (currentXp < 3000) return 'Infrastructure Eng.';
    if (currentXp < 3500) return 'Platform Eng.';
    if (currentXp < 4000) return 'DevOps Eng.';
    if (currentXp < 4500) return 'Cloud Eng.';
    return 'Solutions Architect';
  };

  const handleQuizSuccess = () => {
    if (highestUnlockedIndex === currentIndex) {
      if (currentIndex >= absoluteHighestIndex) {
        const earnedXp = currentStep.briefing?.rewards?.xp || 50;
        setXp(prev => prev + earnedXp);
        setAbsoluteHighestIndex(currentIndex + 1);
      }
      if (currentIndex < curriculum.length - 1) {
        setHighestUnlockedIndex(currentIndex + 1);
      }
    }
    setMissionState('reward');
  };

  const handleQuizFail = () => {
    if (hearts > 1) {
      setHearts(prev => prev - 1);
    } else {
      alert("💔 Game Over! You lost all your hearts. Returning to Mission 1 to rebuild your progress!");
      setHearts(3);
      setCurrentIndex(0);
      setHighestUnlockedIndex(0);
      setQuizKey(prev => prev + 1);
      setMissionState('briefing');
      setCurrentView('map');
    }
  };


  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < curriculum.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (nextIndex > highestUnlockedIndex) {
        setHighestUnlockedIndex(nextIndex);
      }
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const selectStep = (index) => {
    setCurrentIndex(index);
    setMissionState('briefing');
    setCurrentView('learning');
  };

  // Progress percentage
  const progress = ((currentIndex + 1) / curriculum.length) * 100;

  return (
    <div className="learning-module">
      {/* HEADER WITH PROGRESS BAR */}
      <header className="module-header">
        <div className="header-content">
          <h1>Webhook Learning Roadmap</h1>
          <div className="gamification-stats" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginLeft: 'auto', marginRight: '2rem' }}>
            <button 
              onClick={() => setCurrentView('map')}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }}>
              Mission Map
            </button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{ background: 'var(--accent-cyan)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#000', cursor: 'pointer', fontWeight: 'bold', marginRight: '1rem' }}>
              Player Profile
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>
              <Heart fill="currentColor" size={20} /> {hearts}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
              <Star fill="currentColor" size={20} /> {xp} XP
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
              <Trophy size={20} /> <span style={{ fontSize: '0.9rem' }}>{getRank(xp)}</span>
            </div>
          </div>
          <div className="progress-text">{currentIndex + 1} of {curriculum.length}</div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </header>

      {currentView === 'dashboard' && (
        <Dashboard 
          xp={xp} 
          hearts={hearts} 
          rank={getRank(xp)} 
          absoluteHighestIndex={absoluteHighestIndex} 
          totalMissions={curriculum.length} 
        />
      )}

      {currentView === 'map' && (
        <MissionMap 
          curriculum={curriculum}
          highestUnlockedIndex={highestUnlockedIndex}
          activeMissionIndex={null}
          onSelectMission={selectStep}
        />
      )}

      {currentView === 'learning' && (
      <div className="module-layout" style={{ display: 'flex', gap: '2rem', padding: '0 2rem', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR MISSION MAP */}
        <aside style={{ width: '35%', height: 'calc(100vh - 120px)', position: 'sticky', top: '100px', overflowY: 'auto', paddingRight: '1rem' }}>
          <MissionMap 
            curriculum={curriculum}
            highestUnlockedIndex={highestUnlockedIndex}
            activeMissionIndex={currentIndex}
            onSelectMission={selectStep}
          />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content-area" style={{ width: '65%', maxWidth: 'none' }}>
          
          {missionState === 'briefing' && (
            <MissionBriefing 
              mission={currentStep} 
              missionIndex={currentIndex} 
              onStartMission={() => setMissionState('content')} 
            />
          )}

          {missionState === 'reward' && (
            <RewardScreen 
              xpGained={currentIndex === absoluteHighestIndex - 1 ? (currentStep.briefing?.rewards?.xp || 50) : 0}
              newRank={getRank(xp)}
              newAbsoluteIndex={absoluteHighestIndex}
              unlockedBadgeId={currentStep.briefing?.rewards?.badge && currentStep.briefing?.rewards?.badge !== 'None' ? currentStep.briefing.rewards.badge : null}
              onContinue={() => {
                goToNext();
                setCurrentView('map');
              }}
            />
          )}

          {missionState === 'content' && (
            <div className="content-card glass-panel animate-fade-in" key={currentStep.id}>
              
              <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Mission {currentIndex + 1}
                </div>
                <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: 'var(--text-main)' }}>
                  {currentStep.title}
                </h2>
              </div>

              {/* MARKDOWN CONTENT */}
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentStep.content}
                </ReactMarkdown>
              </div>

              {/* DYNAMIC COMPONENTS BASED ON STEP TYPE */}
              {currentStep.type === 'visual-flow' && <VisualWorkflow />}
              {currentStep.type === 'lab' && <HandsOnLab />}
              {currentStep.quiz && (
                <Quiz 
                  key={`${currentStep.id}-${quizKey}`}
                  quizData={currentStep.quiz} 
                  onSuccess={handleQuizSuccess}
                  onFail={handleQuizFail}
                />
              )}
              
            </div>
            
            {/* NAVIGATION BUTTONS */}
            <div className="navigation-footer">
              <button 
                className="btn btn-secondary" 
                onClick={goToPrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <button 
                className="btn btn-primary" 
                onClick={goToNext}
                disabled={currentIndex === curriculum.length - 1}
              >
                {currentIndex === curriculum.length - 2 ? 'Finish Course' : 'Next Lesson'}
                <ChevronRight size={20} />
              </button>
            </div>
          )}

        </main>
      </div>
      )}
    </div>
  );
}

export default App;
