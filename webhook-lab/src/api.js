// src/api.js

export const getAuthTokens = () => {
  return {
    engineer_id: localStorage.getItem('webhook_engineer_id'),
    player_token: localStorage.getItem('webhook_player_token')
  };
};

export const registerPlayer = async () => {
  if (window._isRegistering) return null;
  window._isRegistering = true;
  
  try {
    const res = await fetch('/backend/api/register.php');
    if (!res.ok) {
      if (!window._hasLoggedOffline) {
        console.warn(`[API] Registration failed with status: ${res.status}. Falling back to Offline Mode.`);
        window._hasLoggedOffline = true;
      }
      return null;
    }
    const data = await res.json();
    if (data && data.success) {
      localStorage.setItem('webhook_engineer_id', data.data.engineer_id);
      localStorage.setItem('webhook_player_token', data.data.player_token);
      return data.data;
    }
  } catch (error) {
    if (!window._hasLoggedOffline) {
      console.warn(`[API] Registration error: ${error.message}. Falling back to Offline Mode.`);
      window._hasLoggedOffline = true;
    }
  } finally {
    window._isRegistering = false;
  }
  return null;
};

export const syncProgress = async (progressData) => {
  const auth = getAuthTokens();
  if (!auth.engineer_id || auth.engineer_id.startsWith('OFFLINE-')) return;

  try {
    const res = await fetch('/backend/api/sync_progress.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...auth,
        ...progressData
      })
    });
    if (!res.ok) return;
    return await res.json();
  } catch (error) {
    console.error('[API] Sync failed:', error.message);
  }
};

export const sendHeartbeat = async () => {
  const auth = getAuthTokens();
  if (!auth.engineer_id || auth.engineer_id.startsWith('OFFLINE-')) return;

  try {
    await fetch('/backend/api/heartbeat.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auth)
    });
  } catch (error) {
    console.debug('[API] Heartbeat failed: Expected if backend is down.', error.message);
  }
};

export const logEvent = async (eventType, missionIndex = null, eventData = null) => {
  const auth = getAuthTokens();
  if (!auth.engineer_id || auth.engineer_id.startsWith('OFFLINE-')) return;

  try {
    await fetch('/backend/api/analytics.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...auth,
        event_type: eventType,
        mission_index: missionIndex,
        event_data: eventData
      })
    });
  } catch (error) {
    console.debug('[API] Analytics failed: Expected if backend is down.', error.message);
  }
};
