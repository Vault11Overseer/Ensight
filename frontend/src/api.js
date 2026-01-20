export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";


  export const healthCheck = async () => {
    const res = await api.get("/health");
    return res.data;
  };