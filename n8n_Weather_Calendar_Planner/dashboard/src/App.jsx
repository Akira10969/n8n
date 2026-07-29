import React, { useEffect, useState } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  RefreshCw,
  AlertCircle,
  ThermometerSun,
  Sparkles
} from 'lucide-react';
import './App.css';

// We'll use the default n8n webhook URL (using our local Vite proxy to bypass CORS)
const WEBHOOK_URL = '/n8n/webhook/planner-data';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlannerData = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app with n8n, you'd fetch the WEBHOOK_URL.
      const response = await fetch(WEBHOOK_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      
      // Since our n8n code returns [{json: {events, weather}}], we extract it:
      const payload = Array.isArray(jsonData) && jsonData[0]?.json ? jsonData[0].json : jsonData;
      setData(payload);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not connect to n8n webhook. Make sure your n8n workflow is active and the URL is correct.");
      
      // For demonstration purposes, we will mock data if n8n is offline
      setData({
        weather: {
          main: { temp: 24, humidity: 60, feels_like: 26 },
          weather: [{ main: 'Clear', description: 'clear sky' }],
          wind: { speed: 4.5 },
          name: 'London'
        },
        events: [
          {
            summary: 'Team Standup',
            start: { dateTime: new Date(new Date().setHours(10, 0, 0)).toISOString(), timeZone: 'UTC' },
            end: { dateTime: new Date(new Date().setHours(10, 30, 0)).toISOString(), timeZone: 'UTC' },
            location: 'Zoom'
          },
          {
            summary: 'Project Review',
            start: { dateTime: new Date(new Date().setHours(14, 0, 0)).toISOString(), timeZone: 'UTC' },
            end: { dateTime: new Date(new Date().setHours(15, 30, 0)).toISOString(), timeZone: 'UTC' },
            location: 'Conference Room B'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannerData();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return 'All Day';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch(e) {
      return '';
    }
  };

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <>
        <div className="ambient-bg"></div>
        <div className="dashboard-container loading-container">
          <RefreshCw className="spinner" size={48} />
          <p>Loading your planner from n8n...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ambient-bg"></div>
      <div className="dashboard-container animate-in">
        <header className="header">
          <div className="header-title">
            <h1>Daily Planner</h1>
            <p>{greeting}! Here's your agenda and weather for {todayStr}.</p>
          </div>
          <button className="refresh-btn glass-panel" onClick={fetchPlannerData}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="error-container">
            <AlertCircle size={24} />
            <div>
              <strong>Warning:</strong> {error}
              <br/>
              <em>Currently showing mock data for preview purposes.</em>
            </div>
          </div>
        )}

    <div className="dashboard-grid">
        {/* LEFT COLUMN: Weather & AI Insights */}
        <div className="left-column">
          {/* WEATHER WIDGET */}
          <section className="weather-widget glass-panel">
            <div className="weather-bg-gradient"></div>
            
            <div className="weather-content">
              <div className="weather-header">
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Current Weather</h2>
                  <div className="weather-temp">
                    {data?.weather && data.weather.main ? Math.round(data.weather.main.temp) : '--'}°
                  </div>
                  <div className="weather-desc">
                    {data?.weather?.weather?.[0]?.description || 'Unknown'}
                  </div>
                </div>
                {data?.weather?.weather?.[0]?.main === 'Rain' ? (
                  <CloudRain size={64} color="var(--accent-cyan)" />
                ) : (
                  <Sun size={64} color="#fbbf24" />
                )}
              </div>

              <div className="weather-location">
                <MapPin size={16} />
                {data?.weather?.name || 'Unknown Location'}
              </div>

              <div className="weather-details">
                <div className="weather-detail-item">
                  <div className="weather-detail-icon">
                    <Wind size={20} />
                  </div>
                  <div className="weather-detail-text">
                    <p style={{margin: 0}}>Wind</p>
                    <p style={{margin: 0}}>{data?.weather?.wind?.speed || 0} m/s</p>
                  </div>
                </div>
                <div className="weather-detail-item">
                  <div className="weather-detail-icon" style={{ color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)' }}>
                    <Droplets size={20} />
                  </div>
                  <div className="weather-detail-text">
                    <p style={{margin: 0}}>Humidity</p>
                    <p style={{margin: 0}}>{data?.weather?.main?.humidity || 0}%</p>
                  </div>
                </div>
                <div className="weather-detail-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="weather-detail-icon" style={{ color: 'var(--accent-pink)', background: 'rgba(236, 72, 153, 0.1)' }}>
                    <ThermometerSun size={20} />
                  </div>
                  <div className="weather-detail-text">
                    <p style={{margin: 0}}>Feels Like</p>
                    <p style={{margin: 0}}>{data?.weather && data.weather.main ? Math.round(data.weather.main.feels_like) : '--'}°</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI INSIGHTS WIDGET */}
          {data?.ai_insight && (
            <section className="ai-widget glass-panel">
              <div className="ai-header">
                <Sparkles size={20} className="ai-icon" />
                <h2>Gemini Insights</h2>
              </div>
              <p className="ai-content">{data.ai_insight}</p>
            </section>
          )}
        </div>

        {/* AGENDA WIDGET */}
        <section className="agenda-widget glass-panel">
          <div className="agenda-header">
            <h2 style={{margin: 0}}>
              <CalendarIcon className="agenda-header-icon" size={24} />
              Today's Agenda
            </h2>
            <div className="agenda-date">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="event-list">
            {data?.events && data.events.length > 0 ? (
              data.events.map((event, idx) => (
                <div key={idx} className="event-card">
                  <div className="event-time">
                    <span className="start">{formatTime(event?.start?.dateTime)}</span>
                    <span className="end">{event?.start?.dateTime ? formatTime(event?.end?.dateTime) : ''}</span>
                  </div>
                  <div className="event-divider"></div>
                  <div className="event-details">
                    <h3 className="event-title" style={{marginTop: 0}}>{event?.summary || event?.subject || 'Untitled Event'}</h3>
                    {event?.location && (
                      <div className="event-location">
                        <MapPin size={14} />
                        {typeof event.location === 'string' ? event.location : event.location.displayName}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Clock size={48} opacity={0.5} />
                <p>No events scheduled for today.<br/>Enjoy your free time!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}

export default App;
