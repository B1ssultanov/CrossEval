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
  const [submissionStatus, setSubmissionStatus] = useState("");

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
        setSubmissionStatus(assignmentData.status);
        console.log("assignmentData:", submissionStatus);

        if (assignmentData.rubrics_id) {
          setRubricsUrl(
            `http://127.0.0.1:8000/file/${assignmentData.rubrics_id}`
          );
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
      window.location.reload();
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
        <OneCrossCheck
          data={assignment}
          assignmentId={assignmentId}
          courseId={courseId}
        />
      </div>
      {submissionStatus == "Available" ? (
        <div className="w-full flex mt-5">
          <div className="w-1/2 pr-5">
            <h2 className="pl-2 font-bold text-lg text-gray-700">
              Description:
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
                <button
                  onClick={async () => {
                    try {
                      console.log("Starting rubrics download...");
                      const accessToken = localStorage.getItem("accessToken");
                      if (!accessToken) {
                        alert("No access token found. Please log in.");
                        console.error("Access token not found.");
                        return;
                      }

                      const response = await axios.get(rubricsUrl, {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                        },
                        responseType: "blob", // Important to handle file downloads
                      });

                      console.log("Download successful. Preparing file...");
                      const url = window.URL.createObjectURL(
                        new Blob([response.data])
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        `rubrics-${assignmentId || "file"}.pdf` // Set default filename
                      );
                      document.body.appendChild(link);
                      link.click();
                      link.remove();

                      console.log("Rubrics downloaded successfully.");
                    } catch (err) {
                      console.error("Failed to download rubrics:", err);
                      alert("Failed to download rubrics. Please try again.");
                    }
                  }}
                  className="underline text-blue-500"
                >
                  Download Rubrics
                </button>
              ) : (
                <span className="text-gray-500"> No rubrics available</span>
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
                  <span className="border-l-2 border-gray-600 pl-3">
                    {criterion.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[2px] bg-black mx-5"></div>

          <div className="w-1/2 pl-5 flex flex-col items-end">
            <div className="w-[95%] flex flex-col">
              <div className="mb-4 w-full">
                <label className="block text-gray-700 font-bold text-lg mb-2">
                  Submission:
                </label>
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
                    <span className="font-bold text-blue-600">
                      Choose a file
                    </span>{" "}
                    or drag it here
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
                    Selected file:{" "}
                    <span className="font-semibold">{answerFile.name}</span>
                  </p>
                )}
              </div>

              <h2 className="mt-4 font-bold text-lg text-gray-700">
                Your comment to reviewer:
              </h2>
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
      ) : (
        <div>
          <h1 className="text-xl text-center mt-20 text-gray-600">
            You've already submitted the task, <br /> Please wait till{" "}
            <strong>Cross-Check: Review</strong> starts
          </h1>
        </div>
      )}
    </div>
  );
};

export default CrossCheckSubmit;
