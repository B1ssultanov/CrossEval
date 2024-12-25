"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";

// Function to check if the end date has passed
const isEndDatePassed = (endDate) => {
  const endDateObj = new Date(endDate);
  const currentDate = new Date();
  return endDateObj > currentDate;
};

const OneCrossCheck = ({ data, index, assignmentId, courseId }) => {
  const { end_date, status, type, title, start_date, weight } = data;
  const result = isEndDatePassed(end_date);

  const crossCheckValue = result ? "submit" : "review";

  const getStatusColor = () => {
    switch (status) {
      case "Submitted":
        return "bg-green-600";
      case "Available":
        return "bg-yellow-400";
      case "Done":
        return "bg-green-500";
      case "Missed":
        return "bg-red-600";
      default:
        return "bg-blue-400";
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "essay":
        return {
          bgColor: "bg-green-200",
          textColor: "text-green-700",
          borderColor: "border-green-600",
        };
      case "project":
        return {
          bgColor: "bg-blue-200",
          textColor: "text-blue-700",
          borderColor: "border-blue-600",
        };
      case "quiz":
        return {
          bgColor: "bg-red-200",
          textColor: "text-red-700",
          borderColor: "border-red-600",
        };
      case "code":
        return {
          bgColor: "bg-purple-200",
          textColor: "text-purple-700",
          borderColor: "border-purple-600",
        };
      case "presentation":
        return {
          bgColor: "bg-yellow-200",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-600",
        };
      default:
        return {
          bgColor: "bg-gray-200",
          textColor: "text-gray-700",
          borderColor: "border-gray-600",
        };
    }
  };

  const getBgColor = () => {
    return index % 2 === 0 ? "bg-[#EBEEF3]" : "bg-white";
  };

  const cutTitle = () => {
    return title.length > 15 ? `${title.substring(0, 15)}...` : title;
  };

  const typeStyles = getTypeStyles();

  return (
    <Link
      href={{
        pathname: `/${crossCheckValue}/${assignmentId}`,
        query: { courseId: courseId },
      }}
      className={clsx(
        "flex w-full items-center space-x-3 hover:bg-green-100 transition-all duration-300 hover:scale-[100.5%]",
        index >= 0
          ? "rounded-3xl pl-2 pr-2"
          : "border-4 mb-3 rounded-xl border-blue-400"
      )}
    >
      {index >= 0 && <div className="text-xs font-bold">{index + 1}</div>}

      <div
        className={clsx(
          "w-full pt-3 pb-3 flex text-[10px] items-center justify-between hover:bg-green-100 transition-colors duration-200 rounded-xl pl-5 pr-5",
          getBgColor()
        )}
      >
        <div className="flex items-center justify-start space-x-1 w-[70px]">
          <div
            className={clsx(
              "w-[7px] h-[7px] flex items-center justify-center rounded-full",
              getStatusColor()
            )}
          ></div>
          <div className="w-[57px] text-sm">{status}</div>
        </div>
        <div className="w-[145px] text-sm font-bold">{cutTitle()}</div>
        <div
          className={clsx(
            "min-w-[100px] text-sm p-2 font-bold border-2 rounded-full text-center",
            typeStyles.borderColor,
            typeStyles.bgColor,
            typeStyles.textColor
          )}
        >
          {type}
        </div>
        <div className="w-[105px] text-sm text-gray-500 font-bold break-words flex items-center text-center mr-2">
          {start_date}
        </div>
        <div className="w-[105px] text-sm text-gray-500 font-bold break-words flex items-center text-center">
          {end_date}
        </div>
        <div className="font-bold text-base">
          <span className="text-green-500 font-bold mr-1 text-lg">{weight}</span>
          p
        </div>
      </div>
    </Link>
  );
};

export default OneCrossCheck;
