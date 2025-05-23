"use client"

import {useParams, redirect} from 'next/navigation'
import { useEffect } from 'react'

export default function CrossCheckSubmitPageWithoutAssignmentID(){
  const params = useParams<{courseId: string}>();

  useEffect(() => {
    if(params.courseId) {
      redirect(`/course/${params.courseId}`)
    }
  }, [params.courseId])
  return null;
}