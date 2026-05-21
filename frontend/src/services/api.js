import axios from "axios";
import { clearToken, getStoredToken } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});


api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();

      if (!["/login", "/register", "/"].includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
