// import axios from "axios";

// // Axios instance
// const API = axios.create({
//   baseURL: "http://localhost:8000",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // if your backend uses cookies
// });

// // Attach access token to requests
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle 401 errors and refresh token automatically
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite loop
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refresh_token = localStorage.getItem("refresh_token");
//       if (!refresh_token) {
//         // No refresh token — redirect to login
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       try {
//         const res = await axios.post("http://127.0.0.1:8000/auth/refresh", {
//           refresh_token,
//         });
//         // Save new access token
//         localStorage.setItem("access_token", res.data.access_token);
//         // Retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
//         return API(originalRequest);
//       } catch (err) {
//         // Refresh failed — clear storage and redirect
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;

// // const fetchLibraries = async () => {
// //   try {
// //     const response = await API.get("/libraries"); // token is auto-attached

// //     console.log(response.data);
// //   } catch (err) {
// //     console.error("Error fetching libraries: ", err);
// //   }
// // };

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token on 401
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
        // Save refreshed token using the same key your app expects
        localStorage.setItem("token", res.data.token);
        // Retry the original request
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
