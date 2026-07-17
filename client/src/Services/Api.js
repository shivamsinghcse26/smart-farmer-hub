import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL:   BACKEND_URL || "http://localhost:5000", 
  withCredentials: true
});

export default api;
        