import React, { useState } from 'react';
import { Send, Code, CheckCircle2, XCircle } from 'lucide-react';

export default function HandsOnLab() {
  const [method, setMethod] = useState('POST');
  const [url, setUrl] = useState('https://api.example.com/webhook/receive');
  const [payload, setPayload] = useState('{\n  "event": "user.created",\n  "data": {\n    "id": 123,\n    "email": "user@example.com"\n  }\n}');
  
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSendWebhook = () => {
    setIsSending(true);
    setResponse(null);
    
    // Simulate response delay
    setTimeout(() => {
      setIsSending(false);
      
      // Parse payload to ensure it's valid JSON for the simulation
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
        setResponse({
          status: 200,
          statusText: 'OK',
          data: {
            message: 'Webhook received successfully',
            receivedPayload: parsedPayload,
            timestamp: new Date().toISOString()
          }
        });
      } catch (err) {
        setResponse({
          status: 400,
          statusText: 'Bad Request',
          error: 'Invalid JSON payload. Please check your syntax.'
        });
      }
    }, 1200);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div className="section-header">
        <div className="icon-wrapper" style={{ color: 'var(--accent-purple)' }}>
          <Code size={20} />
        </div>
        <h2>Interactive Simulator</h2>
      </div>

      <div className="form-group">
        <label>Webhook Request URL</label>
        <div className="input-row">
          <select 
            className="form-control" 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            disabled={isSending}
          >
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input 
            type="text" 
            className="form-control" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-domain.com/webhook"
            disabled={isSending}
          />
        </div>
      </div>

      <div className="form-group">
        <label>JSON Payload (Data sent to receiver)</label>
        <textarea 
          className="form-control" 
          value={payload} 
          onChange={(e) => setPayload(e.target.value)}
          disabled={isSending}
        ></textarea>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handleSendWebhook}
        disabled={isSending || !url.trim()}
      >
        <Send size={18} />
        {isSending ? 'Sending Data...' : 'Fire Webhook'}
      </button>

      {/* RESPONSE PANEL */}
      <div className="response-panel">
        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>
          Destination Server Logs
        </label>
        
        {!response && !isSending && (
          <div className="empty-state">
            Awaiting incoming webhook requests...
          </div>
        )}

        {isSending && (
          <div className="empty-state" style={{ color: 'var(--accent-cyan)' }}>
            Listening for incoming request...
          </div>
        )}

        {response && (
          <div className="response-content animate-in">
            {response.status === 200 ? (
              <div className="status-badge status-success">
                <CheckCircle2 size={14} />
                {response.status} {response.statusText}
              </div>
            ) : (
              <div className="status-badge status-error">
                <XCircle size={14} />
                {response.status} {response.statusText}
              </div>
            )}
            
            <div className="code-block">
              {response.error ? (
                <span style={{ color: 'var(--accent-red)' }}>{response.error}</span>
              ) : (
                <pre style={{ margin: 0 }}>
{JSON.stringify(response.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
