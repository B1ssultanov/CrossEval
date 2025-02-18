"use client";

import { useState } from "react";
import { Assignment } from "@/api/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader, UploadCloud } from "lucide-react";
import { submitAssignmentAnswer } from "@/api/courses";
import { useRouter } from "next/navigation";
interface AssignmentSubmissionProps {
  assignment: Assignment;
  courseId: string
}

export default function AssignmentSubmission({ assignment, courseId }: AssignmentSubmissionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Error", description: "Please upload a file before submitting.", variant: "destructive" });
      return;
    }
  
    setLoading(true);
  
    try {
      await submitAssignmentAnswer({
        assignment_id: assignment.id.toString(),
        comment,
        answer_file: file,
      });
  
      toast({ title: "Success", description: "Assignment submitted successfully!", variant:'success' });
      setComment("");
      setFile(null);
      router.push(`/course/${courseId}/`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit the assignment.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-gray-800">
      {/* Left Side - Assignment Info */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-xl font-bold text-indigo-500">Description</h3>
        <p className="text-gray-600 mt-2 border rounded-lg px-2 min-h-20">{assignment.description}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-indigo-500">Rubrics</h3>
          <p className="text-gray-500 border rounded-lg mt-2 px-2 min-h-20">Rubrics ID: {assignment.rubrics_id}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-indigo-500">Criteria</h3>
          <ul className="list-disc list-inside text-gray-600">
            {assignment.criteria.map((c, index) => (
              <li key={index}>{c.name} - {c.weight} points</li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold text-indigo-500">Deadline</h3>
          <p className="text-gray-600">{assignment.end_date}</p>
        </div>
      </div>

      {/* Right Side - Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-indigo-500">Submit Your Work</h3>

        {/* File Drop */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center text-sm text-gray-600 py-4 hover:bg-mylightcyan transition-colors duration-100 rounded-lg">
            <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
            <span>Drop file here or click to upload</span>
            {file && <span className="mt-2">{file.name}</span>}
          </label>
        </div>

        {/* Comment Section */}
        <h3 className="text-xl font-semibold text-indigo-500 ">Leave a comment</h3>
        <Textarea
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit Button */}
        <Button type="submit" variant={'indigo'} className="w-full flex items-center justify-center" disabled={loading}>
          {loading ? <Loader className="w-5 h-5 animate-spin mr-2" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
}
