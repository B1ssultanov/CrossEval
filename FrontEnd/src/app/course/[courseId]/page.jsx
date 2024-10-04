"use client";

import React, { useEffect, useState } from "react";
import CourseInfo from "@/components/coursePage/CourseInfo";
import Image from "next/image";
import settings from "../../../../public/images/settings.png";
import CrossChecks from "@/components/coursePage/CrossChecks";
import axios from "axios";
import Link from "next/link";

const Course = ({ params }) => {
    const [courseInfo, setCourseInfo] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState("");

    const [isHovered, setIsHovered] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(courseInfo.invite_code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    };

    useEffect(() => {
        if (!window) return;
        setRole(localStorage.getItem("role"));
        console.log("role", role);
    }, []);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/course?id=${params.courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`,
                        },
                    }
                );
                setCourseInfo(response.data.course);
                setAssignments(response.data.assignments);
            } catch (err) {
                setError("Failed to fetch course data");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [params.courseId]);

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
                            <p className="text-sm">Course code:</p>
                            <div className="text-black bg-[#9FC6F1] px-6 py-[1px] rounded-3xl text-xs font-semibold">
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
                            />
                            <div className="text-blue-600 underline flex justify-around">
                                Syllabus
                            </div>
                        </div>
                    </div>
                    <div className="w-[200px] flex justify-center items-center ">
                        {role == "supervisor" && (
                            <Link
                                href={`/assignment-creation?courseId=${params.courseId}`}
                            >
                                <button className="px-4 py-3 border-2 bg-green-300 transition-all duration-300 text-white font-bold text-sm border-green-600 rounded-3xl">
                                    Create Assignment
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="font-semibold text-md tracking-tight mt-5">
                    Cross-checks:
                </div>
                <CrossChecks key={courseInfo.id} data={assignments} />
            </div>
        </div>
    );
};

export default Course;
