"use client";

import { useState, useEffect } from 'react';
import CrossCheckSubmit from "@/components/cross-check/CrossCheckSubmit";
import { useSearchParams, useParams } from "next/navigation";
import axios from 'axios';

const AssignmentSubmit = () => {
    const searchParam = useSearchParams();
    const params = useParams();
    const assignmentId = params.submitId;
    const courseId = searchParam.get("courseId");

    const [accessToken, setAccessToken] = useState('');
    const [courseInfo, setCourseInfo] = useState();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            setAccessToken(token);
        }
    }, []); 

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/course?id=${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`,
                        },
                    }
                );
                setCourseInfo(response.data.course);
                console.log(response.data.course);
            } catch (err) {
                console.error("Failed to fetch course data", err);
            }
        };

        fetchCourseData();
    }, []); 

    return (
        <div className="w-full h-screen flex flex-col items-center">
            <div className="flex w-[95%] justify-between items-center mt-5">
                <div>
                    <h2 className="text-gray-700">Course</h2>
                    <p>{courseInfo && courseInfo.name}</p>
                </div>
                <h1 className="font-bold text-xl">Cross-Check: Submit</h1>
                <div>
                    <h2 className="text-gray-700">Course ID</h2>
                    <p>{courseInfo && courseInfo.code}</p> 
                </div>
            </div>
           
            <CrossCheckSubmit  assignmentId={assignmentId} courseId={courseId}/>
        </div>
    );
};

export default AssignmentSubmit;
