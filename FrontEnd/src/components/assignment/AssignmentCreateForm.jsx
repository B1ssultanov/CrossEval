"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

const AssignmentCreateForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');

    // const [courseId, setCourseId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("essay");
    const [isCrossCheck, setIsCrossCheck] = useState(0);
    const [criteriaRows, setCriteriaRows] = useState([
        { criteria: "", points: "" },
    ]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [weight, setWeight] = useState("");
    const [accessToken, setAccessToken] = useState('');
    const [postStatus, setPostStatus] = useState('');
    
    useEffect(()=>{
        if(!window) return;
        setAccessToken(localStorage.getItem('accessToken'));
    },[])
    
    const handleAddRow = () => {
        setCriteriaRows([...criteriaRows, { criteria: "", points: "" }]);
    };

    const handleCriteriaChange = (index, field, value) => {
        const updatedRows = [...criteriaRows];
        updatedRows[index][field] = value;
        setCriteriaRows(updatedRows);
    };

    const handleSubmit = async (e) => {
        console.log('posting assignment started');
        e.preventDefault();

        const criteriaString = criteriaRows
            .map((row) => `${row.criteria} ${row.points}`)
            .join(",");
        console.log("criteriaString looks like this: ", criteriaString);
        const assignmentData = {
            course_id: courseId,
            title,
            description,
            type,
            isCrossCheck: isCrossCheck ? 1 : 0,
            criteria: criteriaString,
            start_date: startDate,
            end_date: endDate,
            weight,
        };

        console.log('assignmentData: ', assignmentData)

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/v1/assignment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(assignmentData),
                }
            );

            if (!response.ok) {
                const errorDetails = await response.json();
                console.log('Error Details:', errorDetails);
                setPostStatus(`Failed to create assignment: ${errorDetails.message || "Unknown error"}`);
                throw new Error("Failed to create assignment");
            }
            

            const result = await response.json();
            setPostStatus(`Assignment "${title}" created successfully!`)
            const successMessage = `Assignment "${title}" created successfully!`;
            console.log("Assignment created:", result);
            alert(successMessage);
            router.push(`/course/${courseId}`);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex justify-center w-full items-center min-h-screen bg-gray-500">
            <form
                onSubmit={handleSubmit}
                className="w-full bg-white p-8 rounded-lg shadow-md flex justify-evenly"
            >
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Create New Assignment
                    </h2>

                    {/* Course ID */}

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Title:
                        </label>
                        <input
                            type="text"
                            value={title}
                            placeholder="Enter title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Description:
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    {/* Type */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Type:
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="essay">Essay</option>
                            <option value="project">Project</option>
                            <option value="quiz">Quiz</option>
                            <option value="code">Code</option>
                            <option value="essay">Essay</option>
                            <option value="presentation">Presentation</option>
                        </select>
                    </div>

                    {/* Cross Check */}
                    <div className="mb-4 flex items-center">
                        <label className="text-gray-700 font-bold mr-4">
                            Cross Check
                        </label>
                        <input
                            type="checkbox"
                            checked={isCrossCheck}
                            onChange={() => isCrossCheck == 1 ? setIsCrossCheck(0) : setIsCrossCheck(1)  }
                            className="mr-2 size-4"
                        />
                    </div>
                </div>
                <div className="h-screen w-[1px] bg-gray-900"></div>
                <div>
                    {/* Criteria Table */}
                    <div className="mb-6">
                        <label className="text-gray-700 font-bold mb-2 flex justify-between px-5">
                            <div>Criteria</div>
                            <div>Points</div>
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4">
                            {criteriaRows.map((row, index) => (
                                <div key={index} className="flex mb-4">
                                    <input
                                        type="text"
                                        placeholder="Criteria"
                                        value={row.criteria}
                                        onChange={(e) =>
                                            handleCriteriaChange(
                                                index,
                                                "criteria",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 mr-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Points"
                                        value={row.points}
                                        onChange={(e) =>
                                            handleCriteriaChange(
                                                index,
                                                "points",
                                                e.target.value
                                            )
                                        }
                                        className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                                        max={100}
                                        min={0}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                + Add Criteria
                            </button>
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Start Date:
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            End Date:
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Weight */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">
                            Weight:
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Create Assignment
                    </button>

                    {postStatus && <p>{postStatus}</p>}
                </div>
            </form>
        </div>
    );
};

export default AssignmentCreateForm;
