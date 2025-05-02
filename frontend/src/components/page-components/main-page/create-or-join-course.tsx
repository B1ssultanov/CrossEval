"use client"

import { useState } from "react"
import { CirclePlus, BookPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { CreateCourseModal } from "@/components/modals/create-course-modal"
import { JoinCourseModal } from "@/components/modals/join-course-modal"

export default function CreateOrJoinCourse() {
  const mode = useSelector((state: RootState) => state.mode.mode)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      {mode === "supervisor" ? (
        <>
          <Button variant="gray" className="mr-4" onClick={() => setIsCreateModalOpen(true)}>
            <span className="hidden md:block">Create course</span> <CirclePlus className="md:ml-2" />
          </Button>
          <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
      ) : (
        <>
          <Button variant="gray" className="mr-4" onClick={() => setIsJoinModalOpen(true)}>
            <span className="hidden md:block">Join course</span> <BookPlus className="md:ml-2" />
          </Button>
          <JoinCourseModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />
        </>
      )}
    </div>
  )
}

