"use client";

import React, { useState, useEffect } from "react";
import OneCrossCheck from "../coursePage/OneCrossCheck";
import axios from "axios";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import OneStudentReviewComponent from "./OneStudentReviewComponent";
import happyVector from "../../../public/images/happy-woman-vector.png";


const CrossCheckReview = ({ assignmentId, courseId }) => {
  const [assignment, setAssignment] = useState(null);
  const [answersInfo, setAnswersInfo] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch assignment info
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("Access token not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/assignment/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setAssignment(response.data.assignment);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch assignment data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/v1/main", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserId(response.data.user.id);
        console.log("user_id: ", response.data.user.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserId();
  }, []);
  // Fetch reviewers' answers (students to review)
  useEffect(() => {
    const fetchAnswersInfo = async () => {
      try {
        if (!userId) return; // Wait until userId is set

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("Access token not found");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/cross_review/check?assignment_id=${assignmentId}&reviewer_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setAnswersInfo(response.data.answers_info);
        console.log("response.data.answers_info", response.data.answers_info);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch answers info");
      }
    };

    fetchAnswersInfo();
  }, [assignmentId, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col w-[95%] items-center min-h-screen pt-5">
      {/* Assignment Info */}
      <div className="flex flex-col w-full items-center">
        <div className="w-full h-[30px] font-semibold mt-3 mb-3 pl-2 pr-2 flex items-center justify-between text-[0.85rem] ">
          <div className="w-[70px]">Status</div>
          <div className="w-[70px] -ml-10">Title</div>
          <div className="w-[10px] -ml-5">Type</div>
          <div className="w-[60px]">Start date</div>
          <div className="w-[55px]">End date</div>
          <div>Weight</div>
        </div>
        {assignment && (
          <OneCrossCheck
            data={assignment}
            assignmentId={assignmentId}
            courseId={courseId}
          />
        )}
      </div>

      {/* Check if all students are reviewed */}
      {answersInfo.length > 0 &&
      answersInfo.every((student) => student.status === "Checked") ? (
        <div className="text-3xl flex flex-col items-center mt-20 font-bold text-gray-500">
        You reviewed every work! Well Done!
        <Image
          src={happyVector}
          width={200}
          height={200}
          alt="vector image"
        />
      </div>
      ) : (
        <Tabs defaultValue="student-0" className="border-2 w-full">
          <TabsList className="w-full flex justify-center space-x-6">
            {answersInfo.map((student, index) => (
              <TabsTrigger
                key={index}
                value={`student-${index}`}
                className="size-32 border-2 border-sky-600 rounded-full flex flex-col"
                onClick={() => setSelectedStudent(student)}
              >
                <User className="text-sky-600 w-8 h-8" />
                <p className="font-bold text-sky-600 text-lg">
                  Student {index + 1}
                </p>
              </TabsTrigger>
            ))}
          </TabsList>

          {answersInfo.map((student, index) => (
            <TabsContent key={index} value={`student-${index}`}>
              <OneStudentReviewComponent
                assignmentId={assignmentId}
                student={student}
                selectedStudentIndex={index}
                assignment={assignment}
                answer_id={answersInfo[index].answer_id}
                answer_review_id={answersInfo[index].answer_review_id}
                status={answersInfo[index].status}
                userId={userId}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

    </div>
  );
};

export default CrossCheckReview;
