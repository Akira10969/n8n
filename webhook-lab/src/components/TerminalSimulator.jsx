import React, { useState, useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, XCircle, ChevronRight, Play } from 'lucide-react';
import './TerminalSimulator.css';

export default function TerminalSimulator({ simulatorData, onSuccess, onFail }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'Business Cloud OS Terminal v2.4.1 initialized.' },
    { type: 'system', text: 'Establishing secure connection... DONE.' },
    { type: 'system', text: 'Type commands to execute operations.' }
  ]);
  const [input, setInput] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const tasks = simulatorData.tasks || [];
  const currentTask = tasks[currentTaskIndex];

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input on click anywhere in terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim() || isCompleted) return;

    const cmd = input.trim();
    const newHistory = [...history, { type: 'input', text: `admin@mei-cloud:~$ ${cmd}` }];
    
    // Check against current task
    if (currentTask) {
      // Basic validation: check if the typed command matches expected command
      // In a real app, this could use regex. For now, we do lowercase exact/includes match.
      const isMatch = currentTask.command instanceof RegExp 
        ? currentTask.command.test(cmd)
        : cmd.toLowerCase() === currentTask.command.toLowerCase();

      if (isMatch) {
        newHistory.push({ type: 'success', text: currentTask.successMessage });
        setHistory(newHistory);
        setInput('');
        
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex(prev => prev + 1);
        } else {
          setIsCompleted(true);
          newHistory.push({ type: 'system', text: 'SEQUENCE COMPLETE. ALL TASKS RESOLVED.' });
        }
      } else {
        // Built-in basic commands for immersion
        if (cmd === 'clear') {
          setHistory([]);
        } else if (cmd === 'ls') {
          newHistory.push({ type: 'output', text: 'config.json  logs/  server.js  webhook-receiver.js' });
          setHistory(newHistory);
        } else if (cmd === 'help') {
          newHistory.push({ type: 'output', text: 'Available commands: clear, ls, help, curl, ping, grep, systemctl, mei-cli' });
          setHistory(newHistory);
        } else {
          // Task failure message
          newHistory.push({ type: 'error', text: currentTask.errorMessage || `Command failed or unrecognized: ${cmd}` });
          setHistory(newHistory);
          if (onFail) onFail();
        }
        setInput('');
      }
    }
  };

  return (
    <div className="term-sim-wrapper">
      {/* HUD HEADER */}
      <div className="term-hud-header">
        <div className="term-hud-title">
          <Terminal size={18} />
          <span>Business Cloud OS // LIVE TERMINAL</span>
        </div>
        <div className="term-hud-task-count">
          TASK {currentTaskIndex + 1} OF {tasks.length}
        </div>
      </div>

      {/* TASK PANEL */}
      <div className="term-task-panel">
        <div className="term-task-label">CURRENT OBJECTIVE</div>
        <p className="term-task-instruction">{currentTask?.instruction}</p>
      </div>

      {/* TERMINAL WINDOW */}
      <div className="term-window" onClick={handleTerminalClick}>
        <div className="term-output">
          {history.map((line, i) => (
            <div key={i} className={`term-line term-${line.type}`}>
              {line.type === 'success' && <CheckCircle2 size={14} className="term-icon-success" />}
              {line.type === 'error' && <XCircle size={14} className="term-icon-error" />}
              <span>{line.text}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        {!isCompleted && (
          <form className="term-input-line" onSubmit={handleCommand}>
            <span className="term-prompt">admin@mei-cloud:~$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="term-input"
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </form>
        )}
      </div>

      {/* SUCCESS BANNER */}
      {isCompleted && (
        <div className="term-success-banner animate-fade-in">
          <div className="term-success-content">
            <CheckCircle2 size={24} color="#22c55e" />
            <span>INCIDENT RESOLVED</span>
          </div>
          <button className="term-btn-continue" onClick={onSuccess}>
            CONTINUE MISSION <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
