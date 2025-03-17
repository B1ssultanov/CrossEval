import { backendApiInstance } from "./index";
import { AxiosError } from "axios";
import { GetAssignmentsToReviewResponse} from '@/types/assignments'
import { AnswerReviewInfo, AssignmentReviewResponse, SubmitReviewPayload } from '@/types/assignments'


// Fetch assignment review details
export const fetchAssignmentReview = async (answerReviewId: number): Promise<AssignmentReviewResponse> => {
  try {
    const response = await backendApiInstance.get(`/cross_review/${answerReviewId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch assignment review.");
    }
    throw error;
  }
};


// Submit assignment review

export const submitAssignmentReview = async (payload: SubmitReviewPayload): Promise<AnswerReviewInfo> => {
  try {
    const response = await backendApiInstance.post(`/answer_review/review/submit`, payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to submit review.");
    }
    throw error;
  }
};

// Fetch assignments that the student needs to evaluate
export const fetchAssignmentsToReview = async (assignmentId: number, reviewerId: number): Promise<GetAssignmentsToReviewResponse> => {
  try {
    const response = await backendApiInstance.get("/cross_review/check", {
      params: { assignment_id: assignmentId, reviewer_id: reviewerId },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch assignments to review");
    }
    throw error;
  }
};
