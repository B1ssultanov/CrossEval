"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { statusColors, typeColors } from "@/utils/colors";

interface Assignment {
  id: number;
  title: string;
  type: string;
  start_date: string;
  end_date: string;
  weight: number;
  status: string;
}
import Link from "next/link";

interface CrossChecksTableProps {
  courseId: string;
  assignments: Assignment[];
}

export function CrossChecksTable({
  courseId,
  assignments,
}: CrossChecksTableProps) {
  const router = useRouter();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Cross-checks:</h2>
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="border-b">
            <TableRow className="border-none">
              <TableHead className="w-12 text-center border-none">#</TableHead>
              <TableHead className="text-center border-none">Status</TableHead>
              <TableHead className="border-none">Title</TableHead>
              <TableHead className="text-center border-none">Type</TableHead>
              <TableHead className="text-center border-none">
                Start Date
              </TableHead>
              <TableHead className="text-center border-none">
                End Date
              </TableHead>
              <TableHead className="text-center border-none">Weight</TableHead>
              <TableHead className="w-12 border-none"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow
                key={assignment.id}
                onClick={() =>
                  router.push(
                    `/course/${courseId}/cross-check-submit/${assignment.id}`
                  )
                } // Use router navigation instead of wrapping in Link
                className={`hover:bg-sky-100 h-16 transition-all cursor-pointer border-none text-gray-700 ${
                  index % 2 === 0
                    ? "bg-gray-100 hover:bg-sky-200"
                    : "hover:bg-sky-200"
                }`}
              >
                <TableCell className="text-center rounded-l-xl border-none">
                  {index + 1}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="text-center border-none">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-bold ${
                      statusColors[assignment?.status] || ""
                    }`}
                  >
                    {assignment?.status}
                  </span>
                </TableCell>

                {/* Title */}
                <TableCell className="border-none font-bold text-gray-800">
                  {assignment.title}
                </TableCell>

                {/* Type Badge */}
                <TableCell className="text-center border-none">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-bold ${
                      typeColors[assignment.type] || ""
                    }`}
                  >
                    {assignment.type}
                  </span>
                </TableCell>

                {/* Start Date */}
                <TableCell className="text-center border-none">
                  {assignment.start_date}
                </TableCell>

                {/* End Date */}
                <TableCell className="text-center border-none">
                  {assignment.end_date}
                </TableCell>

                {/* Weight */}
                <TableCell className="text-center font-semibold border-none">
                  {assignment.weight}p
                </TableCell>

                {/* Selection Checkbox */}
                <TableCell className="text-center border-none rounded-r-xl">
                  <CheckCircle className="text-green-500 w-5 h-5 cursor-pointer hover:scale-110 transition-all" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
