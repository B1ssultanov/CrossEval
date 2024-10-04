"use client"; // Mark this as a Client Component

import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClientLayout({ children }) {
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated by checking localStorage for the accessToken
    const token = localStorage.getItem('accessToken');

    if (token) {
      setIsUserAuthorized(true); // Set user as authorized if token is found

      // Fetch the user's courses
      const fetchCourses = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/v1/main', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCourses(response.data.courses); // Save courses to state
        } catch (error) {
          console.error('Failed to fetch courses', error);
        } finally {
          setLoading(false); // Stop loading once the data is fetched
        }
      };

      fetchCourses();
    } else {
      setLoading(false); // If no token, just stop loading without fetching courses
    }
  }, []);

  // Loading state while fetching courses and checking auth
  
  return (
    <div className="flex flex-col w-full min-h-[100vh]">
      {/* Sidebar will be visible on all pages */ }
      <Navbar isUserAuthorized={isUserAuthorized} /> {/* Pass auth status to Navbar */}
      
      {/* Main content area */}
      <div className="flex">
        <SideBar role={isUserAuthorized ? "student" : "guest"} courses={isUserAuthorized ? courses : []} />
        {children} {/* The content of each page */}
      </div>
    </div>
  );
}
