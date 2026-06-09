import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/api",
  withCredentials: false,
});

// Attach Sanctum token + session header from localStorage/cookie
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const sessionId = localStorage.getItem("session_id");
    if (sessionId) config.headers["X-Session-ID"] = sessionId;
  }
  return config;
});

export default api;
