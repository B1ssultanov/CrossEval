import React from 'react'
import GradesTable from '@/components/ant-design/GradesTable'

const GradesPage = () => {
  return (
    <div className='w-full flex flex-col items-center min-h-screen '>
        GLobalGrades
        <div className='w-[90%] mt-10'> 
            <GradesTable />
        </div>

    </div>
  )
}

export default GradesPage