"use client";

import { useEffect, useState } from "react";
import { fetchUserData } from "@/api/user";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
// import CreateCourseModal from "@/components/CreateCourseModal"; // Ensure this component exists

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
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Get mode from Redux store
  const mode = useSelector((state: RootState) => state.mode.mode);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found.");

        const userData = await fetchUserData(accessToken);
        setCourses(userData.courses);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
      }
    };

    loadUserData();
  }, []);

  const openCreateModal = () => setIsCreateCourseModalOpen(true);
  const closeCreateModal = () => setIsCreateCourseModalOpen(false);

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold mb-4 text-gray-700">My Courses</h1>

      {courses.length > 0 ? (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li key={course.id} className="p-4 border rounded-lg shadow-md bg-white">
              <h2 className="text-lg font-semibold">{course.name} ({course.code})</h2>
              <p className="text-sm text-gray-600">Group: {course.course_group}</p>
              <p className="text-sm text-gray-600">Instructor: {course.teacher_name}</p>
              <p className="text-sm text-gray-500">Invite Code: {course.invite_code}</p>
            </li>
          ))}
        </ul>
      ) : (
        mode === "supervisor" ? (
          <div className="text-3xl flex flex-col items-center mt-40 font-bold text-gray-500">
            You have not created any course yet
            <Image
              src={'/assets/images/decoration/happy-woman-vector.png'}
              width={200}
              height={200}
              alt="vector image"
            />
            {/* <CreateCourseModal isOpen={isCreateCourseModalOpen} onClose={closeCreateModal} /> */}
            <button
              onClick={openCreateModal}
              className="text-base rounded-full bg-gray-500 border-2 border-white w-52 py-2 text-white mt-4 hover:bg-indigo-500 hover:scale-105 transition-all duration-300"
            >
              Create course
            </button>
          </div>
        ) : (
          <div className="text-3xl flex flex-col items-center mt-40 font-bold text-gray-500">
            No courses yet, start joining!
            <Image
              src={'/assets/images/decoration/happy-woman-vector.png'}
              width={200}
              height={200}
              alt="vector image"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-base rounded-full bg-gray-500 border-2 border-white w-52 py-2 text-white mt-4 hover:bg-indigo-500 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-600 hover:scale-105 transition-all duration-300"
            >
              Join by code
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Page;
