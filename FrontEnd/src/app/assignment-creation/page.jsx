import React from "react";
import AssignmentCreateForm from "@/components/assignment/AssignmentCreateForm";

const AssignmentCreationPage = () => {
   
    return (
        <div className="w-full bg-purple-300 h-screen flex flex-col items-center">
            <h1>Create Assignment for Course ID: </h1>
            <AssignmentCreateForm />
        </div>
    );
};

export default AssignmentCreationPage;
