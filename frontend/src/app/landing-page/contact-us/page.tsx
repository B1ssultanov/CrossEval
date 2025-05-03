// app/landing-page/contact-us/page.tsx
"use client"

import ContactForm from "@/components/page-components/landing-page/contact-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-gray-50 w-full  flex items-center justify-center flex-col">
      <div className="container max-w-3xl py-10 px-4 ">
        {/* Back to landing page button */}
        <div className="mb-6">
          <Link href="/landing-page">
            <Button variant="ghost" className="flex items-center gap-2 text-sm text-indigo-600">
              <ArrowLeft className="w-4 h-4" />
              Back to Landing Page
            </Button>
          </Link>
        </div>

        {/* Contact Form */}
        <ContactForm />
      </div>
    </main>
  )
}
