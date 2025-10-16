// ======================================
// AXIOS
// ======================================

// ======================================
// IMPORTS
// ======================================
import axios from "axios";

// ======================================
// CREATE AXIOS
// ======================================
const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ======================================
// ATTACH TOKEN FROM LOCAL STORAGE
// ======================================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================================
// REFRESH TOKEN ON 401
// ======================================
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://localhost:8000/auth/refresh", {
          refresh_token,
        });
        // SAVE REFRESH TOKEN USING THE SAME KEY YOUR BACKEND EXPECTS
        localStorage.setItem("token", res.data.token);
        // RETRY THE ORIGINAL REQUEST
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
