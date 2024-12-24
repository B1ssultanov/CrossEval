import React, { useState, useEffect } from "react";
import { StudentIcon } from "../svg/StudentIcon";
import { TeacherIcon } from "../svg/TeacherIcon";
import Switch from "react-switch";

const CustomSwitch = () => {
    const [isSupervisor, setIsSupervisor] = useState(false);
    const [role, setRole] = useState("Student");

    // Load the role from localStorage on initial render
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
            setIsSupervisor(storedRole === "Supervisor");
        }
    }, []);

    const handleChange = (checked) => {
        const newRole = checked ? "Supervisor" : "Student";
        setRole(newRole);
        setIsSupervisor(checked);

        // Save the role in localStorage
        localStorage.setItem("role", newRole);
        window.location.reload();
    };

    return (
        <div className="flex items-center space-x-2">
            <StudentIcon />
            <Switch
                checked={isSupervisor}
                onChange={handleChange}
                offColor="#b3b3b3"
                onColor="#6066f7"
                offHandleColor="#fff"
                onHandleColor="#fff"
                height={30}
                width={60}
                handleDiameter={25}
                uncheckedIcon={false}
                checkedIcon={false}
                className="custom-switch"
            />
            <TeacherIcon />
        </div>
    );
};

export default CustomSwitch;
