"use client";

import React, { useState } from "react";
import {
    AppstoreOutlined,
    CalendarOutlined,
    LinkOutlined,
    MailOutlined,
    BarChartOutlined,
    ScheduleOutlined, 
    HomeOutlined,
    FileDoneOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Divider, Menu, Switch } from "antd";
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const LessonOutlined = ({lessonName, bg}) => {
    return (
      <div className={`w-6 h-6 rounded-full text-white text-center mr-2 ${bg} flex justify-center items-center`}>
          {lessonName}
      </div>
    )
};

// The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.
const dividerItem = {
    type: "divider", // Must have
    style: { height: "5px", backgroundColor: "lightgray" },
};
const items = [
    getItem("Home Page", "1", <HomeOutlined />),
    getItem("Schedule", "2", <CalendarOutlined />),

    getItem("Tasks", "3", <ScheduleOutlined />),
    getItem("Grades", "4", <BarChartOutlined />),
    dividerItem,
    getItem("My Courses", "sub1", <AppstoreOutlined />, [
        getItem("Backend", "5", <LessonOutlined lessonName={"B"} bg={"bg-red-400"}/>),
        getItem("Big Data", "6", <LessonOutlined lessonName={"B"} bg={"bg-green-400"}/>),
        getItem("FrontEnd", "7", <LessonOutlined lessonName={"F"} bg={"bg-blue-400"}/>),
    ]),
    dividerItem,

    // getItem("Grades", "8", <SettingOutlined />),
   
    //   [
    //     getItem('Option 7', '7'),
    //     getItem('Option 8', '8'),
    //     getItem('Option 9', '9'),
    //     getItem('Option 10', '10'),
    //   ]
    // ),
    //   getItem(
    //     <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
    //       Ant Design
    //     </a>,
    //     'link',
    //     <LinkOutlined />,
    //   ),
];
const App = () => {
    const [mode, setMode] = useState("inline");
    const [theme, setTheme] = useState("light");
    const changeMode = (value) => {
        setMode(value ? "vertical" : "inline");
    };
    const changeTheme = (value) => {
        setTheme(value ? "dark" : "light");
    };
    return (
        <div
            className="absolute right-0 top-12 z-30"
            style={{ height: "90vh", borderLeft: "4px solid lightgray" }}
        >
            {/* <Switch onChange={changeMode} /> Change Mode
      <Divider type="vertical" />
      <Switch onChange={changeTheme} /> Change Style
      <br />
      <br /> */}
            <Menu
                style={{
                    width: 206,
                    marginTop: 0,
                }}
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode={mode}
                theme={theme}
                items={items}
            />
        </div>
    );
};
export default App;
