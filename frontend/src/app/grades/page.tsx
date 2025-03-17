"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchUserCourses, fetchStudentGrades, fetchSupervisorGrades, Course } from "@/api/grades";
import { Loader, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function GradesPage() {
  const { toast } = useToast();
  const mode = useSelector((state: RootState) => state.mode.mode); // Get mode from Redux
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
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

  const handleCourseSelect = (courseId: number) => {
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

      {/* Course Selector */}
      <div className="mb-6">
        <Select onValueChange={(value) => handleCourseSelect(Number(value))}>
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

      {/* Grades Table */}
      {selectedCourse && (
        <>
          {mode === "student" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grades.map((grade) => (
                <Card key={grade.title} className="p-4 border shadow-md">
                  <CardContent>
                    <h3 className="text-xl font-semibold text-indigo-500">{grade.title}</h3>
                    <p className="text-gray-600">Grade: {grade.grade}</p>
                    <p className="text-gray-500 text-sm">Weight: {grade.weight}</p>
                    <p className="text-gray-500 text-sm">Percentage: {grade.percentage}</p>
                    <p className="text-gray-500 text-sm">Status: {grade.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {grades.map((student) => (
                <Card key={student.university_id} className="p-4 border shadow-md">
                  <CardContent>
                    <h3 className="text-xl font-semibold text-indigo-500">{student.name} {student.surname}</h3>
                    <p className="text-gray-500">ID: {student.university_id}</p>
                    {student.assignments.map((assignment: { title: boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Key | null | undefined; grade: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                        <div key={`${assignment.title}-${new Date().getTime()}`} className="mt-2 border-t pt-2">
                        <p className="text-gray-700">{String(assignment.title)}</p>
                        <p className="text-gray-500 text-sm">Grade: {assignment.grade}</p>
                        <p className="text-gray-500 text-sm">Status: {assignment.status}</p>
                        </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
