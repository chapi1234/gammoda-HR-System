import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const postActivity = async ({ token, actor, action, type = 'general', meta = {} }) => {
  if (!token) return;
  try {
    const payload = { actor, action, type, meta };
    await axios.post(`${API_BASE}/api/activities`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    // non-fatal — log for developers
    console.warn('postActivity failed', e?.response?.data || e.message || e);
  }
};
