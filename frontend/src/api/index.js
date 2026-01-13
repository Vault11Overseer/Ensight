// frontend/src/api/index.js
import axios from "axios";

/**
 * Base API URL
 * Example VITE_API_BASE=https://insight-backend-vu35.onrender.com
 */
export const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * Health check
 * Expected response:
 * { status: "OK", db: "Connected" }
 */
export const healthCheck = async () => {
  const res = await api.get("/");
  return res.data;
};

export default api;
