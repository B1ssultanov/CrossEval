"use client";
import React from 'react';
import CourseInfo from '@/components/coursePage/CourseInfo';
import Image from 'next/image';
import settings from '../../../public/images/settings.png'

const Course = ({params}) => {
    const courseInfo = ["INF 123", "Backend", "Yedige Bissultanov", "red"]

    return (
        <div className='w-full h-screen flex flex-col items-center'>
            <div className='w-[97%] flex flex-col'>
                <CourseInfo courseInfo={courseInfo}/>
                <div className='flex space-x-2 mt-3 mb-3'>
                    <div className='w-[118px] h-[50px] border-2 border-black rounded-[20px] flex flex-col items-center justify-center '>
                        <p className='text-sm'>Course code:</p>
                        <div className='text-black bg-[#9FC6F1] px-6 py-[1px] rounded-3xl text-xs font-semibold'>13HA42</div>
                    </div>
                    <div className='w-[118px] h-[50px] border-2 border-black rounded-[20px] flex items-center justify-evenly'>
                        <Image src={settings} className='w-[25px]'/>
                        <div className='text-blue-600 underline flex justify-around'>Syllabus</div>
                    </div>
                </div>
                <div className='font-semibold text-lg tracking-tighter'>Cross-checks:</div>
                <h1 className='text-lg break-words'>Course: {params.courseName}</h1>
            </div>
            
        </div>
    )
}

export default Course;