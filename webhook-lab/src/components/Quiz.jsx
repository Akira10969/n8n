import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function Quiz({ quizData, onSuccess, onFail }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset quiz state when quizData changes (user moves to a new level)
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [quizData]);

  if (!quizData) return null;

  const isCorrect = selectedOption === quizData.correctAnswerIndex;

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
      if (selectedOption === quizData.correctAnswerIndex) {
        if (onSuccess) onSuccess();
      } else {
        if (onFail) onFail();
      }
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2.5rem' }}>
      <div className="section-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
        <div className="icon-wrapper" style={{ color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)' }}>
          <HelpCircle size={20} />
        </div>
        <h2>Knowledge Check</h2>
      </div>

      <div className="quiz-question" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 500 }}>
        {quizData.question}
      </div>

      <div className="quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {quizData.options.map((option, index) => {
          let optionClass = 'quiz-option';
          
          if (isSubmitted) {
            if (index === quizData.correctAnswerIndex) {
              optionClass += ' correct';
            } else if (index === selectedOption) {
              optionClass += ' incorrect';
            } else {
              optionClass += ' disabled';
            }
          } else if (selectedOption === index) {
            optionClass += ' selected';
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => !isSubmitted && setSelectedOption(index)}
              disabled={isSubmitted}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text-main)',
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                {isSubmitted && index === quizData.correctAnswerIndex && <CheckCircle2 size={18} color="var(--accent-green)" />}
                {isSubmitted && index === selectedOption && index !== quizData.correctAnswerIndex && <XCircle size={18} color="var(--accent-red)" />}
                {!isSubmitted && selectedOption === index && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></div>}
              </div>
              <span style={{ lineHeight: 1.4 }}>{option}</span>
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={selectedOption === null}
        >
          Check Answer
        </button>
      ) : (
        <div className="quiz-feedback animate-fade-in" style={{
          padding: '1.25rem',
          borderRadius: '8px',
          background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
          <p style={{ margin: 0, color: 'var(--text-main)' }}>{quizData.explanation}</p>
        </div>
      )}
    </div>
  );
}
