"use client";

import { useParams } from "next/navigation";

export default function CreateAssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();

  return (
    <div className="p-6 flex flex-col w-full">
      <h1 className="text-2xl font-bold place-self-center mb-10 text-dark-700">Cross-check-page for assignment {assignmentId}</h1>
    </div>
  );
}
