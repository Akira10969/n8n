import React, { useState, useEffect } from 'react';
import { Users, Activity, Trophy, AlertTriangle } from 'lucide-react';

export default function AdminDashboard({ onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/backend/api/admin_stats.php');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading Telemetry...</div>;
  if (!stats) return <div style={{ color: 'red', padding: '2rem' }}>Connection to Business Cloud OS Admin Backend Failed.</div>;

  return (
    <div className="dashboard-container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'monospace' }}>
      
      <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent-red)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: 'var(--accent-red)', fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            &gt; Business Cloud OS // ADMINISTRATOR OVERRIDE
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--text-main)', letterSpacing: '0.05em' }}>
            GLOBAL TELEMETRY
          </h1>
        </div>
        <button onClick={onBack} className="btn" style={{ background: 'transparent', border: '1px solid #fff', padding: '0.5rem 1rem' }}>EXIT ADMIN</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--accent-cyan)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', marginBottom: '1rem', textTransform: 'uppercase' }}>
            <Users size={20} /> Total Engineers
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.total_engineers}</div>
        </div>

        <div style={{ background: 'rgba(11, 15, 25, 0.9)', border: '1px solid #22c55e', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', marginBottom: '1rem', textTransform: 'uppercase' }}>
            <Activity size={20} /> Engineers Online
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
            {stats.online_engineers}
            <span className="animate-pulse" style={{ fontSize: '1rem', marginLeft: '10px', color: '#22c55e' }}>● LIVE</span>
          </div>
        </div>

        <div style={{ background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--accent-purple)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', marginBottom: '1rem', textTransform: 'uppercase' }}>
            <Trophy size={20} /> Certified Platforms
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{stats.certified_engineers}</div>
        </div>
      </div>

      <h2 style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Mission Drop-off Analysis</h2>
      <div style={{ background: 'rgba(11, 15, 25, 0.9)', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Mission Index</th>
              <th style={{ padding: '1rem' }}>Started (Unlocked)</th>
              <th style={{ padding: '1rem' }}>Completed</th>
              <th style={{ padding: '1rem' }}>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {stats.mission_stats?.map((m) => {
              const rate = m.started > 0 ? Math.round((m.completed / m.started) * 100) : 0;
              return (
                <tr key={m.mission_index} style={{ borderBottom: '1px solid #1e293b', color: 'var(--text-main)' }}>
                  <td style={{ padding: '1rem' }}>Mission {m.mission_index}</td>
                  <td style={{ padding: '1rem' }}>{m.started}</td>
                  <td style={{ padding: '1rem' }}>{m.completed}</td>
                  <td style={{ padding: '1rem', color: rate < 50 && m.started > 0 ? 'var(--accent-red)' : '#22c55e' }}>
                    {rate}% {rate < 50 && m.started > 0 && <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
