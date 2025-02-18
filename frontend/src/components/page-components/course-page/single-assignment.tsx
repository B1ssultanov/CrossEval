import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
import { statusColors, typeColors } from "@/utils/colors";
import { Assignment } from "@/api/courses";

interface SingleAssignmentProps {
  assignment: Assignment;
}

export default function SingleAssignment({ assignment }: SingleAssignmentProps) {
  return (
    <Table className="mt-6">
      <TableHeader className="border-b">
        <TableRow className="border-none">
          <TableHead className="w-12 text-center border-none">#</TableHead>
          <TableHead className="text-center border-none">Status</TableHead>
          <TableHead className="border-none">Title</TableHead>
          <TableHead className="text-center border-none">Type</TableHead>
          <TableHead className="text-center border-none">Start Date</TableHead>
          <TableHead className="text-center border-none">End Date</TableHead>
          <TableHead className="text-center border-none">Weight</TableHead>
          <TableHead className="w-12 border-none"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          key={assignment.id}
          className="hover:bg-sky-100 h-16 bg-sky-200 transition-all cursor-pointer text-gray-700"
        >
          <TableCell className="text-center rounded-l-xl">
            {assignment.id}
          </TableCell>

          {/* Status Badge */}
          <TableCell className="text-center">
            <span
              className={`px-2 py-1 rounded-lg text-sm font-bold ${
                statusColors[assignment.status] || ""
              }`}
            >
              {assignment.status}
            </span>
          </TableCell>

          {/* Title */}
          <TableCell className="font-bold text-gray-800">
            {assignment.title}
          </TableCell>

          {/* Type Badge */}
          <TableCell className="text-center">
            <span
              className={`px-2 py-1 rounded-full text-sm font-bold ${
                typeColors[assignment.type] || ""
              }`}
            >
              {assignment.type}
            </span>
          </TableCell>

          {/* Start Date */}
          <TableCell className="text-center">{assignment.start_date}</TableCell>

          {/* End Date */}
          <TableCell className="text-center">{assignment.end_date}</TableCell>

          {/* Weight */}
          <TableCell className="text-center font-semibold">
            {assignment.weight}p
          </TableCell>

          {/* Selection Checkbox */}
          <TableCell className="text-center rounded-r-xl">
            <CheckCircle className="text-green-500 w-5 h-5 cursor-pointer hover:scale-110 transition-all" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
