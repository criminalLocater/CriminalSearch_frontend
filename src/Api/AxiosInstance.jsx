import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor if needed
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.warn("Unauthorized - redirecting to login");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;