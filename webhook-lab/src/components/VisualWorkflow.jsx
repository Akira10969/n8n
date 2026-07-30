import React, { useState, useEffect } from 'react';
import { Activity, Send, Server } from 'lucide-react';

export default function VisualWorkflow() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    // Loop the animation automatically for the learning module
    const interval = setInterval(() => {
      setActiveNode(1);
      setTimeout(() => setActiveNode(2), 500);
      setTimeout(() => setActiveNode(3), 1200);
      setTimeout(() => setActiveNode(0), 1800);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="workflow-container glass-panel" style={{ marginTop: '2rem' }}>
      {/* SOURCE NODE */}
      <div className={`node ${activeNode >= 1 ? 'active' : ''}`}>
        <div className="node-header">
          <Activity size={20} color="var(--accent-cyan)" />
          <h3>Source System (Trigger)</h3>
        </div>
        <p className="node-desc">An event occurs here (e.g., a new user registers).</p>
      </div>

      {/* CONNECTION 1 */}
      <div className="connection">
        <div className={`line ${activeNode >= 1 ? 'active' : ''}`}></div>
        <div className={`packet ${activeNode === 1 || activeNode === 2 ? 'animate' : ''}`}></div>
      </div>

      {/* NETWORK NODE (HTTP REQUEST) */}
      <div className={`node ${activeNode >= 2 ? 'active' : ''}`}>
        <div className="node-header">
          <Send size={20} color="var(--accent-purple)" />
          <h3>HTTP POST Request</h3>
        </div>
        <p className="node-desc">Sending JSON data payload to the Webhook URL.</p>
      </div>

      {/* CONNECTION 2 */}
      <div className="connection">
        <div className={`line ${activeNode >= 2 ? 'active' : ''}`}></div>
        <div className={`packet ${activeNode === 2 || activeNode === 3 ? 'animate' : ''}`}></div>
      </div>

      {/* DESTINATION NODE */}
      <div className={`node ${activeNode >= 3 ? 'active' : ''}`}>
        <div className="node-header">
          <Server size={20} color="var(--accent-green)" />
          <h3>Destination System (Receiver)</h3>
        </div>
        <p className="node-desc">Receives the data and executes a follow-up action.</p>
      </div>
    </div>
  );
}
