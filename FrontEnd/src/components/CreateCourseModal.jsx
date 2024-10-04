// components/CourseModal.jsx
import React, { useState } from "react";

const CreateCourseModal = ({accessToken, isOpen, onClose }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = { id, name, group };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,

        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const result = await response.json();
      console.log("Course created:", result);
      alert(`Course ${name} created successfully!`);
      onClose(); 
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the course.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-[-30px] bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium mb-1">
              Course ID
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="MDE123"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Course Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Backend"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="group" className="block text-sm font-medium mb-1">
              Course Group
            </label>
            <input
              type="text"
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="01-N, 01-P"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;
