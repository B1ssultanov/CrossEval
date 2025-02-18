"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCourse } from "@/api/courses";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { triggerFetch } from "@/store/slices/triggerFetchSlice"; // ✅ Import trigger action
import { AppDispatch } from "@/store";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>(); // ✅ Redux dispatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createCourse({ id, name, group });

      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });

      dispatch(triggerFetch()); // ✅ Notify Redux that courses should be refetched
      onClose(); // ✅ Close modal
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="id">Course ID</Label>
              <Input id="id" value={id} onChange={(e) => setId(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="group">Group</Label>
              <Input id="group" value={group} onChange={(e) => setGroup(e.target.value)} required />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="indigo" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
