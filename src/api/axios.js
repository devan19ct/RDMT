import axios from "axios";
import { getToken, clearToken } from "../auth/token";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://www.bytesymphony.dev/TestAPI",
  headers: { "Content-Type": "application/json" },
});


API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();

      window.dispatchEvent(new CustomEvent("app:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default API;
