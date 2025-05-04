import { backendApiInstance } from "./index";
import { AxiosError } from "axios";
import {CreateCourseParams, AssignmentPayload, AssignmentAnswerPayload, SyllabusPayload} from "@/types/courses";



// Create the course
export const createCourse = async (params: CreateCourseParams) => {
  try {
    const response = await backendApiInstance.post("/course", params);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to create course");
    }
    throw error;
  }
};


//Join the course
export const joinCourse = async (invite_code: string) => {
  try {
    const response = await backendApiInstance.post("/course/invite", { invite_code });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to join course");
    }
    throw error;
  }
};


// Fetch course details by ID
export const fetchCourseById = async (courseId: number) => {
  try {
    const response = await backendApiInstance.get(`/course`, {
      params: { id: courseId }, // Send course ID as query param
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch course details");
    }
    throw error;
  }
};

// Creation of an assignemnt:

export const createAssignment = async (payload: AssignmentPayload) => {
  try {
    const formData = new FormData();
    formData.append("course_id", payload.course_id.toString());
    formData.append("type", payload.type);
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("start_date", payload.start_date);
    formData.append("end_date", payload.end_date);
    if (payload.end_cross_date) {
      formData.append("end_cross_date", payload.end_cross_date);
    }
    formData.append("weight", payload.weight.toString());
    formData.append("criteria", JSON.stringify(payload.criteria));
    // formData.append("isCrossCheck", payload.isCrossCheck);
    formData.append("evaluation_method", payload.evaluation_method);
    if (payload.rubrics_file) {
      formData.append("rubrics_file", payload.rubrics_file);
    }

    const response = await backendApiInstance.post("/assignment", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Fetch a single assignment by ID
export const fetchAssignment = async (assignmentId: number) => {
  try {
    const response = await backendApiInstance.get(`/assignment/${assignmentId}`);

    // Parse the criteria string into an array
    const assignmentData = response.data.assignment;
    assignmentData.criteria = JSON.parse(assignmentData.criteria);

    return assignmentData;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch assignment details");
    }
    throw error;
  }
};


// Submit an answer for an assignment
export const submitAssignmentAnswer = async (payload: AssignmentAnswerPayload): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("assignment_id", payload.assignment_id);
    formData.append("comment", payload.comment);
    formData.append("answer_file", payload.answer_file);

    await backendApiInstance.post("/answer", formData);

  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to submit assignment answer.");
    }
    throw error;
  }
};



// Download the rubrics file
export const downloadRubricsFile = async (assignmentName:string, rubricsId:number, name:string): Promise<void> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    const baseOrigin = new URL(API_URL).origin;  // e.g. "http://127.0.0.1:8000"
    const fileUrl = `${baseOrigin}/file/${rubricsId}`;
    const response: Response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download rubrics file");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${name}_for_${assignmentName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    throw new Error(`Failed to download ${name} file: ${(error as Error).message}`);
  }
};

// Download the rubrics file
export const downloadSubmissionFile = async (assignmentName:string, rubricsId:number, name:string): Promise<void> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const baseOrigin = new URL(API_URL).origin;  // e.g. "http://127.0.0.1:8000"
  const fileUrl = `${baseOrigin}/file/${rubricsId}`;

  try {
    const response: Response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download assignement submission file");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `assignment_submission_${assignmentName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    throw new Error(`Failed to download ${name} file: ${(error as Error).message}`);
  }
};

// For adding rubrics file to course
export const uploadSyllabus = async (payload: SyllabusPayload) => {
  try {
    const formData = new FormData();
    formData.append("course_id", payload.course_id);
    formData.append("syllabus_file", payload.file);

    // Обратите внимание на правильный путь к эндпоинту
    const response = await backendApiInstance.post(
      "/syllabus",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to upload syllabus");
    }
    throw error;
  }
};




// Получение студентов курса
export const fetchCourseStudents = async (courseId: number) => {
  try {
    const response = await backendApiInstance.get("/course/students/list", {
      params: { course_id: courseId },
    });
    return response.data as {
      students: {
        id: number;
        university_id: number;
        name: string;
        surname: string;
      }[];
      supervisor: {
        id: number;
        university_id: number;
        name: string;
        surname: string;
      };
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch course students");
    }
    throw error;
  }
};

// Удаление студента с курса
export const removeStudentFromCourse = async (courseId: number, userId: number) => {
  try {
    const response = await backendApiInstance.delete("/user/course", {
      params: { course_id: courseId, user_id: userId },
    });
    return response.data as { message: string };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to remove student");
    }
    throw error;
  }
};