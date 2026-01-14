// frontend/src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

export const healthCheck = async () => {
  const res = await api.get("/health");
  return res.data;
};


export default api;
