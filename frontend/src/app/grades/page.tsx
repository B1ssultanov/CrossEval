// File: app/grades/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import {
  fetchUserCourses,
  fetchStudentGrades,
  fetchSupervisorGrades,
  Course,
} from "@/api/grades";
import type {
  AssignmentGrade,
  StudentGradesResponse,
  SupervisorStudent,
  SupervisorGradesResponse,
} from "@/api/grades";
import { Loader, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import cn from "classnames";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { exportSupervisorGrades } from "@/api/grades";
import FileDownload from "js-file-download"; // install via: npm i js-file-download

export default function GradesPage() {
  const { toast } = useToast();
  const mode = useSelector((state: RootState) => state.mode.mode);
  const router = useRouter();

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");

  const [studentGrades, setStudentGrades] = useState<AssignmentGrade[]>([]);
  const [supervisorStudents, setSupervisorStudents] = useState<
    SupervisorStudent[]
  >([]);
  const [assignmentTitles, setAssignmentTitles] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [page] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAnswerId, setPendingAnswerId] = useState<number | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const res = await fetchUserCourses(mode);
        setCourses(res.courses);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load courses.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [mode, toast]);

  const loadGrades = async (courseId: number) => {
    setLoading(true);
    try {
      if (mode === "student") {
        const res: StudentGradesResponse = await fetchStudentGrades(
          courseId,
          page,
          10
        );
        setStudentGrades(res.grades);
        setTotalPages(res.totalPage);
      } else {
        const res: SupervisorGradesResponse = await fetchSupervisorGrades(
          courseId,
          page,
          10
        );
        setSupervisorStudents(res.students);
        setTotalPages(res.totalPage);
        // Derive column order from the first student
        setAssignmentTitles(
          res.students[0]?.assignments.map((a) => a.title) ?? []
        );
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load grades.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (val: string) => {
    const id = Number(val);
    const course = courses.find((c) => c.id === id);
    if (!course) return;
    setSelectedCourse(id);
    setSelectedCourseName(course.name);
    loadGrades(id);
    console.log("page count for build: ", totalPages);
  };

  const getGradeClass = (g?: number) =>
    cn(
      "font-medium",
      g === undefined
        ? "text-gray-400"
        : g >= 50
        ? "text-green-600"
        : "text-red-600"
    );

  const onCellClick = (cell?: AssignmentGrade) => {
    if (!cell || cell.answer_id === undefined) return;
    setPendingAnswerId(cell.answer_id); // именно answer_id, а не assignment_id
    setDialogOpen(true);
  };
  
  const confirmDialog = () => {
    if (pendingAnswerId && selectedCourse) {
      router.push(
        `/course/${selectedCourse}/cross-check-review-history/${pendingAnswerId}`
      );
    } else {
      if (!pendingAnswerId) alert("No answer_id provided");
      if (!selectedCourse) alert("No course selected");
    }
    setDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-12 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <BookOpen className="size-8 text-indigo-500" /> Grades
      </h1>

      <div className="mb-6">
        <Select onValueChange={handleCourseSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourseName ? (
        <h2 className="text-lg font-bold mb-4">
          Selected Course:{" "}
          <span className="text-indigo-500">{selectedCourseName}</span>
        </h2>
      ) : (
        <p className="mb-4">Please select a course</p>
      )}

      {selectedCourse && (
        <Card className="p-6 shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {mode === "student" ? (
                  <>
                    <TableHead>Title</TableHead>
                    <TableHead>Grade</TableHead>
                    {/* <TableHead>Weight</TableHead> */}
                    {/* <TableHead>Percentage</TableHead> */}
                    <TableHead>Status</TableHead>
                    <TableHead>View</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    {/* <TableHead>University ID</TableHead> */}
                    {assignmentTitles.map((title) => (
                      <TableHead key={title}>{title}</TableHead>
                    ))}
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mode === "student"
                ? studentGrades.map((g) => (
                    <TableRow key={g.assignment_id}>
                      <TableCell>{g.title}</TableCell>
                      <TableCell>
                        {g.grade}/{g.weight.replace("%", "")}
                      </TableCell>
                      {/* <TableCell>{g.weight.replace('%','')}</TableCell> */}
                      {/* <TableCell>{g.percentage}</TableCell> */}
                      <TableCell>{g.status}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={"indigo"}
                          onClick={() =>
                            router.push(
                              `/course/${selectedCourse}/cross-check-review/${g.assignment_id}`
                            )
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : supervisorStudents.map((student, idx) => (
                    <TableRow key={student.university_id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {student.name} {student.surname}
                          </span>
                          <span className="text-sm text-gray-500">
                            {student.university_id}
                          </span>
                        </div>
                      </TableCell>
                      {assignmentTitles.map((title) => {
                        const cell = student.assignments.find(
                          (a) => a.title === title
                        );
                        return (
                          <TableCell
                            key={title}
                            className={cn(
                              getGradeClass(cell?.grade),
                              cell?.grade !== undefined
                                ? "cursor-pointer hover:bg-gray-100"
                                : ""
                            )}
                            onClick={() => onCellClick(cell)}
                          >
                            {cell?.grade
                              ? `${cell.grade}/${cell.weight.replace("%", "")}`
                              : "—"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {mode === "supervisor" && selectedCourse && (
            <div className="flex justify-end my-4">
              <Button
                onClick={() => setExportDialogOpen(true)}
                variant="outline"
              >
                Export Grades
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Download grades in csv Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Grades</DialogTitle>
            <DialogDescription>
              Select assignments to include in Excel export.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 max-h-64 overflow-y-auto">
            {assignmentTitles.map((title, idx) => (
              <div key={title} className="flex items-center space-x-2">
                <Checkbox
                  id={`assignment-${idx}`}
                  checked={selectedAssignments.includes(idx)}
                  onCheckedChange={(checked) => {
                    setSelectedAssignments((prev) =>
                      checked ? [...prev, idx] : prev.filter((i) => i !== idx)
                    );
                  }}
                />
                <Label htmlFor={`assignment-${idx}`}>{title}</Label>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={async () => {
                if (!selectedCourse) return;
                const selectedIds = selectedAssignments
                  .map(
                    (idx) =>
                      supervisorStudents[0]?.assignments[idx]?.assignment_id
                  )
                  .filter(Boolean) as number[];

                if (selectedIds.length === 0) {
                  toast({
                    title: "Select at least one assignment",
                    variant: "destructive",
                  });
                  return;
                }

                try {
                  const fileBlob = await exportSupervisorGrades(
                    selectedCourse,
                    selectedIds
                  );
                  FileDownload(
                    fileBlob,
                    `grades-course-${selectedCourse}.xlsx`
                  );
                  toast({ title: "Download started" });
                  setExportDialogOpen(false);
                } catch (err) {
                  toast({
                    title: "Export failed",
                    description: String(err),
                    variant: "destructive",
                  });
                }
              }}
            >
              Download Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ShadCN Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View grading history?</DialogTitle>
            <DialogDescription>
              Do you want to see the full grading history for this assignment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              No
            </Button>
            <Button onClick={confirmDialog}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
