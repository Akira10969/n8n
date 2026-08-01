import React from 'react';
import { X, Volume2, Mic, Settings, Play, EyeOff } from 'lucide-react';
import './SettingsModal.css';
import { updateAudioSettings, playUIBeep } from '../utils/audioUtils';

export default function SettingsModal({ settings, setSettings, onClose }) {
  
  const handleToggle = (key) => {
    const newVal = !settings[key];
    const newSettings = { ...settings, [key]: newVal };
    setSettings(newSettings);
    
    // Sync to audioUtils immediately
    if (key === 'voiceEnabled') updateAudioSettings({ voiceEnabled: newVal });
    if (key === 'sfxVolume') updateAudioSettings({ sfxVolume: newVal ? 0.5 : 0 }); // toggle for simplicity if it was a boolean, but it's a slider usually.
    
    playUIBeep();
  };

  const handleSlider = (key, val) => {
    const newSettings = { ...settings, [key]: parseFloat(val) };
    setSettings(newSettings);
    
    if (key === 'musicVolume') updateAudioSettings({ musicVolume: parseFloat(val) });
    if (key === 'sfxVolume') updateAudioSettings({ sfxVolume: parseFloat(val) });
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <Settings size={20} />
          <h2>SYSTEM PREFERENCES</h2>
          <button className="settings-close" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="settings-body">
          
          <div className="settings-group">
            <h3>AUDIO</h3>
            <div className="settings-row">
              <label><Volume2 size={16}/> Music Volume</label>
              <input type="range" min="0" max="1" step="0.1" value={settings.musicVolume} onChange={(e) => handleSlider('musicVolume', e.target.value)} />
            </div>
            <div className="settings-row">
              <label><Mic size={16}/> SFX Volume</label>
              <input type="range" min="0" max="1" step="0.1" value={settings.sfxVolume} onChange={(e) => handleSlider('sfxVolume', e.target.value)} />
            </div>
            <div className="settings-row">
              <label><Mic size={16}/> Voice Narration</label>
              <div className={`toggle-switch ${settings.voiceEnabled ? 'active' : ''}`} onClick={() => handleToggle('voiceEnabled')}>
                <div className="toggle-knob"></div>
              </div>
            </div>
          </div>
          
          <div className="settings-group">
            <h3>CINEMATICS & ACCESSIBILITY</h3>
            <div className="settings-row">
              <label><Play size={16}/> Auto-play Briefings</label>
              <div className={`toggle-switch ${settings.autoPlayBriefings ? 'active' : ''}`} onClick={() => handleToggle('autoPlayBriefings')}>
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div className="settings-row">
              <label><EyeOff size={16}/> Reduce Motion</label>
              <div className={`toggle-switch ${settings.reduceMotion ? 'active' : ''}`} onClick={() => handleToggle('reduceMotion')}>
                <div className="toggle-knob"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
