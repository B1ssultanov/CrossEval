"use client";

import { useParams } from "next/navigation";
import AssignmentForm from "@/components/forms/create-assignment-form"; 

export default function CreateAssignmentPage() {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="p-6 flex flex-col w-full">
      <h1 className="text-2xl font-bold place-self-center mb-10 text-dark-700">Creation of an assignment for the course {courseId}</h1>
      <AssignmentForm courseId={Number(courseId)} />
    </div>
  );
}
