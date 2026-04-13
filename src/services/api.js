import axios from "axios";

const API = axios.create({
baseURL: "https://restaurant-backend-3sg7.onrender.com"
});

// Response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.config?.url, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Request interceptor
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

export default API;