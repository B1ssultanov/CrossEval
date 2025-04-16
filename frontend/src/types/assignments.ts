//below for getting the assignments to review by this endpoint: /cross_review/check?assignment_id=59&reviewer_id=104
export interface AnswerInfo {
  answer_review_id: number;
  answer_id: number;
  grade: number;
  criteria: string | null;
  comment: string | null;
  status: string;
}

export interface GetAssignmentsToReviewResponse {
  answers_info: AnswerInfo[];
}


//for submission review
export interface AnswerReviewInfo {
  id: number;
  answer_id: number;
  reviewer_id: number;
  criteria_grade: string;
  comment: string;
  created_at: string | null;
  updated_at: string;
}



//below is the interface for the assignment review response for this api endpoint: http://127.0.0.1:8000/api/v1/cross_review/{answer_review_id}
export interface GetReviewAnswerInfo {
  status: string;
  file_id: number;
  comment: string | null;
  grade: number;
  grade_date: string | null;
}

export interface AssignmentInfo {
  id: number;
  title: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  weight: number;
  evaluation_method: string;
  criteria: string; // JSON string
  rubrics_id: number;
  status: string;
  end_cross_date: string;
}

export interface AssignmentReviewResponse {
  answer_info: GetReviewAnswerInfo;
  assignment_info: AssignmentInfo;
}

export interface SubmitReviewPayload {
  answer_id: number;
  reviewer_id: number;
  criteria: string;
  comment?: string;
}