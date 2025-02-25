import { Button } from "@/components/ui/button";

interface CreateCourseSyllabusProps {
  courseId: string;
}

const CreateCourseSyllabus = ( {courseId}: CreateCourseSyllabusProps ) => {
  return (
    <div 
      className="mt-6 bg-white p-4 rounded-lg border shadow w-fit cursor-pointer hover:bg-gray-100 transition"
    >
      <div className="text-lg flex flex-col items-center justify-center space-y-1">
        <p className="text-sm font-semibold">Add Syllabus:</p>{" "}
        <Button variant={'cyan'} className="rounded-lg h-7 bg-[#b9e5ff] text-[#2789c5] font-bold">Add</Button>
      </div>
    </div>
  );
}

export default CreateCourseSyllabus;