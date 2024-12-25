"use client"; 

import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClientLayout({ children }) {
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if(window){
      setRole(localStorage.getItem('role'))
    }

    if (token) {
      setIsUserAuthorized(true);

      const fetchCourses = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/main?role=${role}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCourses(response.data.courses); 
        } catch (error) {
          console.error('Failed to fetch courses', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCourses();
    } else {
      setLoading(false); 
    }
  }, []);

  
  return (
    <div className="flex flex-col w-full min-h-[100vh] dinround">
      <Navbar isUserAuthorized={isUserAuthorized} />
      
      <div className="flex">
        <SideBar role={isUserAuthorized ? "student" : "guest"} courses={isUserAuthorized ? courses : []} />
        {children}
      </div>
    </div>
  );
}
