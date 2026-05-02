import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        const user = JSON.parse(userData);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (err) {
      console.error("Auth interceptor error:", err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 globally (Session Expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // We will let components handle 401 themselves for more control
    return Promise.reject(error);
  }
);

export default API;