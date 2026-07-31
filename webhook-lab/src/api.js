// src/api.js

export const getAuthTokens = () => {
  return {
    engineer_id: localStorage.getItem('webhook_engineer_id'),
    player_token: localStorage.getItem('webhook_player_token')
  };
};

export const registerPlayer = async () => {
  try {
    const res = await fetch('/backend/api/register.php');
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('webhook_engineer_id', data.data.engineer_id);
      localStorage.setItem('webhook_player_token', data.data.player_token);
      return data.data;
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
  return null;
};

export const syncProgress = async (progressData) => {
  const auth = getAuthTokens();
  if (!auth.engineer_id) return;

  try {
    const res = await fetch('/backend/api/sync_progress.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...auth,
        ...progressData
      })
    });
    return await res.json();
  } catch (error) {
    console.error('Sync failed:', error);
  }
};

export const sendHeartbeat = async () => {
  const auth = getAuthTokens();
  if (!auth.engineer_id) return;

  try {
    await fetch('/backend/api/heartbeat.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auth)
    });
  } catch (error) {
    // Ignore heartbeat failures quietly
  }
};

export const logEvent = async (eventType, missionIndex = null, eventData = null) => {
  const auth = getAuthTokens();
  if (!auth.engineer_id) return;

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
    // Ignore analytics failures quietly
  }
};
