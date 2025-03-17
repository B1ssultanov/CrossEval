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

  useEffect(() => {
    if (!assignmentId) return;

    const loadCourse = async () => {
      try {
        const courseData = await fetchCourseById(Number(courseId));
        setCourse(courseData);
      } catch (err) {
        setError("Failed to load course.");
      }
    };

    const loadAssignment = async () => {
      try {
        const assignmentData = await fetchAssignment(Number(assignmentId));
        setAssignment(assignmentData);
      } catch (err) {
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
      <section className="flex w-full justify-between items-center font-bold text-gray-700">
        <div>
          <p>Course</p>
          <span>{course?.course?.name}</span>
        </div>

        <div>
          <h1 className="text-2xl">Cross-Check: Review</h1>
        </div>

        <div>
          <p>Course ID</p>
          <span>
            {course?.course?.code} {course?.course?.course_group}
          </span>
        </div>
      </section>

      {/* Assignment Details */}
      {assignment && <SingleAssignment assignment={assignment} isReview={true} />}

      {/* List of assignments to review */}
      {assignment && userId !== null && (
        <AssignmentsToReview
          assignmentId={Number(assignmentId)}
          reviewerId={userId}
          onSelectReview={setSelectedReviewId}
          onAnswerIdSelect={setSelectedAnswerId}
          selectedReviewId={selectedReviewId}
        />
      )}

      {/* Assignment Review Section */}
      {userId && selectedReviewId !== null && selectedAnswerId !== null && (
        <AssignmentReview
          answerId={selectedAnswerId}
          courseId={courseId}
          reviewerId={userId}
          answerReviewId={selectedReviewId}
        />
      )}
    </div>
  );
}
