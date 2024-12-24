import React, { useState, useEffect } from "react";
import axios from "axios";

const OneStudentReviewComponent = ({ assignmentId, student }) => {
  const [criteriaGrades, setCriteriaGrades] = useState([]);
  const [rubricsUrl, setRubricsUrl] = useState("");
  const [comment, setComment] = useState("");
  const [studentWork, setStudentWork] = useState(null);

  // console.log('student: ', student)

  // Fetch student-specific work details
  useEffect(() => {
    const fetchStudentWork = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          console.error("Access token not found");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/cross_review/${student.answer_review_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("data:", response.data);
        setStudentWork(response.data);
        setCriteriaGrades(
          response.data.assignment_info.criteria.split(",") || []
        );
        setRubricsUrl(response.data.rubricsUrl || "");
      } catch (error) {
        console.error("Error fetching student work:", error);
      }
    };

    fetchStudentWork();
  }, [student]);

  const handleGradeChange = (index, grade) => {
    const updatedGrades = [...criteriaGrades];
    updatedGrades[index].grade = grade;
    setCriteriaGrades(updatedGrades);
  };

  const handleSubmit = async () => {
    // Submit grading logic here
  };

  if (!studentWork) return <p>Loading student data...</p>;

  return (
    <div className="w-full flex-col items-center mt-10">
      <h1 className="text-2xl font-bold text-gray-700">
        Selected student:{" "}
        {/* {selectedStudent
          ? `Student ${answersInfo.indexOf(selectedStudent) + 1}`
          : "None"} */}
      </h1>

      <div className="w-full flex mt-5">
        <div className="w-1/2 pr-5">
          <h2 className="pl-2 font-bold text-lg text-gray-700">
            Description of task:
          </h2>
          <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
            {studentWork && studentWork.assignment_info.description}
          </div>
          <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
            Rubrics:
          </h2>
          <div className="w-[95%] p-2 min-h-[60px] border-gray-500 border-[1px] rounded-md">
            Rubric's id:
            {studentWork && studentWork.assignment_info.rubrics_id}
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
            {/* Placeholder for student's comment */}
            {studentWork && studentWork.answer_info.comment}
          </div>
        </div>
        {/* Divider */}
        <div className="border-2 bg-gray-500 mx-5"></div>
        {/* Right Side: Grading and Comments */}
        <div className="w-1/2 pl-5 flex flex-col items-end">
          <div className="w-[95%]">
            {/* <h2 className=" pl-2 font-bold text-lg text-gray-700">
              Student's submission:
            </h2>
            <a
              href={"#"}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 underline text-blue-500 block"
            >
              cross-check-preza.pdf
            </a> */}
            <h2 className="pl-2 font-bold text-lg text-gray-700">
              Student's submission:
            </h2>

            <a
              href="#"
              onClick={async (e) => {
                e.preventDefault(); // Prevent default link behavior
                const accessToken = localStorage.getItem("accessToken");

                if (!accessToken) {
                  console.error("Access token not found");
                  return;
                }

                const fileId = studentWork.assignment_info.rubrics_id; // Get the file ID

                if (!fileId) {
                  console.error("No file ID found");
                  return;
                }

                try {
                  const response = await fetch(
                    `http://127.0.0.1:8000/file/${fileId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to fetch the file");
                  }

                  // Get the file as a blob
                  const blob = await response.blob();

                  // Create a link element to download the file
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;

                  // Set the file name (optional, backend should ideally provide this)
                  link.download = `submission-${fileId}.pdf`; // Customizable file name
                  link.click();

                  // Cleanup the URL object
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Error downloading file:", error);
                }
              }}
              className="w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 underline text-blue-500 block"
            >
              Download Student&apos;s Submission
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
                      onChange={(e) => handleGradeChange(idx, e.target.value)}
                      className="w-full"
                    />
                    <span className="text-gray-500 ml-2">
                      {criterion.grade}/{criterion.value}
                    </span>
                    {parseInt(criterion.grade, 10) === criterion.value && (
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

export default OneStudentReviewComponent;

// const OneStudentReviewComponent = ({...assignment}) => {
//   return (
//     <div className="w-full flex-col items-center mt-10">
//   <h1 className="text-2xl font-bold text-gray-700">
//     Selected student:{" "}
//     {selectedStudent
//       ? `Student ${answersInfo.indexOf(selectedStudent) + 1}`
//       : "None"}
//   </h1>

//   <div className="w-full flex mt-5">
//     <div className="w-1/2 pr-5">
//       <h2 className="pl-2 font-bold text-lg text-gray-700">
//         Description of task:
//       </h2>
//       <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
//         {assignment.description}
//       </div>
//       <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//         Rubrics:
//       </h2>
//       <div className="w-[95%] p-2 min-h-[60px] border-gray-500 border-[1px] rounded-md">
//         Additional materials:
//         {rubricsUrl ? (
//           <a
//             href={rubricsUrl}
//             download
//             target="_blank"
//             rel="noopener noreferrer"
//             className="underline text-blue-500"
//           >
//             Download Rubrics
//           </a>
//         ) : (
//           <span className="text-gray-500"> No rubrics available</span>
//         )}
//       </div>

//       <div className="flex justify-between w-[95%]">
//         <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//           Criteria
//         </h2>
//         <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//           Points
//         </h2>
//       </div>
//       <div className="w-[95%] border-gray-500 border-[1px] rounded-md">
//         {criteriaGrades.map((criterion, idx) => (
//           <div
//             key={idx}
//             className="flex justify-between p-2 border-b last:border-b-0"
//           >
//             <span>{criterion.name}</span>
//             <span className="border-l-2  border-gray-600 pl-3 ">
//               {criterion.value}
//             </span>
//           </div>
//         ))}
//       </div>

//       <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//         Student's comment:
//       </h2>
//       <div className="w-[95%] min-h-[70px] border-gray-500 border-[1px] rounded-md p-2">
//         {/* Placeholder for student's comment */}I didn't get how to make
//         presentation, so I used Canva. Is it ok?
//       </div>
//     </div>
//     {/* Divider */}
//     <div className="border-2 bg-gray-500 mx-5"></div>
//     {/* Right Side: Grading and Comments */}
//     <div className="w-1/2 pl-5 flex flex-col items-end">
//       <div className="w-[95%]">
//         <h2 className=" pl-2 font-bold text-lg text-gray-700">
//           Student's submission:
//         </h2>
//         <a
//           href={"#"}
//           download
//           target="_blank"
//           rel="noopener noreferrer"
//           className="w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 underline text-blue-500 block"
//         >
//           cross-check-preza.pdf
//         </a>

//         <div className="flex justify-between w-[95%]">
//           <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//             Criteria
//           </h2>
//           <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//             Points
//           </h2>
//         </div>
//         <div className="w-full border-gray-500 border-[1px] rounded-md flex flex-col">
//           {criteriaGrades.map((criterion, idx) => (
//             <div
//               key={idx}
//               className="flex items-center justify-between p-2 border-b last:border-b-0"
//             >
//               <span>{criterion.name}</span>
//               <div className="flex items-center w-[35%]">
//                 <input
//                   type="range"
//                   min="0"
//                   max={criterion.value}
//                   value={criterion.grade}
//                   onChange={(e) => handleGradeChange(idx, e.target.value)}
//                   className="w-full"
//                 />
//                 <span className="text-gray-500 ml-2">
//                   {criterion.grade}/{criterion.value}
//                 </span>
//                 {parseInt(criterion.grade, 10) === criterion.value && (
//                   <div className="ml-2 p-2 rounded-full bg-green-400 text-white flex justify-center items-center w-6 h-6">
//                     ✔
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//         <h2 className="mt-4 pl-2 font-bold text-lg text-gray-700">
//           Your comment to student's work:
//         </h2>
//         <textarea
//           className="w-full min-h-[70px] border-gray-500 border-2 rounded-md p-2 bg-transparent"
//           placeholder="Your comments here"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         />
//         <button
//           onClick={handleSubmit}
//           className="py-2 px-6 mt-5 rounded-lg bg-lime-400 text-white font-bold border-4 border-cyan-400"
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
//   )
// }

// export default OneStudentReviewComponent;
