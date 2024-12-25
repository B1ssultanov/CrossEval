"use client";
import React, { useEffect, useState } from "react";
import AssignmentCreateForm from "@/components/assignment/AssignmentCreateForm";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const AssignmentCreationPage = () => {
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");

    // Define state variables
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [courseGroup, setCourseGroup] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/course?id=${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const courseData = response.data.course;
                // Set state variables with the fetched data
                setName(courseData.name);
                setCode(courseData.code);
                setCourseGroup(courseData.course_group);
            } catch (err) {
                setError("Failed to fetch course data");
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <div className="flex h-48 justify-between w-full pl-[10%] pr-[10%] text-gray-800 mt-6">
                <div>
                    <p className="text-gray-600">Course:</p>
                    <p>{name}</p>
                </div>

                <h1 className="text-2xl mt-2">
                    Assignment Creation
                </h1>

                <div>
                    <p className="text-gray-600">Course ID:</p>
                    <p>{code}</p>
                </div>
            </div>

            <AssignmentCreateForm />
        </div>
    );
};

export default AssignmentCreationPage;
