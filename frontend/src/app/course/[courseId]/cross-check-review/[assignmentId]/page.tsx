"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAssignment, fetchCourseById } from "@/api/courses";
import { CourseFetchById, Assignment } from "@/types/courses";
import SingleAssignment from "@/components/page-components/course-page/single-assignment";
import { Loader } from "lucide-react";
import { fetchCurrentUser } from "@/api/user";
import AssignmentsToReview from "@/components/page-components/course-page/assignments-to-review";
import AssignmentReview from "@/components/page-components/course-page/assignment-review";

export default function CrossCheckReviewPage() {
  const { courseId, assignmentId } = useParams<{
    courseId: string;
    assignmentId: string;
  }>();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<CourseFetchById | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0); // New state
  const [selectedAssignmentStatus, setSelectedAssignmentStatus] = useState<
    string | null
  >("");

  const [selectedReviewCriteria, setSelectedReviewCriteria] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!assignmentId) return;

    const loadCourse = async () => {
      try {
        const courseData = await fetchCourseById(Number(courseId));
        setCourse(courseData);
      } catch (err) {
        console.error(err);
        setError("Failed to load course.");
      }
    };

    const loadAssignment = async () => {
      try {
        const assignmentData = await fetchAssignment(Number(assignmentId));
        setAssignment(assignmentData);
      } catch (err) {
        console.error(err);

        setError("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };

    const getUserId = async () => {
      try {
        const user = await fetchCurrentUser();
        setUserId(user.id);
      } catch (err) {
        console.error(err);

        setError("Failed to fetch user.");
      }
    };

    getUserId();
    loadCourse();
    loadAssignment();
  }, [assignmentId]);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center animate-pulse">
        <Loader className="size-12 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <section className="flex w-full justify-between items-start font-bold text-gray-700">
        <div>
          <p className="font-bold text-mylightgray">Course</p>
          <span className="text-lg font-bold">{course?.course?.name}</span>
        </div>

        <div>
          <h1 className="text-2xl">Cross-Check: Review</h1>
        </div>

        <div className="text-end">
          <p className="font-bold text-mylightgray">Course ID</p>
          <div className="flex flex-col items-end text-lg font-bold">
            <p className="truncate w-[130px]">{course?.course?.code}</p>
            <p>{course?.course?.course_group}</p>
          </div>
        </div>
      </section>

      {/* Assignment Details */}
      {assignment && (
        <SingleAssignment assignment={assignment} isReview={true} />
      )}

      {/* List of assignments to review */}
      {assignment && userId !== null && (
        <AssignmentsToReview
          setSelectedAssignmentStatus={setSelectedAssignmentStatus}
          assignmentId={Number(assignmentId)}
          reviewerId={userId}
          onSelectReview={setSelectedReviewId}
          onSelectReviewCriteria={setSelectedReviewCriteria} // New callback
          onAnswerIdSelect={setSelectedAnswerId}
          selectedReviewId={selectedReviewId}
          triggerRefresh={triggerRefresh}
        />
      )}

      {/* Assignment Review Section */}
      {userId && selectedReviewId !== null && selectedAnswerId !== null && (
        <AssignmentReview
          status={selectedAssignmentStatus}
          courseId={courseId}
          answerId={selectedAnswerId}
          reviewerId={userId}
          answerReviewId={selectedReviewId}
          existingCriteria={selectedReviewCriteria} // Pass the graded criteria here
          onReviewSubmitted={() => {
            setTriggerRefresh((prev) => prev + 1);
            setSelectedReviewId(null);
            setSelectedAnswerId(null);
          }}
        />
      )}
    </div>
  );
}
