"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
// import { registrationEmailSchema, registrationPersonalInfoSchema, registrationPasswordSchema } from "@/lib/schemas";
import { registerUser } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  name: string;
  surname: string;
  university_id: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Single useForm instance for all steps
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      university_id: "",
      password: "",
    },
  });

  const formData = watch(); // Watch form values in real-time

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser({ ...data });
      console.log(response)
      toast({
        variant: "success",
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      localStorage.setItem('accessToken', response.token)
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="flex items-center w-full register-bg justify-center min-h-screen bg-cover text-gray-700">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-xl text-center">SIGN UP</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSubmit(() => nextStep())} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Please, enter your email:</Label>
                <Input id="email" type="email" placeholder="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(() => nextStep())} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Please, enter your name</Label>
                <Input id="name" placeholder="name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Please, enter your surname</Label>
                <Input id="surname" placeholder="surname" {...register("surname")} />
                {errors.surname && <p className="text-sm text-red-500">{errors.surname.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="university_id">Please, enter your university ID</Label>
                <Input id="university_id" placeholder="University ID" {...register("university_id")} />
                {errors.university_id && <p className="text-sm text-red-500">{errors.university_id.message}</p>}
              </div>
              <div className="flex justify-between">
                <Button type="button" onClick={prevStep} variant="secondary">Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="flex justify-between">
                <Button type="button" onClick={prevStep} variant="secondary">Back</Button>
                <Button type="submit">Register</Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
