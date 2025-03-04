import { downloadRubricsFile } from "@/api/courses";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface CourseSyllabusProps {
  syllabusId: number;
}

interface CourseSyllabusProps {
  syllabusId: number; // ID файла для Syllabus
  courseTitle: string; // Название курса, для имени файла
}

const CourseSyllabus = ({ courseTitle, syllabusId }: CourseSyllabusProps) => {
  const { toast } = useToast();

  const handleDownloadSyllabus = async () => {
    try {
      await downloadRubricsFile(courseTitle, syllabusId, 'syllabus');
      toast({
        title: "Success",
        description: "Syllabus downloaded successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download syllabus file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg border shadow w-fit cursor-pointer hover:bg-gray-100 transition">
      <div className="text-lg flex flex-col items-center justify-center space-y-1">
        <p className="text-sm font-semibold">Course Syllabus:</p>{" "}
        <Button
          variant="ghost"
          onClick={handleDownloadSyllabus}
          className="underline text-mycyan font-bold text-sm flex items-center space-x-1"
        >
          <span>Download syllabus</span>
          <Download size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CourseSyllabus;
