"use client";

import { useEffect, useState } from "react";
import { fetchUserData } from "@/api/user";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { UserDataResponse } from "@/types/user";
import { SearchComponent } from "@/components/page-components/main-page/search-component";

interface Course {
  id: number;
  name: string;
  code: string;
  invite_code: string;
  course_group: string;
  teacher_name: string;
}

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const folderColors = ["folderBlue.svg", "folderGreen.svg", "folderRed.svg"]; // Folder images

  // Get mode from Redux store
  const mode = useSelector((state: RootState) => state.mode.mode);
  const shouldFetch = useSelector(
    (state: RootState) => state.fetchTrigger.shouldFetch
  );

  // Function to fetch user courses (includes search parameter)
  const fetchCourses = async (search?: string) => {
    setLoading(true);
    try {
      const userData = await fetchUserData(mode, search); // ✅ Pass search parameter
      setCourses(userData.courses);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(); // Fetch courses on mount and when shouldFetch changes
  }, [mode, shouldFetch]);

  return (
    <div className="pt-6 px-14 relative">
      {/* Search Component */}
      <div className="w-full flex items-center justify-center relative  ">
        <SearchComponent
          role={mode}
          onSearchResults={(data) => setCourses(data.courses)}
        />
      </div>

      <h1 className="text-lg font-bold mb-4 text-gray-700">My Courses</h1>

      {/* ✅ Show loading indicator while fetching */}
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="text-gray-500 text-lg animate-pulse flex flex-col items-center mt-20">
            <Loader className="animate-spin h-10 w-10" />
            <p>Loading courses...</p>
          </div>
        </div>
      ) : courses.length > 0 ? (
        <div className="flex justify-center md:justify-start gap-3 md:gap-6 flex-wrap">
          {courses.map((course, index) => (
            <Link
              key={course.id}
              href={`/course/${course.id}`}
              className="relative w-32 h-44 md:w-48 md:h-72 flex flex-col items-center text-center hover:-mt-2 transition-all duration-100"
            >
              {/* Folder Image */}
              <Image
                src={`/assets/images/decoration/${
                  folderColors[index % folderColors.length]
                }`}
                alt={`${course.name} folder`}
                width={180}
                height={250}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Course Name */}
              <div className="absolute top-10 md:top-16 -left-4 right-0 px-8 font-bold text-base md:text-xl text-gray-800 w-[200px]">
                {course.name}
              </div>

              {/* Course Code */}
              <div className="absolute bottom-12 md:bottom-24 -left-4 right-0 text-xs md:text-sm text-gray-800 px-8">
                {course.code}
              </div>

              {/* Instructor Name */}
              <div className="absolute bottom-8 md:bottom-20 -left-4 right-0 text-xs md:text-sm text-gray-800 font-bold">
                {course.teacher_name}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-3xl flex flex-col items-center mt-40 font-bold text-gray-500">
          {mode === "supervisor" ? (
            <>
              You have not created any course yet
              <Image
                src={"/assets/images/decoration/happy-woman-vector.png"}
                width={200}
                height={200}
                alt="vector image"
              />
            </>
          ) : (
            <>
              No courses yet, start joining!
              <Image
                src={"/assets/images/decoration/happy-woman-vector.png"}
                width={200}
                height={200}
                alt="vector image"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
