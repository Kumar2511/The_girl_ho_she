import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },

  // IMPORTANT:
  // Allow browser to send the HTTP-only auth cookie
  withCredentials: true,
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error?.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const requestUrl =
        error?.config?.url || "";

      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/verify-email");

      // Do NOT redirect/clear anything during login/register
      if (!isAuthRequest) {
        window.dispatchEvent(
          new Event("auth-expired")
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;