import { backendApiInstance } from "./index";
import { AxiosError } from "axios";
import { User, UserDataResponse, UserDataErrorResponse, RegisterUserPayload, RegisterUserSuccessResponse, RegisterUserErrorResponse, LoginPayload, LoginSuccessResponse, LoginErrorResponse } from '@/types/user'

// Utility function to check if an error is an AxiosError
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>)?.isAxiosError !== undefined;
}

// Assuming your User interface is defined as:
interface UserUpdate {
  id: number;
  university_id: number;
  name: string;
  surname: string;
  email: string;
  phone_number: string | null;
  login: string | null;
  gender: string | null;
  course_grade: string | null;
  faculty: string | null;
  speciality: string | null;
  academic_degree: string | null;
  birthday: string | null;
  status: string;
  image: string | null;
}

// Update user profile data with FormData
export const updateUserProfile = async (
  updatedData: Partial<UserUpdate>,
  imageFile?: File
): Promise<User> => {
  try {
    const formData = new FormData();
    Object.entries(updatedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert the value to a string for FormData. Adjust the conversion as needed.
        formData.append(key, String(value));
      }
    });

    // Append the image file if provided
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
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
};


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

// // Update user profile data with form-data
// export const updateUserProfile = async (updatedData: Record<string, any>, imageFile?: File) => {
//   try {
//     const formData = new FormData();
//     Object.entries(updatedData).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         formData.append(key, value);
//       }
//     });

//     // Append image file if provided
//     if (imageFile) {
//       formData.append("image", imageFile);
//     }

//     const response = await backendApiInstance.post("/user/profile", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to update profile.");
//   }
// };
