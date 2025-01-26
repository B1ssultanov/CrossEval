"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    studentSidebarItems,
    teacherSidebarItems,
} from "../data/sidebarConfig";
import imagePaths from "../data/imagePaths";
import coursesIcon from "../../public/images/sideBarIcons/courses.png";
import { getCourseColor } from "../utils/courseColors";
import { useRouter } from "next/navigation";

const SideBar = ({ role, courses }) => {
    const sidebarItems =
        role === "Supervisor" ? teacherSidebarItems : studentSidebarItems;

    const [showCourses, setShowCourses] = useState(true);
    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (!window) return;
        const storedRole = localStorage.getItem("role");
        setSelectedCourse(localStorage.getItem("selectedCourse"));
        console.log("checking for auth in SideBar");
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsUserAuthorized(true);
        }
    }, []);

    const toggleCourses = () => {
        setShowCourses(!showCourses);
    };

    const handleGradesClick = () => {
        const selected = localStorage.getItem("selectedCourse")
        router.push(`/grades/${selected}`)
    }

    const handleClick = (href) => {
        router.push(href);
    };

    return (
        isUserAuthorized && (
            <div className="w-[280px] min-h-screen bg-white  border-[#D1D1D1] border-2  border-b-transparent hidden lg:block">
                <div className="pr-4">
                    <ul>
                        {sidebarItems.map((item) => (
                            <li
                                key={item.label}
                                className="px-4 flex items-center rounded-r-xl h-[55px] "
                            >
                                <button
                                    onClick={() => handleClick(item.href)}
                                    className="w-full"
                                >
                                    <div className="flex space-x-3 items-center p-2 text-gray-700 w-full rounded-full hover:bg-gray-200">
                                        <Image
                                            src={imagePaths[item.icon]}
                                            width={30}
                                            height={30}
                                            alt="icon"
                                        />
                                        <span className="ml-2">
                                            {item.label}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="h-[4px] mt-2 w-[278px] bg-[#D1D1D1]"></div>

                    {/* My Courses Section */}
                    <div>
                        <div
                            className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-r-xl mt-2 h-[55px] cursor-pointer"
                            onClick={toggleCourses}
                        >
                            <div className="ml-[-10px]">
                                <svg
                                    width="25"
                                    height="25"
                                    viewBox="0 0 24 24"
                                    className={`transition-all duration-300 ${
                                        showCourses ? "-rotate-90" : "rotate-0"
                                    }`}
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12 15L7 10H17L12 15Z"
                                        fill="black"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Image
                                    src={coursesIcon}
                                    width={30}
                                    height={30}
                                    alt="icon"
                                />
                                <div className="">My courses</div>
                            </div>
                        </div>

                        {showCourses && (
                            <ul className="pl-4 pt-2">
                                {courses && courses.length > 0 ? (
                                    courses.map((course, index) => (
                                        <li
                                            key={course.id}
                                            className="mb-2 flex items-center hover:bg-gray-200 rounded-full p-2"
                                        >
                                            {/* Assign a color from the colors array based on index */}
                                            <div
                                                className={`flex justify-center items-center w-8 h-8 rounded-full text-white ${getCourseColor(
                                                    index
                                                )}`}
                                            >
                                                {course.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <Link href={`/course/${course.id}`}>
                                                <div className="ml-3 text-gray-700 hover:text-gray-900 cursor-pointer">
                                                    {course.name}
                                                </div>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <div className="pl-4 text-gray-500">
                                        No courses available.
                                    </div>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default SideBar;
