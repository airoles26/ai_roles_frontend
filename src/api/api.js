
import axios from "axios";

// ========================================
// API BASE URL
// ========================================

const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1"
).replace(/\/+$/, "");


// ========================================
// PUBLIC API
// No authentication required
// ========================================

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});


// ========================================
// AUTHENTICATED API
// Requires token for protected endpoints
// ========================================

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});


// ========================================
// REQUEST INTERCEPTOR
// Attach token only to authenticated API
// ========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access") ||
      sessionStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ========================================
// RESPONSE INTERCEPTOR
// Handle expired or invalid tokens
// ========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "Authentication required or token expired:",
        error.config?.url
      );
    }

    return Promise.reject(error);
  }
);


// ========================================
// PUBLIC JOB APIs
// ========================================

export const jobsApi = {
  getJobs: (params = {}) =>
    publicApi.get("/jobs/", { params }),

  getJobDetails: (slug) =>
    publicApi.get(`/jobs/${encodeURIComponent(slug)}/`),

  getJobStats: () =>
    publicApi.get("/jobs/stats/"),

  getCompanies: () =>
    publicApi.get("/companies/"),

  getCategories: () =>
    publicApi.get("/categories/"),

  getSkills: () =>
    publicApi.get("/skills/"),
};


// ========================================
// DEFAULT EXPORT
// Existing authenticated imports still work
// ========================================

export default api;
