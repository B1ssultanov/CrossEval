import { backendApiInstance } from "./index";
import { AxiosError } from "axios";

export interface AssignmentGrade {
  title: string;
  grade: number;
  weight: string;
  percentage: string;
  status: string;
  assignment_id: number;
  answer_id?: number;
}

export interface StudentGradesResponse {
  grades: AssignmentGrade[];
  page: string;
  totalPage: number;
  nbTotal: number;
}

export interface SupervisorStudent {
  name: string;
  surname: string;
  university_id: number;
  assignments: AssignmentGrade[];
}

export interface SupervisorGradesResponse {
  students: SupervisorStudent[];
  page: string;
  totalPage: number;
  nbTotal: number;
}

// Тип
export interface AnswerReviewInfo {
  answer_review_id: number;
  answer_id: number;
  grade: number;
  criteria: string | null;
  comment: string | null;
  status: string;
}


export const recheckAnswer = async (answerId: number, grade: number): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("answer_id", answerId.toString());
    formData.append("grade", grade.toString());

    const response = await backendApiInstance.post("/answer/recheck", formData);
    return response.data.message || "Grade updated successfully.";
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to recheck answer.");
    }
    throw error;
  }
};


// Запрос
export const fetchAnswerInfo = async (answerId: number): Promise<AnswerReviewInfo[]> => {
  try {
    const response = await backendApiInstance.get("/answer/info", {
      params: { answer_id: answerId },
    });
    return response.data.answer;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch answer info.");
    }
    throw error;
  }
};


// Fetch grades for students
export const fetchStudentGrades = async (
  courseId: number,
  page: number,
  limit: number
): Promise<StudentGradesResponse> => {
  try {
    const response = await backendApiInstance.get(`/user/student/grades`, {
      params: { course_id: courseId, page, limit },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch student grades.");
    }
    throw error;
  }
};

// Fetch grades for supervisors
export const fetchSupervisorGrades = async (
  courseId: number,
  page: number,
  limit: number
): Promise<SupervisorGradesResponse> => {
  try {
    const response = await backendApiInstance.get(`/user/supervisor/grades`, {
      params: { course_id: courseId, page, limit },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch supervisor grades.");
    }
    throw error;
  }
};

// Fetch user courses
export interface Course {
  id: number;
  name: string;
  code: string;
  course_group: string;
  teacher_name: string;
}

export interface UserDataResponse {
  courses: Course[];
}

export const fetchUserCourses = async (role: "supervisor" | "student"): Promise<UserDataResponse> => {
  try {
    const response = await backendApiInstance.get("/main", { params: { role } });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch user courses.");
    }
    throw error;
  }
};


// Export grades for selected assignments
export const exportSupervisorGrades = async (
  courseId: number,
  assignmentIds: number[]
): Promise<Blob> => {
  try {
    const response = await backendApiInstance.get(`/grades/export`, {
      params: {
        course_id: courseId,
        assignment_ids: assignmentIds.join(","),
      },
      responseType: "blob", // Important for file download
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to export grades.");
    }
    throw error;
  }
};

