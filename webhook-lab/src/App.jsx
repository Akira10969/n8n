import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronLeft, Heart, Trophy, Star } from 'lucide-react';

import { curriculum } from './data/curriculum';
import { badges, toolbox } from './data/achievements';
import VisualWorkflow from './components/VisualWorkflow';
import HandsOnLab from './components/HandsOnLab';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import MissionMap from './components/MissionMap';
import MissionBriefing from './components/MissionBriefing';
import MissionDebrief from './components/MissionDebrief';
import TerminalSimulator from './components/TerminalSimulator';
import BootSequence from './components/BootSequence';
import EpisodeCard from './components/EpisodeCard';
import TheVoidReveal from './components/TheVoidReveal';
import GameEnding from './components/GameEnding';
import AdminDashboard from './components/AdminDashboard';
import SettingsModal from './components/SettingsModal';
import { updateAudioSettings, setMusicPhase } from './utils/audioUtils';
import { registerPlayer, syncProgress, sendHeartbeat, getAuthTokens, logEvent } from './api';
import './App.css';
import './game.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(localStorage.getItem('webhook_current_index') || '0', 10));
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(() => parseInt(localStorage.getItem('webhook_highest_index') || '0', 10));
  const [absoluteHighestIndex, setAbsoluteHighestIndex] = useState(() => parseInt(localStorage.getItem('webhook_absolute_highest_index') || '0', 10));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('webhook_xp') || '0', 10));
  const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('webhook_hearts') || '3', 10));
  const [quizKey, setQuizKey] = useState(0);
  const [currentView, setCurrentView] = useState('map'); // 'map', 'learning', 'dashboard'
  const [missionState, setMissionState] = useState('episode-card'); // 'episode-card', 'briefing', 'content', 'reward'
  const [hasBooted] = useState(() => sessionStorage.getItem('webhook_has_booted') === 'true');
  const [hasStarted, setHasStarted] = useState(false); // Always false on hard load to ensure audio interaction
  const [hasSeenMapIntro, setHasSeenMapIntro] = useState(() => sessionStorage.getItem('webhook_has_seen_map_intro') === 'true');
  const [hasSeenMapCorruption, setHasSeenMapCorruption] = useState(() => localStorage.getItem('webhook_has_seen_map_corruption') === 'true');
  const [hasSeenVoidReveal, setHasSeenVoidReveal] = useState(() => localStorage.getItem('webhook_has_seen_void_reveal') === 'true');
  const [hasCompletedGame, setHasCompletedGame] = useState(() => localStorage.getItem('webhook_has_completed_game') === 'true');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('webhook_settings') || '{"voiceEnabled":true, "musicVolume":0.5, "sfxVolume":0.5, "autoPlayBriefings":true, "reduceMotion":false}'));
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isOffline, setIsOffline] = useState(() => localStorage.getItem('webhook_engineer_id')?.startsWith('OFFLINE-') || false);

  // Sync initial settings to audioUtils
  useEffect(() => {
    updateAudioSettings(settings);
  }, [settings]);

  // Handle global background music state
  useEffect(() => {
    if (!hasStarted) return;
    
    if (!hasBooted) {
      setMusicPhase('VOID');
    } else if (currentView === 'map') {
      setMusicPhase('MAP');
    } else if (currentView === 'learning') {
      if (missionState === 'episode-card') {
        setMusicPhase('MAP');
      } else if (missionState === 'content') {
        if (currentIndex >= 24) {
          setMusicPhase('CRITICAL');
        } else {
          setMusicPhase('GAMEPLAY');
        }
      } else if (missionState === 'reward') {
        setMusicPhase('DEBRIEF');
      } else if (missionState === 'game-ending') {
        setMusicPhase('DEBRIEF');
      }
    }
  }, [hasStarted, hasBooted, currentView, missionState, currentIndex]);

  const currentStep = curriculum[currentIndex];

  // 1. Initialize Player Identity
  useEffect(() => {
    const initPlayer = async () => {
      const auth = getAuthTokens();
      if (!auth.engineer_id) {
        const data = await registerPlayer();
        if (!data) {
          // Generate temporary offline ID if backend fails
          const offlineId = 'OFFLINE-' + Math.random().toString(36).substr(2, 6).toUpperCase();
          localStorage.setItem('webhook_engineer_id', offlineId);
          setIsOffline(true);
          console.warn(`[APP] Backend unavailable. Running in Offline Mode with temporary ID: ${offlineId}`);
        } else {
          setIsOffline(false);
        }
      } else if (auth.engineer_id.startsWith('OFFLINE-')) {
        setIsOffline(true);
      }
    };
    initPlayer();
  }, []);

  // 2. Heartbeat (Every 30s)
  useEffect(() => {
    sendHeartbeat(); // Fire immediately on mount
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. Debounced Autosave for Progress Sync
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const unlockedAchievements = [
        ...badges.filter(b => absoluteHighestIndex > b.unlockIndex).map(b => b.id),
        ...toolbox.filter(t => absoluteHighestIndex > t.unlockIndex).map(t => t.id)
      ];

      // Create an array of completed missions up to absoluteHighestIndex
      const completedMissions = Array.from({ length: absoluteHighestIndex }, (_, i) => i);

      syncProgress({
        highestUnlockedIndex,
        xp,
        rank: getRank(xp),
        hearts,
        hasCompletedGame,
        achievements: unlockedAchievements,
        completedMissions
      });
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [highestUnlockedIndex, absoluteHighestIndex, xp, hearts, hasCompletedGame]);

  useEffect(() => {
    localStorage.setItem('webhook_current_index', currentIndex);
    localStorage.setItem('webhook_highest_index', highestUnlockedIndex);
    localStorage.setItem('webhook_absolute_highest_index', absoluteHighestIndex);
    localStorage.setItem('webhook_xp', xp);
    localStorage.setItem('webhook_hearts', hearts);
    localStorage.setItem('webhook_has_seen_map_corruption', hasSeenMapCorruption);
    localStorage.setItem('webhook_has_seen_void_reveal', hasSeenVoidReveal);
    localStorage.setItem('webhook_has_completed_game', hasCompletedGame);
    sessionStorage.setItem('webhook_has_booted', hasBooted);
    sessionStorage.setItem('webhook_has_seen_map_intro', hasSeenMapIntro);
    localStorage.setItem('webhook_settings', JSON.stringify(settings));
  }, [currentIndex, highestUnlockedIndex, absoluteHighestIndex, xp, hearts, hasBooted, hasSeenMapIntro, hasSeenMapCorruption, hasSeenVoidReveal, hasCompletedGame, settings]);

  // Derive Global World State
  let worldState = 'NORMAL';
  if (hasCompletedGame) {
    worldState = 'RESTORED';
  } else if (highestUnlockedIndex >= 10 && hasSeenMapCorruption) {
    worldState = 'RECOVERING';
  } else if (highestUnlockedIndex >= 5 && hasSeenMapCorruption) {
    worldState = 'CORRUPTED';
  } else if (highestUnlockedIndex >= 5 && !hasSeenMapCorruption) {
    worldState = 'UNDER_ATTACK';
  }

  // Check if we need to apply corrupted mode
  useEffect(() => {
    if (currentIndex >= 24 && hasSeenVoidReveal && !hasCompletedGame) {
      document.body.classList.add('corrupted-mode');
    } else {
      document.body.classList.remove('corrupted-mode');
    }
  }, [currentIndex, hasSeenVoidReveal, hasCompletedGame]);

  // Developer Cheat Code: Unlock everything (Ctrl+Shift+U)
  useEffect(() => {
    if (import.meta.env.PROD) return; // Only active in dev mode
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        console.warn('[DEV] CHEAT ACTIVATED: Unlocking all missions and features...');
        setHighestUnlockedIndex(curriculum.length - 1);
        setAbsoluteHighestIndex(curriculum.length - 1);
        setXp(5000); // Give max rank
        setHearts(99); // Infinite hearts
      } else if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        console.warn('[DEV] DB WIPE ACTIVATED: Resetting all local progress...');
        localStorage.clear();
        window.location.reload();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    logEvent('mission_complete', currentIndex);
    // Award XP if this is a new mission completion
    if (currentIndex >= absoluteHighestIndex) {
      const earnedXp = currentStep.briefing?.rewards?.xp || 50;
      setXp(prev => prev + earnedXp);
      setAbsoluteHighestIndex(currentIndex + 1);
    }
    
    // Unlock next node on the map if they are at the frontier
    if (currentIndex === highestUnlockedIndex && currentIndex < curriculum.length - 1) {
      setHighestUnlockedIndex(currentIndex + 1);
    }
    
    setMissionState('reward');
  };

  const handleQuizFail = () => {
    logEvent('mission_fail', currentIndex);
    setFailedAttempts(prev => prev + 1);
    if (hearts > 1) {
      setHearts(prev => prev - 1);
    } else {
      alert("💔 Game Over! You lost all your hearts. Returning to Mission 1 to rebuild your progress!");
      setHearts(3);
      setCurrentIndex(0);
      setHighestUnlockedIndex(0);
      setQuizKey(prev => prev + 1);
      setMissionState('episode-card');
      setCurrentView('map');
      setFailedAttempts(0);
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
    setMissionState('episode-card');
    setCurrentView('learning');
    setFailedAttempts(0);
    logEvent('mission_start', index);
  };

  // Progress percentage
  const progress = ((currentIndex + 1) / curriculum.length) * 100;

  return (
    <>
      {!hasStarted ? (
        <div 
          onClick={() => setHasStarted(true)} 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            background: '#050505', color: '#22c55e', fontFamily: 'monospace', 
            cursor: 'pointer', zIndex: 99999 
          }}
        >
          <p style={{ fontSize: '1.2rem' }}>
            [ CLICK TO INITIATE CONNECTION ] <span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
          </p>
        </div>
      ) : !hasBooted ? (
        <BootSequence highestUnlockedIndex={highestUnlockedIndex} onBootComplete={handleBootComplete} isOffline={isOffline} />
      ) : currentIndex >= 24 && !hasSeenVoidReveal ? (
        <TheVoidReveal onRevealComplete={() => {
          setHasSeenVoidReveal(true);
          setCurrentView('learning');
          setMissionState('episode-card');
        }} />
      ) : (
        <>
    <div className="particle-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDuration: `${Math.random() * 10 + 5}s`,
          animationDelay: `${Math.random() * 5}s`
        }}></div>
      ))}
    </div>
    <div className="learning-module crt">
      {/* HEADER WITH PROGRESS BAR */}
      <header className="module-header">
        <div className="header-content">
          <h1 
            style={{ fontFamily: 'monospace', letterSpacing: '0.08em', fontSize: '0.95rem', textTransform: 'uppercase', flex: 1 }}
          >
            Business Cloud OS <span style={{ color: 'var(--text-muted)' }}>//</span> Mission Control
          </h1>
          <div className="gamification-stats" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: 'auto' }}>
            <button 
              onClick={() => setCurrentView('map')}
              style={{ 
                background: currentView === 'map' ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)', 
                border: currentView === 'map' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)', 
                padding: '0.35rem 0.9rem', color: currentView === 'map' ? 'var(--accent-cyan)' : 'var(--text-muted)', 
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.06em'
              }}>MAP</button>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{ 
                background: currentView === 'dashboard' ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', 
                border: currentView === 'dashboard' ? '1px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.1)', 
                padding: '0.35rem 0.9rem', color: currentView === 'dashboard' ? 'var(--accent-purple)' : 'var(--text-muted)', 
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.06em'
              }}>PROFILE</button>
            <button 
              onClick={() => setShowSettings(true)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                padding: '0.35rem 0.9rem', color: 'var(--text-muted)', 
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.06em'
              }}>SETTINGS</button>
            <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 0.25rem' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-red)', fontWeight: 'bold', fontSize: '0.85rem' }}>
              <Heart fill="currentColor" size={16} /> {hearts}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '0.85rem' }}>
              <Star fill="currentColor" size={16} /> {xp} XP
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-purple)', fontWeight: 'bold', fontSize: '0.85rem' }}>
              <Trophy size={16} /> <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{getRank(xp)}</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 0.25rem' }}></div>
            <div className="progress-text" style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{currentIndex + 1}/{curriculum.length}</div>
          </div>
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
          hasCompletedGame={hasCompletedGame}
          onOpenAdmin={() => setCurrentView('admin')}
        />
      )}

      {currentView === 'admin' && (
        <AdminDashboard onBack={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'map' && (
        <div style={{ position: 'relative', width: '100%' }}>
          <MissionMap 
            curriculum={curriculum}
            highestUnlockedIndex={highestUnlockedIndex}
            activeMissionIndex={null}
            onSelectMission={(idx) => {
              playUIBeep();
              setCurrentIndex(idx);
              setMissionState('episode-card');
              setCurrentView('learning');
            }}
            skipIntro={hasSeenMapIntro}
            onIntroComplete={() => setHasSeenMapIntro(true)}
            hasCompletedGame={hasCompletedGame}
            worldState={worldState}
            onCorruptionCinematicComplete={() => setHasSeenMapCorruption(true)}
          />
        </div>
      )}

      {showSettings && (
        <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />
      )}

      {currentView === 'learning' && (
      <div className="module-layout" style={{ display: 'flex', gap: '2rem', padding: '0 2rem', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR MISSION MAP */}
        <aside style={{ width: '38%', height: 'calc(100vh - 120px)', position: 'sticky', top: '100px', overflowY: 'auto', borderRight: '1px solid var(--glass-border)' }}>
          <MissionMap 
            curriculum={curriculum}
            highestUnlockedIndex={highestUnlockedIndex}
            activeMissionIndex={currentIndex}
            onSelectMission={selectStep}
            skipIntro={true}
            worldState={worldState}
            onCorruptionCinematicComplete={() => setHasSeenMapCorruption(true)}
          />
        </aside>
      {/* MAIN CONTENT AREA */}
        <main className="main-content-area" style={{ width: '65%', maxWidth: 'none' }}>
          
          <div className="content-container slide-up">
            {currentView === 'learning' && missionState === 'episode-card' && (
              <EpisodeCard 
                mission={currentStep} 
                missionIndex={currentIndex} 
                onComplete={() => setMissionState('briefing')} 
              />
            )}
            
            {currentView === 'learning' && missionState === 'briefing' && (
              <MissionBriefing 
                mission={currentStep} 
                missionIndex={currentIndex} 
                onStartMission={() => setMissionState('content')} 
              />
            )}

            {missionState === 'reward' && (
              <MissionDebrief 
                missionIndex={currentIndex}
                xpGained={currentStep.briefing?.rewards?.xp || 50} 
                newRank={getRank(xp)}
                newAbsoluteIndex={absoluteHighestIndex}
                unlockedBadgeId={
                  badges.find(b => b.unlockIndex === currentIndex)?.id
                }
                failedAttempts={failedAttempts}
                onContinue={() => {
                  setFailedAttempts(0);
                  if (currentIndex === curriculum.length - 1 && !hasCompletedGame) {
                    setMissionState('game-ending');
                  } else {
                    if (currentIndex >= 30) setHasCompletedGame(true);
                    setCurrentView('map');
                    setMissionState('episode-card');
                  }
                }}
              />
            )}

            {missionState === 'game-ending' && (
              <GameEnding 
                xp={xp}
                onEndingComplete={() => {
                  setHasCompletedGame(true);
                  setMissionState('episode-card');
                  setCurrentView('map');
                }} 
              />
            )}
          </div>

          {missionState === 'content' && (
            <>
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
              {currentStep.simulator && (
                <TerminalSimulator 
                  key={`${currentStep.id}-sim`}
                  simulatorData={currentStep.simulator}
                  onSuccess={handleQuizSuccess}
                  onFail={handleQuizFail}
                />
              )}
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
            </>
          )}

        </main>
      </div>
      )}
    </div>
        </>
      )}
    </>
  );
}

export default App;
