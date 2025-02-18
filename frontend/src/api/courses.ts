import { backendApiInstance } from "./index";
import { AxiosError } from "axios";

interface CreateCourseParams {
  id: string;
  name: string;
  group: string;
}

// Define Course type
export interface Course {
  id: number;
  name: string;
  code: string;
  invite_code: string;
  course_group: string;
  teacher_name: string;
}

// For a single assignment
export interface Assignment {
  id: number;
  title: string;
  type: "essay" | "presentation" | "code" | "quiz" | "project";
  description: string;
  start_date: string;
  end_date: string;
  weight: number;
  isCrossCheck: number;
  criteria: { name: string; weight: number }[];
  rubrics_id: number;
  status: string;
}

export interface AssignmentPayload {
  course_id: number;
  type: "essay" | "presentation" | "code" | "quiz" | "project";
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  weight: number;
  criteria: { name: string; weight: number }[];
  isCrossCheck: string;
  rubrics_file?: File | null;
}

// Interface for answer submission payload
export interface AssignmentAnswerPayload {
  assignment_id: string;
  comment: string;
  answer_file: File;
}


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
    formData.append("weight", payload.weight.toString());
    formData.append("criteria", JSON.stringify(payload.criteria));
    formData.append("isCrossCheck", payload.isCrossCheck);

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

