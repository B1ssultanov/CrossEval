import { backendApiInstance } from "./index";
import { AxiosError } from "axios";

export interface Assignment {
  id: number;
  title: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  weight: number;
  evaluation_method: string;
  rubrics_id: number;
  status: string;
  end_cross_date: string;
}

export interface GetScheduleResponse {
  assignments: Assignment[];
}

// Fetch assignments from the schedule API
export const fetchSchedule = async (): Promise<GetScheduleResponse> => {
  try {
    const response = await backendApiInstance.get("/schedule");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch schedule.");
    }
    throw error;
  }
};
