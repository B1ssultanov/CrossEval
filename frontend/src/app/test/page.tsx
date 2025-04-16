"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { registrationEmailSchema, registrationPersonalInfoSchema, registrationPasswordSchema } from "@/lib/schemas"
import { getPasswordStrength } from "@/utils/passwordStrength"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    studentId: "",
    password: "",
  })

  const emailForm = useForm({
    resolver: zodResolver(registrationEmailSchema),
  })

  const personalInfoForm = useForm({
    resolver: zodResolver(registrationPersonalInfoSchema),
  })

  const passwordForm = useForm({
    resolver: zodResolver(registrationPasswordSchema),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitEmail = (data: any) => {
    setFormData({ ...formData, ...data })
    setStep(2)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitPersonalInfo = (data: any) => {
    setFormData({ ...formData, ...data })
    setStep(3)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitPassword = async (data: any) => {
    setFormData({ ...formData, ...data })
    // Here you would typically send the complete formData to your backend
    console.log({ ...formData, ...data })
    // For demonstration, we'll just show a success message
    setError(null)
    alert("Registration successful!")
  }

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-gray-200"
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...emailForm.register("email")} />
                {emailForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{emailForm.formState.errors.email?.message as string}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...personalInfoForm.register("name")} />
                {personalInfoForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{personalInfoForm.formState.errors.name?.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" {...personalInfoForm.register("surname")} />
                {personalInfoForm.formState.errors.surname && (
                  <p className="text-sm text-red-500">{personalInfoForm.formState.errors.surname?.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" {...personalInfoForm.register("studentId")} />
                {personalInfoForm.formState.errors.studentId && (
                  <p className="text-sm text-red-500">{personalInfoForm.formState.errors.studentId?.message as string}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...passwordForm.register("password")}
                  onChange={(e) => {
                    passwordForm.register("password").onChange(e)
                    const strength = getPasswordStrength(e.target.value)
                    const progressElement = document.getElementById("password-strength")
                    if (progressElement) {
                      progressElement.className = `h-2 w-full ${getPasswordStrengthColor(strength)}`
                      progressElement.style.width = `${strength === "weak" ? 33 : strength === "medium" ? 66 : 100}%`
                    }
                  }}
                />
                {passwordForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{passwordForm.formState.errors.password?.message as string}</p>
                )}
                <div className="w-full bg-gray-200 h-2 mt-2">
                  <div id="password-strength" className="h-2 w-0 bg-gray-200 transition-all duration-300"></div>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

