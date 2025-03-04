import { useState } from "react";

const CourseCode = ({ inviteCode }: { inviteCode: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset text after 3 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div 
      className="mt-6 bg-white p-4 rounded-lg border shadow w-fit cursor-pointer hover:bg-gray-100 transition"
      onClick={handleCopy}
    >
      <div className="text-lg flex flex-col items-center justify-center space-y-1">
        <p className="text-sm font-semibold">Course Code</p>{" "}
        <p className="inline-block text-sky-600 hover:underline undeline px-6 rounded-lg">
          {/* {copied ? "Copied!" : inviteCode} */} open
        </p>
      </div>
    </div>
  );
};

export default CourseCode;
