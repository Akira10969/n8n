import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronRight, ChevronLeft, Menu, X, BookOpen, CheckCircle2, Lock } from 'lucide-react';

import { curriculum } from './data/curriculum';
import VisualWorkflow from './components/VisualWorkflow';
import HandsOnLab from './components/HandsOnLab';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(curriculum.length);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentStep = curriculum[currentIndex];

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
            {currentStep.quiz && <Quiz quizData={currentStep.quiz} />}
            
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
