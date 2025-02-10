import { backendApiInstance } from "./index";
import { AxiosError } from "axios";

// Defined the expected user response structure from fetchCurrentUser api call
interface User {
  id: number;
  university_id: number;
  name: string;
  surname: string;
  email: string;
  status: string;
  token: string;
}

// Defined the expected response structure
interface UserResponse {
  user: User;
}

// Defined error response structure
interface UserErrorResponse {
  message: string;
}

//  the expected response structure
interface Course {
  id: number;
  name: string;
  code: string;
  invite_code: string;
  course_group: string;
  teacher_name: string;
}

interface User {
  id: number;
  university_id: number;
  name: string;
  surname: string;
  email: string;
  status: string;
  token: string;
}

interface UserDataResponse {
  courses: Course[];
  user: User;
}

//  the error response structure
interface UserDataErrorResponse {
  message: string;
}

// the type for user registration data
interface RegisterUserPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirmation: string;
  university_id: string;
}

// the type for a successful API response
interface RegisterUserSuccessResponse {
  data: any;
  token: string;
  message: string;
}

// the type for an error API response
interface RegisterUserErrorResponse {
  errors: Record<string, string[]>;
}

// login request payload
interface LoginPayload {
  email: string;
  password: string;
}

// the success response from the API
interface LoginSuccessResponse {
  token: string;
  role: string | null;
}

// the error response
interface LoginErrorResponse {
  message: string;
}

// Utility function to check if an error is an AxiosError
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>)?.isAxiosError !== undefined;
}

// Function to register a user
export const registerUser = async (
  userData: RegisterUserPayload
): Promise<RegisterUserSuccessResponse> => {
  try {
    const response = await backendApiInstance.post<RegisterUserSuccessResponse>(
      "/register",
      {
        ...userData,
        password_confirmation: userData.password, // Auto-fill password confirmation
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<RegisterUserErrorResponse>(error)) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(", ")
        : "An error occurred during registration.";
      throw new Error(errorMessage);
    }

    throw new Error("Unknown error occurred during registration.");
  }
};

// Function to log in the user
export const loginUser = async (
  credentials: LoginPayload
): Promise<LoginSuccessResponse> => {
  try {
    const response = await backendApiInstance.post<LoginSuccessResponse>(
      "/login",
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<LoginErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
    throw new Error("An unknown error occurred during login.");
  }
};

// MAIN PAGE API Function to fetch user data and courses
export const fetchUserData = async (
  accessToken: string
): Promise<UserDataResponse> => {
  try {
    const response = await backendApiInstance.get<UserDataResponse>("/main");

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<UserDataErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data."
      );
    }
    throw new Error("An unknown error occurred while fetching user data.");
  }
};

// Function to fetch the current user
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await backendApiInstance.get<UserResponse>("/user");
    return response.data.user;
  } catch (error: unknown) {
    if (isAxiosError<UserErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data."
      );
    }
    throw new Error("An unknown error occurred while fetching user data.");
  }
};
