import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";

const CourseCode = ({ inviteCode }: { inviteCode: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset copy state after 3 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Dialog>
      {/* Trigger to open the dialog */}
      <DialogTrigger asChild>
        <div 
          className="mt-6 bg-white p-4 rounded-lg border shadow w-fit cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="text-lg flex flex-col items-center justify-center space-y-1">
            <p className="text-sm font-semibold">Course Code</p>
            <p className="inline-block text-sky-600 hover:underline px-6 rounded-lg">
              Open
            </p>
          </div>
        </div>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Course Invite Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          {/* Large text invite code */}
          <p className="text-3xl font-semibold text-gray-800 border rounded-lg px-6 py-3 bg-gray-100">
            {inviteCode}
          </p>

          {/* Copy Button */}
          <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2">
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Clipboard className="w-5 h-5" />}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCode;
