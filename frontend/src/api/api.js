import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI backend
  withCredentials: true,            // for cookies if you use JWT in HttpOnly cookies
});

export default api;
