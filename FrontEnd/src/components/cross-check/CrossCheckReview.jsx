"use client";

import React, { useState, useEffect } from "react";
import OneCrossCheck from "../coursePage/OneCrossCheck";
import axios from "axios";

const CrossCheckReview = ({ assignmentId, courseId }) => {
    const [assignment, setAssignment] = useState(null);
    const [rubricsUrl, setRubricsUrl] = useState("");
    const [criteriaGrades, setCriteriaGrades] = useState([]);
    const [comment, setComment] = useState("");
    const [submissionUrl, setSubmissionUrl] = useState("cross-check-preza.pdf");

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/v1/assignment/${assignmentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                            )}`,
                        },
                    }
                );

                const assignmentData = response.data.assignment;
                setAssignment(assignmentData);

                // Set rubrics URL if `rubrics_id` exists
                if (assignmentData.rubrics_id) {
                    setRubricsUrl(
                        `http://127.0.0.1:8000/file/${assignmentData.rubrics_id}`
                    );
                }

                // Initialize criteriaGrades with empty values based on the criteria count
                const initialGrades = assignmentData.criteria
                    .split(",")
                    .map((criterion) => {
                        const lastSpaceIndex = criterion.lastIndexOf(" ");
                        const name = criterion
                            .substring(0, lastSpaceIndex)
                            .trim(); // Get the criteria description
                        const value = parseInt(
                            criterion.substring(lastSpaceIndex + 1),
                            10
                        ); // Get the criteria points

                        return { name, value, grade: "" }; // Initialize grade as an empty string
                    });

                setCriteriaGrades(initialGrades);
            } catch (err) {
                console.error("Failed to fetch assignment data", err);
            }
        };

        fetchAssignmentData();
    }, [assignmentId]);

    const handleGradeChange = (index, grade) => {
        const updatedGrades = [...criteriaGrades];
        updatedGrades[index].grade = grade;
        setCriteriaGrades(updatedGrades);
    };

    const handleSubmit = () => {
        // Submit grading data here
        console.log("Submitting grades:", criteriaGrades, "Comment:", comment);
    };

    if (!assignment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col w-[95%] items-center min-h-screen pt-5">
            {/* Assignment Info Header with OneCrossCheck Component */}
            <div className="flex flex-col w-full items-center">
                <div className="w-full h-[30px] font-semibold mt-3 mb-3 pl-2 pr-2 flex items-center justify-between text-[0.85rem] ">
                    <div className="w-[70px]">Status</div>
                    <div className="w-[70px] -ml-10">Title</div>
                    <div className="w-[10px] -ml-5">Type</div>
                    <div className="w-[60px]">Start date</div>
                    <div className="w-[55px]">End date</div>
                    <div>Weight</div>
                </div>
                <OneCrossCheck
                    data={assignment}
                    assignmentId={assignmentId}
                    courseId={courseId}
                />
            </div>

            <div className="w-full flex mt-5">
                {/* Left Side: Assignment Information */}
                <div className="w-1/2 pr-5">
                    <h2 className="pl-2 font-bold text-lg text-gray-700">
                        Description of task:
                    </h2>
                    <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
                        {assignment.description}
                    </div>

                    <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                        Rubrics:
                    </h2>
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
                            <span className="text-gray-500">
                                {" "}
                                No rubrics available
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between w-[95%]">
                        <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                            Criteria
                        </h2>
                        <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                            Points
                        </h2>
                    </div>
                    <div className="w-[95%] border-gray-500 border-[1px] rounded-md">
                        {criteriaGrades.map((criterion, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between p-2 border-b last:border-b-0"
                            >
                                <span>{criterion.name}</span>
                                <span className="border-l-2  border-gray-600 pl-3 ">
                                    {criterion.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                        Student's comment:
                    </h2>
                    <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
                        {/* Placeholder for student's comment */}I didn't get
                        how to make presentation, so I used Canva. Is it ok?
                    </div>
                </div>

                {/* Divider */}
                <div className="border-2 bg-gray-500 mx-5"></div>

                {/* Right Side: Grading and Comments */}
                <div className="w-1/2 pl-5 flex flex-col items-end">
                    <div className="w-[95%]">
                        <h2 className=" pl-2 font-bold text-lg text-gray-700">
                            Student's submission:
                        </h2>
                        <a
                            href={submissionUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 underline text-blue-500 block"
                        >
                            cross-check-preza.pdf
                        </a>

                        <div className="flex justify-between w-[95%]">
                            <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                                Criteria
                            </h2>
                            <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                                Points
                            </h2>
                        </div>
                        <div className="w-full border-gray-500 border-[1px] rounded-md flex flex-col">
                            {criteriaGrades.map((criterion, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 border-b last:border-b-0"
                                >
                                    <span>{criterion.name}</span>
                                    <div className="flex items-center w-[35%]">
                                        <input
                                            type="range"
                                            min="0"
                                            max={criterion.value}
                                            value={criterion.grade}
                                            onChange={(e) =>
                                                handleGradeChange(
                                                    idx,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <span className="text-gray-500 ml-2">
                                            {criterion.grade}/{criterion.value}
                                        </span>
                                        {parseInt(criterion.grade, 10) ===
                                            criterion.value && (
                                            <div className="ml-2 p-2 rounded-full bg-green-400 text-white flex justify-center items-center w-6 h-6">
                                                ✔
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
                            Your comment to student's work:
                        </h2>
                        <textarea
                            className="w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 bg-transparent"
                            placeholder="Your comments here"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            className="py-2 px-6 mt-5 rounded-lg bg-lime-400 text-white font-bold border-4 border-cyan-400"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossCheckReview;
// "use client";

// import React, { useState, useEffect } from "react";
// import OneCrossCheck from "../coursePage/OneCrossCheck";
// import axios from "axios";

// const CrossCheckReview = ({ assignmentId, courseId }) => {
//     const [assignment, setAssignment] = useState();

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
//                 setAssignment(response.data);
//                 console.log(response.data);
//             } catch (err) {
//                 console.error("Failed to fetch course data", err);
//             }
//         };

//         fetchAssignmentData();
//     }, []);

//     return (
//         <div className="flex flex-col w-[95%] items-center min-h-screen pt-5">
//             <div className="flex flex-col w-full items-center">
//                 <div className="w-full h-[30px] font-semibold mt-3 mb-3 pl-2 pr-2 flex items-center justify-between text-[0.85rem] ">
//                     <div className="w-[70px]">Status</div>
//                     <div className="w-[70px] -ml-10">Title</div>
//                     <div className="w-[10px] -ml-5">Type</div>
//                     <div className="w-[60px]">Start date</div>
//                     <div className="w-[55px]">End date</div>
//                     <div>Weight</div>
//                 </div>
//                 {assignment && (
//                 <OneCrossCheck
//                     data={assignment.assignment}
//                     assignmentId={assignmentId}
//                     courseId={courseId}
//                 />
//             )}
//             </div>

//             <div className='w-full flex min-h-[500px]'>
//                 <div className ='w-1/2 '>
//                     <h2 className='pl-2 font-bold text-lg text-gray-700'>Description of task:</h2>
//                     <div className = 'w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. In, nostrum similique maxime magnam voluptatem omnis porro, ea facere explicabo perspiciatis accusamus. Cum minima officiis iusto commodi, a, tempore, possimus similique consectetur perferendis earum dolorum molestias unde voluptas asperiores veniam! Illo. </div>

//                     <h2 className='mt-4 pl-2 font-bold text-lg text-gray-700'>Rubrics:</h2>
//                     <div className = 'w-[95%]  p-2 min-h-[60px] border-gray-500 border-[1px] rounded-md'>
//                         Additional materials: <br/> <span className='underline text-blue'>apple-way.pdf</span>
//                     </div>

//                     <div className = 'w-[70%] mt-4 '>
//                         <div className='flex flex-col w-full justify-between'>
//                             <div className='flex w-full justify-between px-2'>
//                                 <h2 className='font-bold text-lg text-gray-700'>Criteria</h2>
//                                 <h2 className ='font-bold text-lg text-gray-700'>Points</h2>
//                             </div>
//                             <div className='border-gray-500 border-[1px] rounded-md w-full flex'>
//                                 <div className='w-[80%] border-[1px] border-gray-500'>
//                                     <div className='w-full border-b-2 border-gray-500  p-2'>Criteria 1</div>
//                                     <div className='w-full border-b-2 border-gray-500  p-2'>Criteria 2</div>
//                                     <div className='w-full border-b-2 border-gray-500 p-2'>Criteria 3</div>
//                                 </div>
//                                 <div className='w-[20%]  border-[1px] border-gray-500'>
//                                     <div className='w-full  border-b-2 border-gray-500 p-2'>30</div>
//                                     <div className='w-full  border-b-2 border-gray-500 p-2'>50</div>
//                                     <div className='w-full  border-b-2 border-gray-500 p-2'>20</div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <h2 className='mt-4 pl-2 font-bold text-lg text-gray-700'>Student's comment:</h2>
//                     <div className = 'w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2'>I didnt get how to make presention so I used Canva. Is it ok? </div>

//                 </div>
//                 <div className='w-[2px] bg-black h-min-40'></div>
//                 <div className ='w-1/2 flex flex-col items-center'>
//                     <div className = 'w-[90%] h-[100%] flex flex-col'>
//                         <h2 className='font-bold text-lg text-gray-700'>Student's submition:</h2>
//                         <div className = 'w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 underline text-blue-500'> cross-check-preza.pdf</div>

//                         <div className = 'w-[70%] mt-4 '>
//                             <div className='flex flex-col w-full justify-between'>
//                                 <div className='flex w-full justify-between px-2'>
//                                     <h2 className = 'font-bold text-lg text-gray-700'>Criteria</h2>
//                                     <h2 className = 'font-bold text-lg text-gray-700'>Points</h2>
//                                 </div>
//                                 <div className= 'flex'>
//                                     <div className='w-[30px] '>
//                                         <div className='w-full p-2'>1</div>
//                                         <div className='w-full p-2'>2</div>
//                                         <div className='w-full p-2'>3</div>
//                                     </div>
//                                     <div className='border-gray-500 border-[2px] rounded-md w-full flex'>
//                                         <div className='w-[80%] border-[1px] border-gray-500'>
//                                             <div className='w-full border-b-2 border-gray-500  p-2'>Criteria 1</div>
//                                             <div className='w-full border-b-2 border-gray-500  p-2'>Criteria 2</div>
//                                             <div className='w-full border-b-2 border-gray-500 p-2'>Criteria 3</div>
//                                         </div>
//                                         <div className='w-[20%]  border-[1px] border-gray-500'>
//                                             <input className='w-full  border-b-2 border-gray-500 p-2 bg-transparent' placeholer='access' />
//                                             <input className='w-full  border-b-2 border-gray-500 p-2 bg-transparent' />
//                                             <input className='w-full  border-b-2 border-gray-500 p-2 bg-transparent' />

//                                         </div>

//                                     </div>
//                                     <div className='w-[40px] space-y-5 ml-3 '>
//                                             <div className='p-2 rounded-full border-2 border-green-500 h-[30px] w-[30px] text-center flex justify-center items-center bg-green-400 text-white'>✔</div>
//                                             <div className='p-2 rounded-full border-2 border-green-500 h-[30px] w-[30px] text-center flex justify-center items-center text-white'>✔</div>
//                                             <div className='p-2 rounded-full border-2 border-green-500 h-[30px] w-[30px] text-center flex justify-center items-center text-white'>✔</div>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>

//                         <h2 className='pl-2 mt-4 font-bold text-lg text-gray-700'>Your comment to student's work:</h2>
//                         <input type='text' className = 'w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 bg-transparent' placeholer='Your comments here'/>

//                         <button className = 'py-2 px-6 mt-20 self-end place-self-end rounded-lg bg-lime-400 text-white border-4 font-bold border-cyan-400'>Submit</button>
//                     </div>

//                 </div>
//             </div>

//         </div>
//     );
// };

// export default CrossCheckReview;
