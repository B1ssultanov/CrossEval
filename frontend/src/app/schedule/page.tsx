"use client";

import { useEffect, useState } from "react";
import { fetchSchedule, Assignment } from "@/api/schedule";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import { Loader, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function SchedulePage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await fetchSchedule();
        setAssignments(response.assignments);
      } catch (err) {
        setError("Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const handleEventClick = (eventInfo: any) => {
    const { assignmentId, courseId, type } = eventInfo.event.extendedProps;
    const path =
      type === "submit"
        ? `/course/${courseId}/cross-check-submit/${assignmentId}`
        : `/course/${courseId}/cross-check-review/${assignmentId}`;
    router.push(path);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-12 animate-spin text-gray-500" />
      </div>
    );

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  // Format assignments for FullCalendar
  const events = assignments.map((assignment) => {
    const courseId = assignment.id ?? 58; // Replace dynamically if available

    const isSubmitPeriod = new Date(assignment.end_date) >= new Date();
    const start = isSubmitPeriod ? assignment.start_date : assignment.end_date;
    const end = isSubmitPeriod
      ? assignment.end_date
      : assignment.end_cross_date;
    const type = isSubmitPeriod ? "submit" : "review";

    return {
      title: `${assignment.title} (${assignment.evaluation_method})`,
      start,
      end,
      assignmentId: assignment.id,
      courseId,
      type,
      deadline: format(new Date(assignment.end_date), "MMM dd, yyyy"), // Add deadline
      courseName: assignment.title ?? "Unknown Course", // Add course name
    };
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <CalendarDays className="size-8 text-indigo-500" /> Assignment Schedule
      </h1>

      {/* Calendar Component */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          dayCellDidMount={(info) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date to prevent time mismatch

            const cellDate = new Date(info.date);
            if (cellDate < today) {
              info.el.style.backgroundColor = "#f3f4f6"; // Light gray for past days
              info.el.style.opacity = "0.5"; // Make past days appear faded
            }
          }}
          eventDidMount={(info) => {
            info.el.style.cursor = "pointer"; // Change cursor to pointer on hover
          }}
          eventContent={(eventInfo) => {
            const evaluationMethod = eventInfo.event.title.includes(
              "Cross-check"
            )
              ? "cross-check"
              : "system-check";

            return (
              <div
                className={`p-2 border-l-4 rounded shadow-md ${
                  evaluationMethod === "cross-check"
                    ? "bg-green-100 border-green-500"
                    : "bg-indigo-100 border-indigo-500"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    evaluationMethod === "cross-check"
                      ? "text-green-700"
                      : "text-indigo-700"
                  }`}
                >
                  {eventInfo.event.title}
                </p>
                <p className="text-xs text-gray-600">
                  Deadline:{" "}
                  {eventInfo.event.extendedProps.deadline || "No deadline"}
                </p>
                <p className="text-xs text-gray-500">
                  Course:{" "}
                  {eventInfo.event.extendedProps.courseName || "Unknown"}
                </p>
              </div>
            );
          }}
        />
      </div>

      {/* List of Assignments */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Assignments</h2>

        {assignments.filter((assignment) => {
          const now = new Date();
          return (
            new Date(assignment.start_date) >= now &&
            new Date(assignment.end_date) >= now
          );
        }).length === 0 ? (
          <p className="text-gray-500 text-center">
            No upcoming assignments yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments
              .filter((assignment) => {
                const now = new Date();
                return (
                  new Date(assignment.start_date) >= now &&
                  new Date(assignment.end_date) >= now
                );
              })
              .slice(0, 3) // Limit to 3 assignments
              .map((assignment) => {
                const courseId = 58; // Replace dynamically if available
                const isSubmitPeriod =
                  new Date(assignment.end_date) >= new Date();
                const link = isSubmitPeriod
                  ? `/course/${courseId}/cross-check-submit/${assignment.id}`
                  : `/course/${courseId}/cross-check-review/${assignment.id}`;

                return (
                  <Card key={assignment.id} className="p-4 border shadow-md">
                    <CardContent>
                      <h3 className="text-xl font-semibold text-indigo-500">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600">
                        {assignment.evaluation_method}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Weight:{" "}
                        <span className="font-medium">
                          {assignment.weight} points
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        {isSubmitPeriod
                          ? `Cross-check Submit: ${format(
                              new Date(assignment.start_date),
                              "MMM dd"
                            )} - ${format(
                              new Date(assignment.end_date),
                              "MMM dd"
                            )}`
                          : `Cross-check Review: ${format(
                              new Date(assignment.end_date),
                              "MMM dd"
                            )} - ${format(
                              new Date(assignment.end_cross_date),
                              "MMM dd"
                            )}`}
                      </p>
                      <Button
                        variant="indigo"
                        className="mt-4 w-full"
                        onClick={() => router.push(link)}
                      >
                        View Assignment
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
