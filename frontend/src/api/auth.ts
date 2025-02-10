import { AxiosError } from "axios";
import { backendApiInstance } from "./index";

// Login
export const login = async (email: string, password: string) => {
  try {
    const response = await backendApiInstance.post("auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error instanceof AxiosError && error.response?.data?.detail) {
      // Some APIs return error details in a `detail` field
      throw new Error(error.response.data.detail);
    }

    // Fallback generic error
    throw new Error("Произошла непредвиденная ошибка во время логина");
  }
};

// Register
export const register = async (email: string, password: string) => {
  try {
    const response = await backendApiInstance.post("auth/register", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Check if the backend returns an error message
      const backendMessage =
        error.response?.data?.error || error.response?.data?.detail;

      if (backendMessage) {
        // Throw the specific error message from the backend
        throw new Error(backendMessage);
      }
    }
    throw new Error("An unexpected error occurred during registration.");
  }
};


// Verify Email
export const verifyEmail = async (token: string) => {
  try {
    const response = await backendApiInstance.post("auth/verify-email", {
      token,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    // Generic error handling
    throw new Error("Произошла ошибка при верификации email.");
  }
};