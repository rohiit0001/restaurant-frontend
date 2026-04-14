import axios from "axios";

// Use environment variable for backend URL, fallback to localhost for development
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: baseURL
});

// 🔥 Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 🔥 Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.config?.url,
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default API;