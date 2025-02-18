"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchAssignment,
  fetchCourseById,
  Assignment,
  Course,
} from "@/api/courses";
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
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          <span>{course?.name}</span>
        </div>

        <div>
          <h1 className="text-2xl">Cross-Check: Submit</h1>
        </div>

        <div>
          <p>Course ID</p>
          <span>
            {course?.code} {course?.course_group}
          </span>
        </div>
      </section>

      {/* ✅ Pass assignment to the AssignmentTable component */}
      {assignment && <SingleAssignment assignment={assignment} />}

      {assignment && <AssignmentSubmission courseId={courseId} assignment={assignment} />}
{/*       
      <h1 className="text-xl font-bold mt-6">Cross-Check Submission</h1>
      <p><strong>Course ID:</strong> {courseId}</p>
      <p><strong>Assignment ID:</strong> {assignment?.id}</p>
      <p><strong>Title:</strong> {assignment?.title}</p>
      <p><strong>Type:</strong> {assignment?.type}</p>
      <p><strong>Description:</strong> {assignment?.description}</p>
      <p><strong>Start Date:</strong> {assignment?.start_date}</p>
      <p><strong>End Date:</strong> {assignment?.end_date}</p>
      <p><strong>Weight:</strong> {assignment?.weight}</p>
      <p><strong>Cross Check:</strong> {assignment?.isCrossCheck ? "Yes" : "No"}</p>
      <p><strong>Status:</strong> {assignment?.status}</p>

      <h3 className="mt-4 text-lg font-semibold">Criteria:</h3>
      <ul className="list-disc ml-6">
        {assignment?.criteria.map((c, index) => (
          <li key={index}>{c.name} - {c.weight} points</li>
        ))}
      </ul> */}
    </div>
  );
}
