"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/schemas";
import { loginUser } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);
      
      toast({
        variant: "success",
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Save token to localStorage
      localStorage.setItem("accessToken", response.token);

      // Redirect to homepage after login
      router.push("/");
    } catch (error) {
      setError((error as Error).message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen register-bg  w-full bg-gray-100 text-gray-700">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-center text-xl">LOG IN</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="enter your email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email?.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="enter your password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password?.message}</p>}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
