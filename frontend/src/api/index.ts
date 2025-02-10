import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const backendApiInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

backendApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // List of public endpoints that don't require authorization
    const publicEndpoints = ["/login", "/register", "/verify-email", "/reset-password"];

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

    const publicEndpoints = ["/login", "/register", "/verify-email", "/reset-password"];
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
