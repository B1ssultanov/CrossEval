"use client";

import React, { useEffect, useState } from "react";
import CourseInfo from "@/components/coursePage/CourseInfo";
import Image from "next/image";
import settings from "../../../../public/images/settings.png";
import CrossChecks from "@/components/coursePage/CrossChecks";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation"; // Alternative to props-based params
import badgeImage1 from "../../../../public/images/budges/one.png";
import badgeImage2 from "../../../../public/images/budges/two.png";
import badgeImage3 from "../../../../public/images/budges/three.png";

const Course = ({ params }) => {
  // Use params from props if provided, or fallback to useParams
  const localParams = params || useParams();
  const courseId = localParams.courseId;

  const [courseInfo, setCourseInfo] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [role, setRole] = useState("");  //Supervisor or Student

  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeForm, setBadgeForm] = useState({
    title: "",
    description: "",
    weight: "",
    image: "",
  });
  const [badges, setBadges] = useState([]);

  const handleBadgeFormChange = (e) => {
    const { name, value } = e.target;
    setBadgeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBadgeSubmit = () => {
    const newBadge = {
      ...badgeForm,
      id: Date.now(),
      image: badgeForm.image || badgeImage1, // Default to badgeImage1 if no selection
    };
    setBadges([...badges, newBadge]);
    setBadgeForm({ title: "", description: "", weight: "", image: "" });
    setShowBadgeModal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(courseInfo.invite_code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/course?id=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCourseInfo(response.data.course);
        setAssignments(response.data.assignments);
        setRole(response.data.role);
        console.log('role: ', response.data.role)
      } catch (err) {
        setError("Failed to fetch course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="w-[97%] flex flex-col">
        <CourseInfo
          courseInfo={[
            courseInfo.code,
            courseInfo.name,
            courseInfo.course_group,
          ]}
        />

        <div className="flex justify-between items-center mt-2 mb-3">
          <div className="flex gap-5">
            <div
              className="w-[118px] h-[50px] border-[1.5px] border-black rounded-[20px] flex flex-col items-center justify-center relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleCopy}
              style={{ cursor: "pointer" }}
            >
              <p className="text-xs -mt-1">Course code:</p>
              <div className="text-gray-800 bg-[#9FC6F1] px-5 rounded-3xl text-base font-semibold">
                {courseInfo.invite_code}
              </div>

              {/* Tooltip for copy */}
              {isHovered && !isCopied && (
                <div className="absolute bottom-[-25px] text-xs text-gray-500">
                  Click to copy
                </div>
              )}
              {/* Show "Copied" after clicking */}
              {isCopied && (
                <div className="absolute bottom-[-25px] text-xs text-green-500">
                  Copied!
                </div>
              )}
            </div>

            <div className="w-[118px] h-[50px] border-[1.5px] border-black rounded-[20px] flex items-center justify-evenly">
              <Image
                src={settings}
                className="w-[25px]"
                alt="syllabus"
                width={50}
                height={50}
              />
              <div className="text-blue-600 underline flex justify-around">
                Syllabus
              </div>
            </div>
          </div>
          {role == "Supervisor" && (
            <div className="w-full flex flex-col">
              <div className="w-[200px] flex justify-center items-center mt-4">
                <button
                  onClick={() => setShowBadgeModal(true)}
                  className="px-4 py-3 border-2 bg-blue-300 transition-all duration-300 text-white font-bold text-sm border-blue-600 rounded-3xl"
                >
                  Create Badge
                </button>
              </div>

              {/* Display Badges */}
              <div className="mt-6 flex flex-wrap gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="w-[200px] h-[250px] flex flex-col items-center bg-gray-100 border rounded-xl p-4"
                  >
                    <Image
                      src={badge.image} // This now contains the correct image URL
                      alt={badge.title}
                      width={50}
                      height={50}
                      className="mb-2"
                    />
                    <h3 className="font-semibold">{badge.title}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    <p className="text-xs text-gray-500">
                      Weight: {badge.weight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Badge Creation Modal */}
              {showBadgeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg w-[400px]">
                    <h2 className="text-xl font-semibold mb-4">Create Badge</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={badgeForm.title}
                          onChange={handleBadgeFormChange}
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={badgeForm.description}
                          onChange={handleBadgeFormChange}
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="weight"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Weight
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={badgeForm.weight}
                          onChange={handleBadgeFormChange}
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Badge Image
                        </label>
                        <select
                          name="image"
                          id="image"
                          onChange={handleBadgeFormChange}
                          value={badgeForm.image}
                          className="w-full px-4 py-2 border rounded-md"
                        >
                          <option value={badgeImage1.src}>Badge 1</option>
                          <option value={badgeImage2.src}>Badge 2</option>
                          <option value={badgeImage3.src}>Badge 3</option>
                        </select>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={handleBadgeSubmit}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBadgeModal(false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {role == "Supervisor" && (
            <div className="w-[200px] flex justify-center items-center ">
              <Link href={`/assignment-creation?courseId=${courseId}`}>
                <button className="px-4 py-3 border-2 bg-green-300 transition-all duration-300 text-white font-bold text-sm border-green-600 rounded-3xl">
                  Create Assignment
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="font-semibold text-md tracking-tight mt-5">
          Cross-checks:
        </div>
        <CrossChecks
          courseId={courseId}
          key={courseInfo.id}
          data={assignments}
        />
      </div>
    </div>
  );
};

export default Course;
