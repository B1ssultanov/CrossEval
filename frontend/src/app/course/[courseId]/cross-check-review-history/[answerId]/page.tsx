"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAnswerInfo, type AnswerReviewInfo } from "@/api/grades";
import { Loader } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { recheckAnswer } from "@/api/grades";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CrossCheckReviewHistoryPage() {
  const { courseId, answerId } = useParams<{
    courseId: string;
    answerId: string;
  }>();

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnswerReviewInfo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGrade, setNewGrade] = useState("");

  const averageGrade =
    data.length > 0
      ? (data.reduce((sum, r) => sum + r.grade, 0) / data.length).toFixed(2)
      : null;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAnswerInfo(Number(answerId));
        setData(res);
      } catch (err) {
        toast({
          title: "Ошибка",
          description: String(err),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (answerId) load();
  }, [answerId]);

  const parseCriteria = (criteriaString: string | null) => {
    if (!criteriaString) return [];
    return criteriaString.split(",").map((c) => {
      const [title, value] = c.split(":");
      return { title: title.trim(), value: Number(value.trim()) };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin size-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Grading History for Answer #{answerId}
      </h1>
      <div className="grid gap-6">
        {data.map((review) => {
          const criteriaList = parseCriteria(review.criteria);
          return (
            <Card key={review.answer_review_id} className="p-4">
              <h2 className="text-lg font-semibold mb-2">
                Review ID: {review.answer_review_id}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Status: {review.status}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criterion</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteriaList.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <p className="font-medium">
                  Comment:{" "}
                  <span className="text-gray-700">{review.comment ?? "—"}</span>
                </p>
                <p className="font-medium mt-1">
                  Total Grade:{" "}
                  <span className="text-indigo-600 font-bold">
                    {review.grade}
                  </span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>
      {averageGrade && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold">
            Average Grade:{" "}
            <span className="text-indigo-600">{averageGrade}</span>
          </p>
          <Button onClick={() => setDialogOpen(true)} variant="indigo">
            Change Grade
          </Button>
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Grade</DialogTitle>
            <DialogDescription>
              Enter a new grade for this answer.
            </DialogDescription>
          </DialogHeader>

          <Input
            type="number"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            placeholder="Enter new grade"
          />

          <DialogFooter className="mt-4">
            <Button
              onClick={async () => {
                try {
                  const gradeNumber = parseFloat(newGrade);
                  if (isNaN(gradeNumber)) {
                    toast({ title: "Invalid grade", variant: "destructive" });
                    return;
                  }

                  const message = await recheckAnswer(
                    Number(answerId),
                    gradeNumber
                  );
                  toast({ title: "Success", description: message });
                  setDialogOpen(false);
                } catch (error) {
                  toast({
                    title: "Error updating grade",
                    description: (error as Error).message,
                    variant: "destructive",
                  });
                }
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
