"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCourseById } from "@/api/courses";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import CourseCode from "@/components/page-components/course-page/course-code";
import CourseSyllabus from "@/components/page-components/course-page/course-syllabus";
import CreateCourseSyllabus from "@/components/page-components/course-page/create-course-syllabus";
import { CrossChecksTable } from "@/components/page-components/course-page/cross-check-table";
import { Course } from "@/types/courses";

interface Assignment {
  id: number;
  title: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  weight: number;
  status: string;
}

const CoursePage = () => {
  const { courseId } = useParams(); // Get course ID from URL
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        const data = await fetchCourseById(Number(courseId)); // Fetch course details
        setCourse(data.course);
        setAssignments(data.assignments);
        setRole(data.role);
        console.log(data.role);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
      }
    };

    loadCourseData();
  }, [courseId]);

  if (!course) {
    return (
      <div className="text-center text-lg mt-20">Loading course details...</div>
    );
  }

  return (
    <div className="p-6 pb-40">
      {/* Course Header */}
      <div className="relative w-full bg-blue-100 border-2 border-yellow-100 p-6 min-h-40 rounded-lg shadow-md flex items-center bg-[url('/assets/images/decoration/courseBg.jpg')] bg-no-repeat bg-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black">
            {course.code} {course.name}
          </h1>
          <h2 className="font-bold text-black text-xl">
            {course.course_group}
          </h2>
          <p className="text-gray-600">Teacher: {course.teacher_name}</p>
        </div>
      </div>

      {/* Course Info */}
      <section className="flex w-full justify-between items-center">
        <div className="flex item-center gap-3">
          <CourseCode inviteCode={course.invite_code} />
          {course?.syllabus_file_id ? (
            <CourseSyllabus syllabusId={course.syllabus_file_id} />
          ) : (
            <CreateCourseSyllabus courseId={courseId as string} />
          )}
        </div>

        {role === "Supervisor" && (
          <Link
            className="px-3 py-2 bg-mycyan text-white rounded-lg hover:bg-mycyan/80 transition-colors duration-100"
            href={`/course/${courseId}/create-assignment`}
          >
            Create assignment
          </Link>
        )}
      </section>

      {/* Assignments */}
      <CrossChecksTable
        courseId={courseId as string}
        assignments={assignments}
      />
    </div>
  );
};

export default CoursePage;
