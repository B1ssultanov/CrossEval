
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchUserCourses, fetchStudentGrades, fetchSupervisorGrades, Course } from "@/api/grades";
import { Loader, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
export default function GradesPage() {
  const { toast } = useToast();
  const mode = useSelector((state: RootState) => state.mode.mode);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchUserCourses(mode);
        setCourses(response.courses);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load courses.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [mode]);

  const loadGrades = async (courseId: number) => {
    setLoading(true);
    try {
      let response;
      if (mode === "student") {
        response = await fetchStudentGrades(courseId, page, 10);
        setGrades(response.grades);
      } else {
        response = await fetchSupervisorGrades(courseId, page, 10);
        setGrades(response.students);
      }
      setTotalPages(response.totalPage);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load grades.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId: number, name:string) => {
    setSelectedCourseName(name);
    setSelectedCourse(courseId);
    loadGrades(courseId);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-12 animate-spin text-gray-500" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <BookOpen className="size-8 text-indigo-500" /> Grades
      </h1>

      <div className="mb-6">
        <Select onValueChange={(value) => handleCourseSelect(Number(value), courses.find(course => course.id === Number(value))?.name || "")}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.name} ({course.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourseName ? 
      <h2 className="text-lg font-bold">Selected Course: <span className="text-indigo-500">{selectedCourseName}</span> </h2>
      : <p>Please select a course</p>}

      {selectedCourse && (
        <Card className="p-6 shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {mode === "student" ? (
                  <>
                    <TableHead>Title</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>View</TableHead>

                  </>
                ) : (
                  <>
                    <TableHead>Student Name</TableHead>
                    <TableHead>University ID</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>View</TableHead>

                    {/* <TableHead>View</TableHead> */}
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mode === "student" ? (
                grades.map((grade) => (
                  <TableRow key={grade.title}>
                    <TableCell>{grade.title}</TableCell>
                    <TableCell>{grade.grade}</TableCell>
                    <TableCell>{grade.weight}</TableCell>
                    <TableCell>{grade.percentage}</TableCell>
                    <TableCell>{grade.status}</TableCell>
                    {/* http://localhost:3000/course/59/cross-check-review/55 */}
                    <Link href={`/course/${selectedCourse}/cross-check-review/${grade.assignment_id}`}>
                      <TableCell className="text-center bg-indigo-500 text-white rounded-lg">
                        
                          View
                      </TableCell>
                    </Link>
                  </TableRow>
                ))
              ) : (
                grades.map((student) =>
                  student.assignments.map((assignment: { title: string; grade: string; status: string }) => (
                    <TableRow key={`${student.university_id}-${assignment.title}`}>
                      <TableCell>{student.name} {student.surname}</TableCell>
                      <TableCell>{student.university_id}</TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.grade}</TableCell>
                      <TableCell>{assignment.status}</TableCell>
                      <Link href={`/course/${selectedCourse}/cross-check-review/>`}>
                      <TableCell className="text-center bg-indigo-500 text-white rounded-lg">
                        
                          View
                      </TableCell>
                    </Link>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}