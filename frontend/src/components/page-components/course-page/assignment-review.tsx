
"use client";

import { useEffect, useState } from "react";
import {
  fetchAssignmentReview,
  submitAssignmentReview,
} from "@/api/assignment-review";
import { AssignmentReviewResponse } from "@/types/assignments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader, Send } from "lucide-react";
import { downloadRubricsFile, downloadSubmissionFile } from "@/api/courses";
import { Slider } from "@/components/ui/slider";

interface AssignmentReviewProps {
  status: string | null;
  courseId: string;
  answerReviewId: number;
  reviewerId: number;
  answerId: number;
  // New prop: the graded criteria string from a previous review if it exists.
  existingCriteria?: string | null;
}

export default function AssignmentReview({
  status,
  answerReviewId,
  reviewerId,
  answerId,
  existingCriteria = null,
  onReviewSubmitted,
}: AssignmentReviewProps & { onReviewSubmitted: () => void }) {
  const { toast } = useToast();
  const [reviewData, setReviewData] = useState<AssignmentReviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [criteriaGrades, setCriteriaGrades] = useState<Record<string, number>>({});
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    console.log(existingCriteria)
    const loadReviewData = async () => {
      setLoading(true);
      try {
        const data = await fetchAssignmentReview(answerReviewId);
        setReviewData(data);

        // Parse criteria definitions from the assignment info.
        const criteriaDefinition = JSON.parse(data.assignment_info.criteria);
        const initialGrades: Record<string, number> = {};

        // If the review is already checked and there are graded criteria from another user,
        // parse that criteria string to get the slider values.
        if (status === "Checked" && existingCriteria) {
          const gradeMapping = existingCriteria.split(",").reduce(
            (acc: Record<string, number>, item: string) => {
              const parts = item.split(":");
              if (parts.length === 2) {
                const [criteriaName, gradeStr] = parts;
                acc[criteriaName.trim()] = Number(gradeStr.trim());
              }
              return acc;
            },
            {} as Record<string, number>
          );
          criteriaDefinition.forEach((c: { name: string; weight: number }) => {
            initialGrades[c.name] =
              gradeMapping[c.name] !== undefined ? gradeMapping[c.name] : 0;
          });
          setComment(data.answer_info.comment ?? "");
        } else {
          // If there is no graded criteria, initialize all slider values to 0.
          criteriaDefinition.forEach((c: { name: string; weight: number }) => {
            initialGrades[c.name] = 0;
          });
          setComment("");
        }
        setCriteriaGrades(initialGrades);
      } catch (err) {
        console.error("Error loading review data:", err);
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
  }, [answerReviewId, status, existingCriteria, toast]);

  const handleDownloadRubrics = async () => {
    try {
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
      console.error("Error downloading rubrics:", error);
      toast({
        title: "Error",
        description: "Failed to download rubrics file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSubmission = async () => {
    try {
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
      console.error("Error downloading submission:", error);
      toast({
        title: "Error",
        description: "Failed to download Submission file",
        variant: "destructive",
      });
    }
  };

  const handleCriteriaChange = (criteriaName: string, value: number) => {
    // Do not allow changes if the review is already checked.
    if (status !== "Checked") {
      setCriteriaGrades((prev) => ({ ...prev, [criteriaName]: value }));
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewData) return;
    setSubmitting(true);
    try {
      const criteriaString = Object.entries(criteriaGrades)
        .map(([key, value]) => `${key}:${value}`)
        .join(",");
      const finalComment = comment?.trim() || "No comment provided";

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
      console.error("Error submitting review:", err);
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
  // console.log("Parsed Criteria:", parsedCriteria.toString());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-gray-800">
      {/* Left Side - Assignment Details */}
      <div className="bg-white p-6 rounded-lg border-r-2">
        <h3 className="text-xl font-bold text-indigo-500">{assignment_info.title}</h3>
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
            {parsedCriteria.map((c: { name: string; weight: number }, index: number) => (
              <li key={index}>
                {c.name} - {c.weight} points
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Review Form */}
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-indigo-500">Student&apos;s Submission</h3>
        <p className="text-gray-600 mt-2">{answer_info.comment}</p>
        <Button
          variant="ghost"
          onClick={handleDownloadSubmission}
          className="underline text-mycyan font-bold text-sm"
        >
          Download Submission <Download />
        </Button>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-500">Evaluate Criteria</h3>
          {parsedCriteria.map((c: { name: string; weight: number }) => (
            <div key={c.name} className="mt-4 flex justify-between items-center border-b pb-4">
              <p className="text-gray-700 mb-1">{c.name}</p>
              <div className="flex items-center space-x-4">
                <p className="w-6 text-sm font-medium text-gray-700">
                  {criteriaGrades[c.name]}
                </p>
                <Slider
                  value={[criteriaGrades[c.name]]}
                  max={c.weight}
                  min={0}
                  step={1}
                  onValueChange={([val]) => handleCriteriaChange(c.name, val)}
                  disabled={status === "Checked"}
                  className="w-64"
                />
                <span className="w-10 text-sm text-gray-500">/ {c.weight}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-500">Final Comment</h3>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={status === "Checked"}
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
          )}
          Submit Review
        </Button>
      </div>
    </div>
  );
}
