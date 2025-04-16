"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { uploadSyllabus } from "@/api/courses";
import { UploadCloud } from "lucide-react";

interface CreateCourseSyllabusProps {
  courseId: string;
}

export default function CreateCourseSyllabus({ courseId }: CreateCourseSyllabusProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadSyllabus({
        course_id: courseId,
        file,
      });

      toast({
        title: "Success",
        description: "Syllabus uploaded successfully!",
        variant: "success",
      });
      setFile(null);
      setOpen(false);
    } catch (error) {
      console.error("Error uploading syllabus:", error);
      toast({
        title: "Error",
        description: "Failed to upload the syllabus.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg border shadow w-fit">
      <div className="text-lg flex flex-col items-center justify-center space-y-1">
        <p className="text-sm font-semibold">Syllabus</p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="cyan"
              className="rounded-lg h-7 bg-[#b9e5ff] text-[#2789c5] font-bold"
            >
              Add
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-indigo-500">Add Syllabus</DialogTitle>
              <DialogDescription>
                Please select the file you want to upload as syllabus.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {/* Dropzone-стиль. Input спрятан, а label — зона для клика/drag-n-drop */}
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-6 text-center w-full h-32 text-gray-500 cursor-pointer hover:bg-gray-50"
              >
                <UploadCloud className="h-8 w-8 text-indigo-500" />
                {file ? (
                  <span className="text-sm font-medium text-gray-600">{file.name}</span>
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    Drag &amp; drop a file or click to browse
                  </span>
                )}
              </label>
              <Input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <DialogFooter>
              <Button variant="indigo" onClick={handleSubmit}>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
