"use client";

import { useParams } from "next/navigation";
import AssignmentForm from "@/components/forms/create-assignment-form";
import { useState, useEffect } from "react";
import { fetchCourseById } from "@/api/courses";
import { Loader } from "lucide-react";

export default function CreateAssignmentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [courseGroup, setCourseGroup] = useState<string>("");

  useEffect(() => {
    const getCourseInfo = async () => {
      const response = await fetchCourseById(Number(courseId));
      console.log("response", response);
      setCourseName(response.course.name);
      setCourseCode(response.course.code);
      setCourseGroup(response.course.course_group);
    };

    getCourseInfo();
  }, []);

  return (
    <div className="p-6 flex flex-col w-full">
      <div className="flex w-full justify-between items-start px-6 mb-5">
        <div>
          <h2 className="font-bold text-mylightgray">Course</h2>
          <p className="text-lg font-bold">
            {courseName ? courseName : <Loader className="animate-spin" />}
          </p>
        </div>
        <div className="text-xl font-bold flex flex-col items-center max-w-">
          <h1 className="text-gray-700 text-center">
            Creation of an assignment for the course{" "}
            <span className="text-indigo-500">{courseName ? courseName : ""}</span>
          </h1>
          <p>{courseName ? "" : <Loader className="animate-spin" />}</p>
        </div>
        <div className="text-end">
          <h2 className="font-bold text-mylightgray">Course ID</h2>
          <div className="flex flex-col items-end text-lg font-bold">
            <p className="truncate w-[130px]">
              {courseCode ? courseCode : <Loader className="animate-spin" />}
            </p>
            <p>{courseGroup ? courseGroup : ""}</p>
          </div>
        </div>
      </div>
      <AssignmentForm courseId={Number(courseId)} />
    </div>
  );
}
