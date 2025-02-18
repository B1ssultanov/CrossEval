"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinCourse } from "@/api/courses"; // API call to join a course
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { triggerFetch } from "@/store/slices/triggerFetchSlice"; // ✅ Import trigger action
import { AppDispatch } from "@/store";

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinCourseModal({ isOpen, onClose }: JoinCourseModalProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>(); // ✅ Redux dispatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await joinCourse(inviteCode);

      toast({
        title: "Course joined",
        description: "You have successfully joined the course.",
      });

      dispatch(triggerFetch()); // ✅ Notify Redux that courses should be refetched
      onClose(); // ✅ Close modal
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join course",
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
          <DialogTitle>Join a Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="indigo" type="submit" disabled={isLoading}>
              {isLoading ? "Joining..." : "Join Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
