import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/auth",
// });

const api = axios.create({ baseURL: "http://127.0.0.1:8000/auth" });
// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors and refresh token
api.interceptors.response.use(
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
        const res = await axios.post(
          "http://127.0.0.1:8000/auth/refresh",
          { refresh_token }
        );
        localStorage.setItem("access_token", res.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;



const fetchLibraries = async () => {
  try {
    const response = await axios.get("http://localhost:8000/libraries/", {
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
        headers: { Authorization: `Bearer ${token}` }

      },
    });
    console.log(response.data);
  } catch (err) {
    console.error("Error fetching libraries: ", err);
  }
};
