// "use client";

// import { useEffect, useState } from "react";
// import CourseFolder from "@/components/CourseFolder";
// import axios from "axios";
// import Link from "next/link";

// const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

// export default function Home() {
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch courses from the API
//         const fetchCourses = async () => {
//             try {
//                 const response = await axios.get(
//                     "http://127.0.0.1:8000/api/v1/main",
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem(
//                                 "accessToken"
//                             )}`,
//                         },
//                     }
//                 );
//                 setCourses(response.data.courses);
//             } catch (err) {
//                 setError("Failed to fetch courses");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCourses();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center w-full h-screen">
//                 Loading...
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center w-full h-screen text-red-500">
//                 {error}
//             </div>
//         );
//     }

//     return (
//         <div className="w-full flex">
           
//             <div className="w-full flex flex-wrap justify-center mt-5">
//                 {courses.map((course, index) => (
//                     <Link
//                         key={course.id}
//                         href={`/course/${course.id}`}
//                         className="hover:mt-[-10px] h-[200px] duration-300 transition-all"
//                     >
//                         <CourseFolder
//                             color={colors[index % colors.length]} // Use the same color
//                             course={[
//                                 course.code,
//                                 course.name,
//                                 course.course_group,
//                             ]}
//                         />
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import CourseFolder from "@/components/CourseFolder";
import axios from "axios";
import Link from "next/link";

const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCourseClick = (courseId) => {
        if(!window) return;
        localStorage.setItem('selectedCourse', courseId);
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/v1/main",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                setCourses(response.data.courses);
            } catch (err) {
                setError("Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center w-full h-screen">
    //             Loading...
    //         </div>
    //     );
    // }

    if (error) {
        return (
            <div className="flex justify-center items-center w-full h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full flex">
            <div className="w-full flex flex-wrap space-x-3 pl-5 pr-5 justify-center mt-5">
                {courses.map((course, index) => (
                    <Link
                        onClick={() => handleCourseClick(course.id)}
                        key={course.id}
                        href={`/course/${course.id}`}
                        className="hover:mt-[-10px] h-fit duration-100 transition-all"
                    >
                        <CourseFolder
                            color={colors[index % colors.length]} // Use the same color
                            course={[
                                course.code,
                                course.name,
                                course.course_group,
                            ]}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
