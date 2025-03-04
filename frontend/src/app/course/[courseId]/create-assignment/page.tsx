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
      <div className="flex w-full justify-between items-center px-6 mb-5">
        <div>
          <h2 className="font-bold text-mylightgray">Course</h2>
          <p className="text-lg font-bold">
            {courseName ? courseName : <Loader className="animate-spin" />}
          </p>
        </div>
        <div className="text-2xl font-bold place-self-center flex flex-col items-center ">
          <h1 className="text-indigo-500">
            Creation of an assignment for the course{" "}
            {courseName ? courseName : ""}
          </h1>
          <p>{courseName ? "" : <Loader className="animate-spin" />}</p>
        </div>
        <div>
          <h2 className="font-bold text-mylightgray">Course ID</h2>
          <p className="text-lg font-bold">
            {courseCode ? courseCode : <Loader className="animate-spin" />}{" "}
            {courseGroup ? courseGroup : ""}
          </p>
        </div>
      </div>
      <AssignmentForm courseId={Number(courseId)} />
    </div>
  );
}
