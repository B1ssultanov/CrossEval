"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import filedrop from "../../../public/images/filedrop.png";
import Image from "next/image";

const AssignmentCreateForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("essay");
  const [isCrossCheck, setIsCrossCheck] = useState(0);
  const [criteriaRows, setCriteriaRows] = useState([
    { criteria: "", points: "" },
  ]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weight, setWeight] = useState("100");
  const [rubricFile, setRubricFile] = useState(null); // To store the selected rubric file
  const [accessToken, setAccessToken] = useState("");
  const [postStatus, setPostStatus] = useState("");

  useEffect(() => {
    if (!window) return;
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  const handleAddRow = () => {
    const totalPoints = criteriaRows.reduce(
      (sum, row) => sum + parseInt(row.points || 0),
      0
    );

    if (totalPoints < parseInt(weight)) {
      setCriteriaRows([...criteriaRows, { criteria: "", points: "" }]);
    } else {
      alert("Total points exceed the specified weight.");
    }
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedRows = [...criteriaRows];
    updatedRows[index][field] = value;
    setCriteriaRows(updatedRows);
  };

  const handleRubricFileChange = (e) => {
    let file;

    // Check if the event is a drag-and-drop event
    if (e.dataTransfer) {
      file = e.dataTransfer.files[0];
    } else {
      file = e.target.files[0];
    }

    if (file) {
      setRubricFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const criteriaString = criteriaRows
      .map((row) => `${row.criteria} ${row.points}`)
      .join(",");

    const formData = new FormData();
    formData.append("course_id", courseId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("isCrossCheck", isCrossCheck ? 1 : 0);
    formData.append("criteria", criteriaString);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("weight", weight);

    // Append the rubric file if it's selected
    if (rubricFile) {
      formData.append("rubrics_file", rubricFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/assignment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // FormData object
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.log('error: ', errorDetails);
        setPostStatus(
          `Failed to create assignment: ${
            errorDetails.message || "Unknown error"
          }`
        );
        throw new Error("Failed to create assignment");
      }

      const result = await response.json();
      setPostStatus(`Assignment "${title}" created successfully!`);
      const successMessage = `Assignment "${title}" created successfully!`;
      alert(successMessage);
      router.push(`/course/${courseId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalPoints = criteriaRows.reduce(
    (sum, row) => sum + parseInt(row.points || 0),
    0
  );
  const canAddMoreCriteria = totalPoints < parseInt(weight);

  return (
    <div className="flex justify-center w-full items-center px-[10%]">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white py-8 rounded-lg flex justify-between"
        encType="multipart/form-data"
      >
        <div className="w-1/2">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Title:</label>
            <input
              type="text"
              value={title}
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-4/5 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
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
              className="w-4/5 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-4/5 border-2 border-gray-300 pl-2 py-2 pr-4 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="essay">Essay</option>
              <option value="project">Project</option>
              <option value="quiz">Quiz</option>
              <option value="code">Code</option>
              <option value="presentation">Presentation</option>
            </select>
          </div>

          {/* Cross Check */}
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 font-bold mr-4">Cross Check</label>
            <input
              type="checkbox"
              checked={isCrossCheck}
              onChange={() =>
                isCrossCheck == 1 ? setIsCrossCheck(0) : setIsCrossCheck(1)
              }
              className="mr-2 size-4"
            />
          </div>

          {/* File Upload for Rubric */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Rubrics:
            </label>
            <div
              className="w-4/5 h-40 border-4 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-300 focus:outline-none"
              onClick={() => document.getElementById("fileInput").click()} // Open file manager on div click
              onDragOver={(e) => e.preventDefault()} // Prevent default behavior when dragging over the div
              onDrop={(e) => {
                e.preventDefault();
                handleRubricFileChange(e); // Handle file drop
              }}
            >
              <Image
                src={filedrop} // Replace with your upload image path
                alt="Upload Icon"
                width={40}
                height={40}
                className="w-12 h-12 mb-3"
              />
              <p className="text-gray-500">
                <span className="font-bold text-blue-600">Choose a file</span>{" "}
                or drag it here
              </p>
            </div>
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.doc,.docx"
              onChange={handleRubricFileChange}
              className="hidden" // Hide the default file input
            />

            {/* Display the selected file name */}
            {rubricFile && (
              <p className="text-gray-600 mt-2">
                Selected file:{" "}
                <span className="font-semibold">{rubricFile.name}</span>
              </p>
            )}
          </div>
        </div>
        <div className="h-screen w-1 bg-gray-200 rounded-full"></div>
        <div className="w-1/2 flex flex-col items-end">
          <div className="mb-4 w-4/5">
            <label className="block text-gray-700 font-bold mb-2">
              Weight:
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border-2  rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          {/* Criteria Table */}
          <div className="mb-6 w-4/5">
            <label className="w-full text-gray-700 font-bold mb-2 flex justify-between">
              <div>Criteria</div>
              <div>Points</div>
            </label>
            <div className="border-gray-300 border-2 rounded-lg p-4">
              {criteriaRows.map((row, index) => (
                <div key={index} className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Criteria"
                    value={row.criteria}
                    onChange={(e) =>
                      handleCriteriaChange(index, "criteria", e.target.value)
                    }
                    className="w-4/5 px-3 py-2 mr-2 border-2  rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  />
                  <input
                    type="number"
                    placeholder="Points"
                    value={row.points}
                    onChange={(e) =>
                      handleCriteriaChange(index, "points", e.target.value)
                    }
                    className="w-20 px-3 py-2 border-2  rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    max={100}
                    min={0}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddRow}
                className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
                  !canAddMoreCriteria ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!canAddMoreCriteria}
              >
                add criteria
              </button>
              {totalPoints > parseInt(weight) && (
                <p className="text-red-500 mt-2">
                  Total points exceed the specified weight.
                </p>
              )}
            </div>
          </div>

          {/* Start Date */}
          <div className="mb-4 w-4/5">
            <h1 className="font-bold text-gray-700 mb-4 text-xl">
              Cross&Check: Submit
            </h1>
            <label className="block text-gray-700 font-bold mb-2">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border-2  rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-4 w-4/5">
            <label className="block text-gray-700 font-bold mb-2">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border-2  rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Start Date */}
          <div className="mb-4 w-4/5">
            <h1 className="font-bold text-gray-700 mb-4 text-xl">
              Cross&Check: Review
            </h1>
          </div>

          {/* End Date */}
          <div className="mb-4 w-4/5">
            <label className="block text-gray-700 font-bold mb-2">
              End Date:
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border-2  rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {/* Weight */}

          <button
            type="submit"
            className="w-4/5 border-4 border-blue-400 bg-green-500 mt-10 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
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
