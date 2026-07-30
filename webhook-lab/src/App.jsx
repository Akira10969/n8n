import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronLeft, Menu, X, BookOpen, CheckCircle2, Lock, Heart, Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

import { curriculum } from './data/curriculum';
import VisualWorkflow from './components/VisualWorkflow';
import HandsOnLab from './components/HandsOnLab';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(localStorage.getItem('webhook_current_index') || '0', 10));
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(() => parseInt(localStorage.getItem('webhook_highest_index') || '0', 10));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('webhook_xp') || '0', 10));
  const [hearts, setHearts] = useState(() => parseInt(localStorage.getItem('webhook_hearts') || '3', 10));
  const [quizKey, setQuizKey] = useState(0);

  const currentStep = curriculum[currentIndex];

  useEffect(() => {
    localStorage.setItem('webhook_current_index', currentIndex);
    localStorage.setItem('webhook_highest_index', highestUnlockedIndex);
    localStorage.setItem('webhook_xp', xp);
    localStorage.setItem('webhook_hearts', hearts);
  }, [currentIndex, highestUnlockedIndex, xp, hearts]);

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
      setXp(prev => prev + 50);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#10b981']
      });
      if (currentIndex < curriculum.length - 1) {
        setHighestUnlockedIndex(currentIndex + 1);
      }
    }
  };

  const handleQuizFail = () => {
    if (hearts > 1) {
      setHearts(prev => prev - 1);
    } else {
      alert("💔 Mission Failed! You lost all your hearts. Restarting mission...");
      setHearts(3);
      setQuizKey(prev => prev + 1);
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
    setSidebarOpen(false);
  };

  // Progress percentage
  const progress = ((currentIndex + 1) / curriculum.length) * 100;

  return (
    <div className="learning-module">
      {/* HEADER WITH PROGRESS BAR */}
      <header className="module-header">
        <div className="header-content">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1>Webhook Learning Roadmap</h1>
          <div className="gamification-stats" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginLeft: 'auto', marginRight: '2rem' }}>
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

      <div className="module-layout">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Course Content</h3>
          </div>
          <ul className="sidebar-menu">
            {curriculum.map((step, index) => {
              const isCompleted = index < highestUnlockedIndex;
              const isActive = index === currentIndex;
              const isLocked = index > highestUnlockedIndex;
              
              return (
                <li key={step.id} className={`${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}>
                  <button 
                    onClick={() => selectStep(index)}
                    disabled={isLocked}
                    style={{ opacity: isLocked ? 0.5 : 1, cursor: isLocked ? 'not-allowed' : 'pointer' }}
                  >
                    <span className="step-icon">
                      {isLocked ? (
                        <Lock size={16} color="var(--text-muted)" />
                      ) : isCompleted && !isActive ? (
                        <CheckCircle2 size={16} color="var(--accent-green)" />
                      ) : isActive ? (
                        <BookOpen size={16} color="var(--accent-cyan)" />
                      ) : (
                        <div className="circle-placeholder"></div>
                      )}
                    </span>
                    <span className="step-title">{step.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* OVERLAY FOR MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="main-content-area">
          <div className="content-card glass-panel animate-fade-in" key={currentStep.id}>
            
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
        </main>
      </div>
    </div>
  );
}

export default App;
