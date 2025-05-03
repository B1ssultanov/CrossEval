"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function PeopleInterract() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Interaction Overview
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How <span className="text-indigo-500">Teachers</span> and{" "}
              <span className="text-indigo-500">Students</span> Collaborate
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A visual breakdown of roles, actions, and feedback loops that power the CrossEval ecosystem.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-white p-4 shadow-lg"
        >
          <div className="relative w-full h-auto aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/assets/images/decoration/people.webp" 
              alt="Teacher-Student Interaction Diagram"
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
