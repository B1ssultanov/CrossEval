"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Book, Users, FileText, CheckCircle, Repeat, UserCog, UserCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PlatformExplainer() {
  const [activeMode, setActiveMode] = useState<"teacher" | "student">("teacher")
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const teacherSteps = [
    {
      title: "Create Courses",
      description: "Design and organize courses with customizable modules and materials.",
      icon: <Book className="h-8 w-8" />,
    },
    {
      title: "Create Assignments",
      description: "Set up assignments with detailed instructions, deadlines, and grading criteria.",
      icon: <FileText className="h-8 w-8" />,
    },
    {
      title: "Review Submissions",
      description: "Review student submissions and provide feedback to help them improve.",
      icon: <CheckCircle className="h-8 w-8" />,
    },
  ]

  const studentSteps = [
    {
      title: "Join Courses",
      description: "Easily join courses using invitation codes provided by your teachers.",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Submit Assignments",
      description: "Complete and submit assignments directly through the platform.",
      icon: <FileText className="h-8 w-8" />,
    },
    {
      title: "Peer Assessment",
      description: "Participate in peer assessment to provide feedback to fellow students.",
      icon: <CheckCircle className="h-8 w-8" />,
    },
  ]

  const currentSteps = activeMode === "teacher" ? teacherSteps : studentSteps

  // Auto-advance steps
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === currentSteps.length - 1) {
          // Switch modes when we reach the end of steps
          setActiveMode((prevMode) => (prevMode === "teacher" ? "student" : "teacher"))
          return 0
        }
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [activeStep, currentSteps.length, isAutoPlaying, activeMode])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Flexible Learning
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              One Platform, <span className="text-indigo-500">Two</span> Powerful <span className="text-indigo-500">Modes</span>
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Seamlessly switch between Teacher and Student modes to create or join courses, manage assignments, and
              collaborate with peers.
            </p>
          </div>
        </div>

        <div
          className="relative mx-auto max-w-5xl rounded-2xl border bg-white p-6 shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Mode Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center rounded-full border p-1 bg-gray-50">
              <Button
                variant="ghost"
                className={cn(
                  "relative rounded-full px-4",
                  activeMode === "teacher" && "bg-white shadow-sm text-indigo-500"
                )}
                onClick={() => {
                  setActiveMode("teacher")
                  setActiveStep(0)
                }}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Teacher Mode
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "relative rounded-full px-4",
                  activeMode === "student" && "bg-white text-indigo-500 shadow-sm"
                )}
                onClick={() => {
                  setActiveMode("student")
                  setActiveStep(0)
                }}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Student Mode
              </Button>
            </div>
          </div>

          {/* Mode Description */}
          <div className="text-center mb-8">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h3 className="text-2xl font-bold text-indigo-500">
                {activeMode === "teacher" ? "Teacher Mode" : "Student Mode"}
              </h3>
              <p className="text-gray-500 max-w-2xl mx-auto">
                {activeMode === "teacher"
                  ? "Create and manage courses, design assignments, and review student submissions."
                  : "Join courses, complete assignments, and participate in peer assessment activities."}
              </p>
            </motion.div>
          </div>

          {/* Feature Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {currentSteps.map((step, index) => (
                <motion.div
                key={`${activeMode}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: index === activeStep ? 1 : 0.6, 
                  y: 0,
                  scale: index === activeStep ? 1.05 : 1
                }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "flex flex-col items-center p-6 text-center rounded-xl border cursor-pointer",
                  index === activeStep ? "border-primary bg-primary/5 shadow-md" : "bg-white"
                )}
                onClick={() => setActiveStep(index)}
                >
                <div
                  className={cn(
                  "mb-4 rounded-full p-3",
                  index === activeStep ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-gray-500">{step.description}</p>
                </motion.div>
            ))}
          </div>

          {/* Mode Switching Animation */}
          <div className="flex justify-center items-center p-6 rounded-xl bg-gray-50 border border-dashed">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <span className="mt-2 text-sm font-medium">Teacher</span>
              </div>

              <motion.div
                animate={{
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="rounded-full bg-gray-100 p-2"
              >
                <Repeat className="h-5 w-5 text-gray-500" />
              </motion.div>

              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <span className="mt-2 text-sm font-medium">Student</span>
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {currentSteps.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full",
                  index === activeStep ? "bg-primary" : "bg-gray-300"
                )}
                onClick={() => setActiveStep(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
