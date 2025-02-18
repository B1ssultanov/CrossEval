"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const Courses = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);

  return (
    <div className="w-full h-[50vh] flex justify-center items-center animate-pulse">
      <Loader className="size-10 animate-spin text-gray-500 text-lg" />
    </div>
  );
};

export default Courses;
