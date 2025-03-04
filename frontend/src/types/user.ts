
// Defined the expected user response structure from fetchCurrentUser api call
export interface User {
  id: number;
  university_id: number;
  name: string;
  surname: string;
  email: string;
  status: string;
  token: string;
}

export interface SearchComponentProps {
  role: "supervisor" | "student";
  onSearchResults: (data: UserDataResponse) => void; // Callback to update the main page
}

// Defined the expected response structure
export interface UserResponse {
  user: User;
}

// Defined error response structure
export interface UserErrorResponse {
  message: string;
}

//  the expected response structure
export interface Course {
  id: number;
  name: string;
  code: string;
  invite_code: string;
  course_group: string;
  teacher_name: string;
}
export interface User {
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

export interface UserDataResponse {
  courses: Course[];
  user: User;
}

//  the error response structure
export interface UserDataErrorResponse {
  message: string;
}

// the type for user registration data
export interface RegisterUserPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirmation: string;
  university_id: string;
}

// the type for a successful API response
export interface RegisterUserSuccessResponse {
  data: any;
  token: string;
  message: string;
}

// the type for an error API response
export interface RegisterUserErrorResponse {
  errors: Record<string, string[]>;
}

// login request payload
export interface LoginPayload {
  email: string;
  password: string;
}

// the success response from the API
export interface LoginSuccessResponse {
  token: string;
  role: string | null;
}

// the error response
export interface LoginErrorResponse {
  message: string;
}
      