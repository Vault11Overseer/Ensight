// src/api.js
export const API_BASE = "https://<your-render-backend>.onrender.com";

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/`);
  return res.json();
}

