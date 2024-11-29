"use client";

import React, { useState, useEffect } from "react";
import OneCrossCheck from "../coursePage/OneCrossCheck";
import axios from "axios";
import Image from "next/image";

const CrossCheckSubmit = ({ assignmentId, courseId }) => {
    const [assignment, setAssignment] = useState(null);
    const [rubricsUrl, setRubricsUrl] = useState("");
    const [criteriaGrades, setCriteriaGrades] = useState([]);
    const [comment, setComment] = useState("");
    const [submissionUrl, setSubmissionUrl] = useState("cross-check-preza.pdf");
    const [answerFile, setAnswerFile] = useState(null); // File to store student's submission

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/assignment/${assignmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                const assignmentData = response.data.assignment;
                setAssignment(assignmentData);

                if (assignmentData.rubrics_id) {
                    setRubricsUrl(`http://127.0.0.1:8000/file/${assignmentData.rubrics_id}`);
                }

                const initialGrades = assignmentData.criteria
                    .split(",")
                    .map((criterion) => {
                        const lastSpaceIndex = criterion.lastIndexOf(" ");
                        const name = criterion.substring(0, lastSpaceIndex).trim();
                        const value = parseInt(criterion.substring(lastSpaceIndex + 1), 10);
                        return { name, value, grade: "" };
                    });

                setCriteriaGrades(initialGrades);
            } catch (err) {
                console.error("Failed to fetch assignment data", err);
            }
        };

        fetchAssignmentData();
    }, [assignmentId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0] || e.dataTransfer?.files[0];
        if (file) setAnswerFile(file);
    };

    const handleSubmit = async () => {
        if (!answerFile) {
            alert("Please upload a submission file.");
            return;
        }

        const formData = new FormData();
        formData.append("assignment_id", assignmentId);
        formData.append("comment", comment);
        formData.append("answer_file", answerFile);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/answer",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Submission successful:", response.data);
            alert("Your submission has been sent successfully.");
        } catch (err) {
            console.error("Submission failed:", err);
            alert("Failed to submit. Please try again.");
        }
    };

    if (!assignment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col w-[95%] items-center min-h-screen pt-5">
            <div className="flex flex-col w-full items-center">
                <div className="w-full h-[30px] font-semibold mt-3 mb-3 pl-2 pr-2 flex items-center justify-between text-[0.85rem] ">
                    <div className="w-[70px]">Status</div>
                    <div className="w-[70px] -ml-10">Title</div>
                    <div className="w-[10px] -ml-5">Type</div>
                    <div className="w-[60px]">Start date</div>
                    <div className="w-[55px]">End date</div>
                    <div>Weight</div>
                </div>
                <OneCrossCheck data={assignment} assignmentId={assignmentId} courseId={courseId} />
            </div>

            <div className="w-full flex mt-5">
                <div className="w-1/2 pr-5">
                    <h2 className="pl-2 font-bold text-lg text-gray-700">Description:</h2>
                    <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
                        {assignment.description}
                    </div>

                    <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">Rubrics:</h2>
                    <div className="w-[95%] p-2 min-h-[60px] border-gray-500 border-[1px] rounded-md">
                        Additional materials:
                        {rubricsUrl ? (
                            <a
                                href={rubricsUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-500"
                            >
                                Download Rubrics
                            </a>
                        ) : (
                            <span className="text-gray-500"> No rubrics available</span>
                        )}
                    </div>

                    <div className="flex justify-between w-[95%]">
                        <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">Criteria</h2>
                        <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">Points</h2>
                    </div>
                    <div className="w-[95%] border-gray-500 border-[1px] rounded-md">
                        {criteriaGrades.map((criterion, idx) => (
                            <div key={idx} className="flex justify-between p-2 border-b last:border-b-0">
                                <span>{criterion.name}</span>
                                <span className="border-l-2 border-gray-600 pl-3">{criterion.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-[2px] bg-black mx-5"></div>

                <div className="w-1/2 pl-5 flex flex-col items-end">
                    <div className="w-[95%] flex flex-col">
                        <div className="mb-4 w-full">
                            <label className="block text-gray-700 font-bold text-lg mb-2">Submission:</label>
                            <div
                                className="w-4/5 h-40 border-4 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-300 focus:outline-none"
                                onClick={() => document.getElementById("fileInput").click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleFileChange(e);
                                }}
                            >
                                <Image
                                    src={"/images/filedrop.png"}
                                    alt="Upload Icon"
                                    width={40}
                                    height={40}
                                    className="w-12 h-12 mb-3"
                                />
                                <p className="text-gray-500">
                                    <span className="font-bold text-blue-600">Choose a file</span> or drag it here
                                </p>
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {answerFile && (
                                <p className="text-gray-600 mt-2">
                                    Selected file: <span className="font-semibold">{answerFile.name}</span>
                                </p>
                            )}
                        </div>

                        <h2 className="mt-4 font-bold text-lg text-gray-700">Your comment to reviewer:</h2>
                        <textarea
                            className="w-[90%] min-h-[70px] border-gray-500 border-2 rounded-md p-2 bg-transparent"
                            placeholder="Your comments here"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            className="py-2 px-6 w-40 self-end mr-14 mt-10 rounded-lg bg-lime-400 text-white font-bold border-4 border-cyan-400"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossCheckSubmit;
// "use client";

// import React, { useState, useEffect } from "react";
// import OneCrossCheck from "../coursePage/OneCrossCheck";
// import axios from "axios";
// import Image from "next/image";

// const CrossCheckSubmit = ({ assignmentId, courseId }) => {
//     const [assignment, setAssignment] = useState(null);
//     const [rubricsUrl, setRubricsUrl] = useState("");
//     const [criteriaGrades, setCriteriaGrades] = useState([]);
//     const [comment, setComment] = useState("");
//     const [submissionUrl, setSubmissionUrl] = useState("cross-check-preza.pdf");
//     const [rubricFile, setRubricFile] = useState(null); // To store the selected rubric file

//     useEffect(() => {
//         const fetchAssignmentData = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://127.0.0.1:8000/api/v1/assignment/${assignmentId}`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem(
//                                 "accessToken"
//                             )}`,
//                         },
//                     }
//                 );

//                 const assignmentData = response.data.assignment;
//                 setAssignment(assignmentData);

//                 // Set rubrics URL if `rubrics_id` exists
//                 if (assignmentData.rubrics_id) {
//                     setRubricsUrl(
//                         `http://127.0.0.1:8000/file/${assignmentData.rubrics_id}`
//                     );
//                 }

//                 // Initialize criteriaGrades with empty values based on the criteria count
//                 const initialGrades = assignmentData.criteria
//                     .split(",")
//                     .map((criterion) => {
//                         const lastSpaceIndex = criterion.lastIndexOf(" ");
//                         const name = criterion
//                             .substring(0, lastSpaceIndex)
//                             .trim(); // Get the criteria description
//                         const value = parseInt(
//                             criterion.substring(lastSpaceIndex + 1),
//                             10
//                         ); // Get the criteria points

//                         return { name, value, grade: "" }; // Initialize grade as an empty string
//                     });

//                 setCriteriaGrades(initialGrades);
//             } catch (err) {
//                 console.error("Failed to fetch assignment data", err);
//             }
//         };

//         fetchAssignmentData();
//     }, [assignmentId]);

//     const handleRubricFileChange = (e) => {
//         let file;

//         // Check if the event is a drag-and-drop event
//         if (e.dataTransfer) {
//             file = e.dataTransfer.files[0];
//         } else {
//             file = e.target.files[0];
//         }

//         if (file) {
//             setRubricFile(file);
//         }
//     };

//     const handleGradeChange = (index, grade) => {
//         const updatedGrades = [...criteriaGrades];
//         updatedGrades[index].grade = grade;
//         setCriteriaGrades(updatedGrades);
//     };

//     const handleSubmit = () => {
//         // Submit grading data here
//         console.log("Submitting grades:", criteriaGrades, "Comment:", comment);
//     };

//     if (!assignment) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="flex flex-col w-[95%] items-center min-h-screen pt-5">
//             {/* Assignment Info Header with OneCrossCheck Component */}
//             <div className="flex flex-col w-full items-center">
//                 <div className="w-full h-[30px] font-semibold mt-3 mb-3 pl-2 pr-2 flex items-center justify-between text-[0.85rem] ">
//                     <div className="w-[70px]">Status</div>
//                     <div className="w-[70px] -ml-10">Title</div>
//                     <div className="w-[10px] -ml-5">Type</div>
//                     <div className="w-[60px]">Start date</div>
//                     <div className="w-[55px]">End date</div>
//                     <div>Weight</div>
//                 </div>
//                 <OneCrossCheck
//                     data={assignment}
//                     assignmentId={assignmentId}
//                     courseId={courseId}
//                 />
//             </div>

//             <div className="w-full flex mt-5">
//                 {/* Left Side: Assignment Information */}
//                 <div className="w-1/2 pr-5">
//                     <h2 className="pl-2 font-bold text-lg text-gray-700">
//                         Description:
//                     </h2>
//                     <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
//                         {assignment.description}
//                     </div>

//                     <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//                         Rubrics:
//                     </h2>
//                     <div className="w-[95%] p-2 min-h-[60px] border-gray-500 border-[1px] rounded-md">
//                         Additional materials:
//                         {rubricsUrl ? (
//                             <a
//                                 href={rubricsUrl}
//                                 download
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="underline text-blue-500"
//                             >
//                                 Download Rubrics
//                             </a>
//                         ) : (
//                             <span className="text-gray-500">
//                                 {" "}
//                                 No rubrics available
//                             </span>
//                         )}
//                     </div>

//                     <div className="flex justify-between w-[95%]">
//                         <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//                             Criteria
//                         </h2>
//                         <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//                             Points
//                         </h2>
//                     </div>
//                     <div className="w-[95%] border-gray-500 border-[1px] rounded-md">
//                         {criteriaGrades.map((criterion, idx) => (
//                             <div
//                                 key={idx}
//                                 className="flex justify-between p-2 border-b last:border-b-0"
//                             >
//                                 <span>{criterion.name}</span>
//                                 <span className="border-l-2  border-gray-600 pl-3 ">
//                                     {criterion.value}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                     {/* 
//                     <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//                         Student's comment:
//                     </h2>
//                     <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
//                         I didn't get
//                         how to make presentation, so I used Canva. Is it ok?
//                     </div> */}
//                 </div>

//                 {/* Divider */}
//                 <div className="w-[2px] bg-black mx-5"></div>

//                 {/* Right Side: Grading and Comments */}
//                 <div className="w-1/2 pl-5 flex flex-col items-end">
//                     <div className="w-[95%] flex flex-col">
//                         <div className="mb-4 w-full">
//                             <label className="block text-gray-700 font-bold text-lg mb-2">
//                                 Submission:
//                             </label>
//                             <div
//                                 className="w-4/5 h-40 border-4 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-300 focus:outline-none"
//                                 onClick={() =>
//                                     document.getElementById("fileInput").click()
//                                 } // Open file manager on div click
//                                 onDragOver={(e) => e.preventDefault()} // Prevent default behavior when dragging over the div
//                                 onDrop={(e) => {
//                                     e.preventDefault();
//                                     handleRubricFileChange(e); // Handle file drop
//                                 }}
//                             >
//                                 <Image
//                                     src={"/images/filedrop.png"} // Replace with your upload image path
//                                     alt="Upload Icon"
//                                     width={40}
//                                     height={40}
//                                     className="w-12 h-12 mb-3"
//                                 />
//                                 <p className="text-gray-500">
//                                     <span className="font-bold text-blue-600">
//                                         Choose a file
//                                     </span>{" "}
//                                     or drag it here
//                                 </p>
//                             </div>
//                             <input
//                                 type="file"
//                                 id="fileInput"
//                                 accept=".pdf,.doc,.docx"
//                                 onChange={handleRubricFileChange}
//                                 className="hidden" // Hide the default file input
//                             />

//                             {rubricFile && (
//                                 <p className="text-gray-600 mt-2">
//                                     Selected file:{" "}
//                                     <span className="font-semibold">
//                                         {rubricFile.name}
//                                     </span>
//                                 </p>
//                             )}
//                         </div>
                        


//                         <h2 className="mt-4 font-bold text-lg text-gray-700">
//                             Your comment to reviewer:
//                         </h2>
//                         <textarea
//                             className="w-[90%] min-h-[70px] border-gray-500 border-2 rounded-md p-2 bg-transparent"
//                             placeholder="Your comments here"
//                             value={comment}
//                             onChange={(e) => setComment(e.target.value)}
//                         />

//                         <button
//                             onClick={handleSubmit}
//                             className="py-2 px-6 w-40 self-end mr-14 mt-10 rounded-lg bg-lime-400 text-white font-bold border-4 border-cyan-400"
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CrossCheckSubmit;
