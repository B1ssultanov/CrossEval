import { backendApiInstance } from "./index";
import { AxiosError } from "axios";
import { User, UserDataResponse, UserDataErrorResponse, RegisterUserPayload, RegisterUserSuccessResponse, RegisterUserErrorResponse, LoginPayload, LoginSuccessResponse, LoginErrorResponse } from '@/types/user'

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
// export const fetchUserData = async (role: "supervisor" | "student"): Promise<UserDataResponse> => {
//   try {
//     const response = await backendApiInstance.get<UserDataResponse>(`/main`, {
//       params: { role }, // Pass role as a query parameter
//     });

//     return response.data;
//   } catch (error: unknown) {
//     if (isAxiosError<UserDataErrorResponse>(error)) {
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch user data."
//       );
//     }
//     throw new Error("An unknown error occurred while fetching user data.");
//   }
// };

// Fetch user data and courses with optional search
export const fetchUserData = async (
  role: "supervisor" | "student",
  search?: string // ✅ search is now optional
): Promise<UserDataResponse> => {
  try {
    // Construct params object dynamically
    const params: Record<string, string> = { role };
    if (search && search.trim() !== "") {
      params.search = search; // ✅ Only add search if it's not empty
    }

    const response = await backendApiInstance.get<UserDataResponse>("/main", {
      params,
    });

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
// export const fetchCurrentUser = async (): Promise<User> => {
//   try {
//     const response = await backendApiInstance.get<UserResponse>("/user");
//     return response.data.user;
//   } catch (error: unknown) {
//     if (isAxiosError<UserErrorResponse>(error)) {
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch user data."
//       );
//     }
//     throw new Error("An unknown error occurred while fetching user data.");
//   }
// };
export const fetchCurrentUser = async (): Promise<User> => {
  try {
    const response = await backendApiInstance.get<{ user: User }>("/user");
    return response.data.user; // ✅ Now correctly returns full user details
  } catch (error: unknown) {
    if (isAxiosError<{ message: string }>(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch user data.");
    }
    throw new Error("An unknown error occurred while fetching user data.");
  }
};

// Update user profile data with form-data
export const updateUserProfile = async (updatedData: Record<string, any>, imageFile?: File) => {
  try {
    const formData = new FormData();
    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Append image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await backendApiInstance.post("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to update profile.");
  }
};
