import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * API base URL used in the browser.
 *
 * Recommended for local dev: set NEXT_PUBLIC_API_URL=/api/v1 and use Next rewrites (see next.config.js)
 * Fallback keeps the app functional even if env is missing.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const backendApiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

backendApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // IMPORTANT: if url starts with "/", axios treats it as absolute-from-origin and drops "/api/v1"
    // Strip leading slash so all calls correctly become: `${baseURL}/${url}`
    if (config.url?.startsWith("/")) {
      config.url = config.url.slice(1);
    }

    // List of public endpoints that don't require authorization
    const publicEndpoints = [
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "verify-email",
      "landing-page",
    ];

    // Check if the request URL matches any public endpoint
    if (publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      return config; // Skip token check for public endpoints
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error(
        "No access token found in localStorage. Redirecting to login."
      );
      window.location.replace("/login");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// backendApiInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {

//       console.error("No access token found in localStorage.");
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for error handling
backendApiInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response; // Return the response as is
  },
  async (error) => {
    const originalRequest = error.config;

    // Same list as in request interceptor (without leading "/")
    const publicEndpoints = [
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "verify-email",
    ];
    // If 401 Unauthorized and the request is not retried
    if (
      error.response?.status === 401 &&
      !publicEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      )
    ) {
      if (!originalRequest._isRetry) {
        originalRequest._isRetry = true;

        console.error("Unauthorized. Redirecting to login.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.replace("/login");
      }
    }

    // Refresh token logic is not implemented in the backend, commenting this out
    // try {
    //   const response = await axios.post(`${API_URL}token/refresh/`, {
    //     refresh: localStorage.getItem("refreshToken"),
    //   });
    //   localStorage.setItem("accessToken", response.data.access);
    //   originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
    //   return backendApiInstance.request(originalRequest);
    // } catch (e) {
    //   console.log("Failed to refresh token");
    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("refreshToken");
    //   window.location.replace("/auth/login");
    // }

    return Promise.reject(error);
  }
);
