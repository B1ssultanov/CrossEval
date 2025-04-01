"use client";

import React, { useEffect, useState } from "react";
import { fetchCourseStudents, removeStudentFromCourse } from "@/api/courses";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface CourseStudentListProps {
  courseId: number;
}

export const CourseStudentList: React.FC<CourseStudentListProps> = ({ courseId }) => {
  const [students, setStudents] = useState<{ id: number; university_id: number; name: string; surname: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchCourseStudents(courseId);
      setStudents(data.students);
    } catch (error) {
      toast({ title: "Ошибка", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (studentId: number) => {
    try {
      setDeletingId(studentId);
      await removeStudentFromCourse(courseId, studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast({ title: "Successfully removed", description: "Student is removed from the course." });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div key={student.id} className="flex items-center justify-between border p-4 rounded-xl shadow-sm">
          <div>
            <p className="font-medium">
              {student.name} {student.surname}
            </p>
            <p className="text-sm text-muted-foreground">University ID: {student.university_id}</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deletingId === student.id}>
                {deletingId === student.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Удалить"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove the student from the course?</AlertDialogTitle>
                <AlertDialogDescription>
                 This action will remove student from your course, are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRemove(student.id)}>
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};
