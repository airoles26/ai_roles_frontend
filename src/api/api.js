import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://ai-roles-backend.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;