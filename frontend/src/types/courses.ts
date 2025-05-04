
export interface CreateCourseParams {
  id: string;
  name: string;
  group: string;
}

export interface CourseFetchById{
  assignments: [],
  course: Course,
  role: string
}
// Define Course type
export interface Course {
  id: number;
  name: string;
  code: string;
  invite_code: string;
  course_group: string;
  teacher_name: string;
  syllabus_file_id?: number;
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
  end_cross_date?: string; 
  // isCrossCheck: number;
  evaluation_method: string;
  criteria: { name: string; weight: number }[];
  rubrics_id: number;
  status: string;
}


//Assignment payload type
export interface AssignmentPayload {
  course_id: number;
  type: "essay" | "presentation" | "code" | "quiz" | "project";
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  end_cross_date?: string; // Optional field for cross-check date
  weight: number;
  criteria: { name: string; weight: number }[];
  // isCrossCheck: string;
  evaluation_method: string;
  rubrics_file?: File | null;
}


// Interface for answer submission payload
export interface AssignmentAnswerPayload {
  assignment_id: string;
  comment: string;
  answer_file: File;
}


//For downloading the rubrics file endpoint
export type FileBlob = Blob;


//For adding reubrics file to course
export interface SyllabusPayload {
  course_id: string;
  file: File;
}