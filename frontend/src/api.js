// frontend/src/api.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Health check function
export const healthCheck = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ HEALTH CHECK ERROR:", err);
    return { status: "error", error: err.message };
  }
};
