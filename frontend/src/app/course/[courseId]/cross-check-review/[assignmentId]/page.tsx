"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchAssignment,
  fetchCourseById,
} from "@/api/courses";
import { CourseFetchById, Assignment } from "@/types/courses";
import SingleAssignment from "@/components/page-components/course-page/single-assignment"; // ✅ Import the new component
import { Loader } from "lucide-react";
import AssignmentSubmission from "@/components/page-components/course-page/assignment-submission"; // Import the new component

export default function CrossCheckSubmitPage() {
  const { courseId, assignmentId } = useParams<{
    courseId: string;
    assignmentId: string;
  }>();

  // State with proper types
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<CourseFetchById | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    const loadCourse = async () => {
      try {
        const courseData = await fetchCourseById(Number(courseId));
        setCourse(courseData);
        console.log('courseData', courseData)
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

      {/* ✅ Pass assignment to the AssignmentTable component */}
      {assignment && <SingleAssignment assignment={assignment} isReview={true} />}

      {assignment && <AssignmentSubmission courseId={courseId} assignment={assignment} />}

    </div>
  );
}
