"use client";

import { useEffect, useState } from "react";
import {
  fetchAssignmentReview,
  submitAssignmentReview,
} from "@/api/assignment-review";
import { AssignmentReviewResponse } from "@/types/assignments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader, Send } from "lucide-react";
import { downloadRubricsFile } from "@/api/courses";
import { downloadSubmissionFile } from "@/api/courses";

interface AssignmentReviewProps {
  status: string | null;
  courseId: string;
  answerReviewId: number;
  reviewerId: number;
  answerId: number;
}

export default function AssignmentReview({
  status,
  courseId,
  answerReviewId,
  reviewerId,
  answerId,
  onReviewSubmitted,
}: AssignmentReviewProps & { onReviewSubmitted: () => void }) {
  const { toast } = useToast();
  const [reviewData, setReviewData] = useState<AssignmentReviewResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [criteriaGrades, setCriteriaGrades] = useState<Record<string, number>>(
    {}
  );
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loadReviewData = async () => {
      setLoading(true); // Reset loading each time a new student is selected
      setReviewData(null); // Ensure fresh data load
      try {
        const data = await fetchAssignmentReview(answerReviewId);
        setReviewData(data);

        // Reset grading inputs
        const parsedCriteria = JSON.parse(data.assignment_info.criteria);
        const initialGrades: Record<string, number> = {};
        parsedCriteria.forEach((c: { name: string }) => {
          initialGrades[c.name] = 0;
        });

        setCriteriaGrades(initialGrades);
        setComment(""); // Reset comment when switching students
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load review data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (answerReviewId) {
      loadReviewData();
    }
  }, [answerReviewId]); // Refresh when answerReviewId changes

  // Функция для скачивания файла рубрик
  const handleDownloadRubrics = async () => {
    try {
      // Преобразуем rubrics_id к числу, если это нужно
      console.log(
        "Downloading rubrics for:",
        reviewData?.assignment_info?.title,
        Number(reviewData?.assignment_info?.rubrics_id)
      );
      await downloadRubricsFile(
        reviewData?.assignment_info?.title || "",
        Number(reviewData?.assignment_info?.rubrics_id),
        "rubrics"
      );
      toast({
        title: "Success",
        description: "Rubrics downloaded successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download rubrics file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSubmission = async () => {
    try {
      // Преобразуем rubrics_id к числу, если это нужно
      console.log(
        "Downloading submission file for:",
        reviewData?.assignment_info?.title,
        Number(reviewData?.answer_info?.file_id)
      );
      await downloadSubmissionFile(
        reviewData?.assignment_info?.title || "",
        Number(reviewData?.assignment_info?.rubrics_id),
        "submission"
      );
      toast({
        title: "Success",
        description: "Submission downloaded successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download Submission file",
        variant: "destructive",
      });
    }
  };

  const handleCriteriaChange = (criteriaName: string, value: number) => {
    setCriteriaGrades((prev) => ({ ...prev, [criteriaName]: value }));
  };
  const handleSubmitReview = async () => {
    if (!reviewData) return;

    setSubmitting(true);
    try {
      const criteriaString = Object.entries(criteriaGrades)
        .map(([key, value]) => `${key}:${value}`)
        .join(",");

      const finalComment = comment?.trim() || "No comment provided"; // Ensure it's always a string

      console.log("Submitting review with:", {
        answer_id: answerId,
        reviewer_id: reviewerId,
        criteria: criteriaString,
        comment,
      });

      await submitAssignmentReview({
        answer_id: answerId,
        reviewer_id: reviewerId,
        criteria: criteriaString,
        comment: finalComment,
      });

      toast({
        title: "Success",
        description: "Review submitted successfully!",
        variant: "success",
      });
      onReviewSubmitted();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Loader className="size-12 animate-spin text-gray-500" />
      </div>
    );

  if (!reviewData) return <p className="text-red-500">No data available.</p>;


  const { assignment_info, answer_info } = reviewData;
  const parsedCriteria = JSON.parse(assignment_info.criteria);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-gray-800">
      {/* Left Side - Assignment Details */}
      <div className="bg-white p-6 rounded-lg border-r-2">
        <h3 className="text-xl font-bold text-indigo-500">
          {assignment_info.title}
        </h3>
        <p className="text-gray-600 mt-2 border rounded-lg px-2 py-2">
          {assignment_info.description}
        </p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-500">Rubrics</h3>
          <Button
            variant="ghost"
            onClick={handleDownloadRubrics}
            className="underline text-mycyan font-bold text-sm"
          >
            Download Rubrics <Download />
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-500">Criteria</h3>
          <ul className="list-disc list-inside text-gray-600">
            {parsedCriteria.map(
              (c: { name: string; weight: number }, index: number) => (
                <li key={index}>
                  {c.name} - {c.weight} points
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* <div className="h-full w-1 bg-gray-400"></div> */}
      {/* Right Side - Review Form */}
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-indigo-500">
          Student's Submission
        </h3>
        <p className="text-gray-600 mt-2">{answer_info.comment}</p>

        <Button
          variant="ghost"
          onClick={handleDownloadSubmission}
          className="underline text-mycyan font-bold text-sm"
        >
          Download Submission <Download />
        </Button>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-500">
            Evaluate Criteria
          </h3>
          {parsedCriteria.map((c: { name: string }) => (
            <div key={c.name} className="mt-2 flex items-center">
              <p className="text-gray-700 w-11/12">{c.name}</p>
              <Input
                type="number"
                min={0}
                max={100}
                className="w-60"
                value={criteriaGrades[c.name]}
                onChange={(e) =>
                  handleCriteriaChange(c.name, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-500">
            Final Comment
          </h3>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmitReview}
          disabled={submitting || status !== "To Check"}
          variant={"indigo"}
          className="w-full mt-4 flex items-center"
        >
          {submitting ? (
            <Loader className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Send className="mr-2" />
          )}{" "}
          Submit Review
        </Button>
      </div>
    </div>
  );
}
