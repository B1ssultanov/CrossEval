"use client";

import { useEffect, useState } from "react";
import CourseFolder from "@/components/CourseFolder";
import JoinByCodeModal from "@/components/JoinByCodeModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import loadingGif from "../../public/images/loading.gif";
import happyVector from "../../public/images/happy-woman-vector.png";
import CreateCourseModal from "@/components/CreateCourseModal";

const colors = ["red", "green", "blue", "yellow", "purple"];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const router = useRouter();
  const [role, setRole] = useState("");

  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateCourseModalOpen(true);
  const closeCreateModal = () => setIsCreateCourseModalOpen(false);

  const handleCourseClick = (courseId) => {
    if (!window) return;
    localStorage.setItem("selectedCourse", courseId);
  };

  const handleJoinByCode = async (invite_code) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      setRole(localStorage.getItem("role"));
      // Data to be sent in the request body
      const registrationData = {
        invite_code,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/course/invite",
        registrationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      window.location.reload();
      // alert("Joined successfully!");
      window.location.reload();

      // setCourses([...courses, response.data.course]);
    } catch (error) {
      console.log(error.response || error.message); // Log the error for debugging
      alert("Failed to join course");
    }
  };

  // Fetch courses based on role
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("role");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    // Only set role when it's not in state
    if (!role && storedRole) {
      setRole(storedRole);
    }

    if (role) {
      const fetchCourses = async () => {
        try {
          console.log("fetching courses for role", role);
          const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/main?role=${role}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setCourses(response.data.courses);
        } catch (err) {
          setError("Failed to fetch courses");
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    }
  }, [role]); // Re-run this effect whenever `role` changes

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full flex">
      <div className="w-full flex flex-wrap space-x-3 pl-5 pr-5 justify-center mt-5">
        {loading && (
          <div className="flex justify-center items-center w-full h-screen -mt-40">
            <Image src={loadingGif} width={120} height={100} alt="loading" />
          </div>
        )}
        {!loading &&
          courses.length === 0 &&
          (role === "Supervisor" ? (
            <div className="text-3xl flex flex-col items-center mt-40 font-bold text-gray-500">
              You have not created any course yet
              <Image
                src={happyVector}
                width={200}
                height={200}
                alt="vector image"
              />
              <CreateCourseModal isOpen={isCreateCourseModalOpen} onClose={closeCreateModal} />
              <button
                onClick={() => openCreateModal(true)}
                className="text-base rounded-full bg-gray-500 border-2 border-white w-52 py-2 text-white mt-4 hover:bg-green-500 hover:scale-105 transition-all duration-300"
              >
                Create course
              </button>
            </div>
          ) : (
            <div className="text-3xl flex flex-col items-center mt-40 font-bold text-gray-500">
              No courses yet, start joining!
              <Image
                src={happyVector}
                width={200}
                height={200}
                alt="vector image"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-base rounded-full bg-gray-500 border-2 border-white w-52 py-2 text-white mt-4 hover:bg-green-500 hover:scale-105 transition-all duration-300"
              >
                Join by code
              </button>
            </div>
          ))}

        {courses &&
          courses.map((course, index) => (
            <Link
              onClick={() => handleCourseClick(course.id)}
              key={course.id}
              href={`/course/${course.id}`}
              className="hover:mt-[-10px] h-fit duration-100 transition-all"
            >
              <CourseFolder
                color={colors[index % colors.length]} // Use the same color
                course={[course.code, course.name, course.course_group]}
              />
            </Link>
          ))}
      </div>
      {/* Modal */}
      <JoinByCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoin={handleJoinByCode}
      />
    </div>
  );
}
