import { useEffect, useState } from "react";
import { fetchAssignmentsToReview } from "@/api/assignment-review";
import { AnswerInfo } from "@/types/assignments";
import { Loader, User } from "lucide-react";
import clsx from "clsx";

// In AssignmentsToReview component (updated props interface)
interface AssignmentsToReviewProps {
  assignmentId: number;
  reviewerId: number;
  onSelectReview: (answerReviewId: number) => void;
  onSelectReviewCriteria: (criteria: string | null) => void;
  selectedReviewId: number | null;
  onAnswerIdSelect: (answerId: number) => void;
  setSelectedAssignmentStatus: (status: string) => void;
}

export default function AssignmentsToReview({
  onAnswerIdSelect,
  assignmentId,
  reviewerId,
  onSelectReview,
  onSelectReviewCriteria,
  selectedReviewId,
  triggerRefresh,
  setSelectedAssignmentStatus,
}: AssignmentsToReviewProps & { triggerRefresh: number }) {
  const [assignments, setAssignments] = useState<AnswerInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const response = await fetchAssignmentsToReview(
          assignmentId,
          reviewerId
        );
        setAssignments(response.answers_info);

        // Automatically select first "To Check" assignment when refreshing
        const firstToCheck = response.answers_info.find(
          (a) => a.status === "To Check"
        );
        if (firstToCheck) {
          setSelectedAssignmentStatus(firstToCheck.status);
        }
        if (firstToCheck) {
          onSelectReview(firstToCheck.answer_review_id);
          onAnswerIdSelect(firstToCheck.answer_id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load assignments to review.");
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [assignmentId, reviewerId, triggerRefresh]); // Ensure re-fetching works correctly

  // In your click handler:
  const handleStudentClick = (assignment: AnswerInfo) => {
    onSelectReview(assignment.answer_review_id);
    onAnswerIdSelect(assignment.answer_id);
    onSelectReviewCriteria(assignment.criteria);
    console.log("Criteria Grades:", assignment.criteria);
  };

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin size-8 text-indigo-500" />
          <p className="text-gray-600 text-lg font-bold">
            Loading assignments to review...{" "}
          </p>
        </div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="my-4">
      {/* <h2 className="text-lg font-semibold mb-2 text-gray-700">
        Assignments to Review:
      </h2> */}
      {assignments.every((assignment) => assignment.status === "Checked") ? (
        <h2 className="text-center text-xl font-bold text-green-600 mb-8 mt-8">
          You successfully Reviewed all the students for this assignment
        </h2>
      ) : (
        <h2 className="text-center text-xl font-bold text-gray-700 mb-8 mt-8">
          Choose the student to Review
        </h2>
      )}

      <div className="flex w-full justify-center gap-4">
        {assignments.map((assignment, index) => (
          <button
            key={assignment.answer_review_id}
            className={`p-4 border w-52 h-52 rounded-full flex flex-col items-center justify-center gap-2 ${
              selectedReviewId === assignment.answer_review_id
                ? "bg-indigo-300 text-white border-4 border-indigo-500"
                : "bg-gray-100"
            } ${
              assignment.status === "Checked" &&
              "bg-green-100 border-4 border-green-500"
            }`}
            onClick={() => {
              handleStudentClick(assignment);
              setSelectedAssignmentStatus(assignment.status);
            }}
          >
            <User
              className={clsx(
                `w-14 h-14 text-gray-400`,
                selectedReviewId === assignment.answer_review_id && "text-white"
              )}
            />
            <p className="font-semibold">Student #{index}</p>
            <p
              className={clsx(
                "text-xs text-gray-400",
                selectedReviewId === assignment.answer_review_id && "text-white"
              )}
            >
              Status: {assignment.status}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
