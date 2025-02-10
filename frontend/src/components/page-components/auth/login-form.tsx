"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordResetModal } from "@/components/modals/password-reset-modal";
import { login } from "@/api/auth";
import { AxiosError } from "axios";

export function LoginForm() {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear errors on input change
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      // Call the login API function
      const { access_token, refresh_token } = await login(
        formData.email,
        formData.password
      );

      // Successful login
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Redirect to the main page
      setLoading(false)
      router.push("/");
    } catch (err: unknown) {
      setLoading(false)
      console.log(err)
      if (isAxiosError<{ detail: string }>(err)) {
        setError(err.response?.data?.detail || "Ошибка авторизации.");
      } else {
        if(err == 'Error: Incorrect Password'){
          setError("Неверный пароль");
        }else if(err == 'Error: User not found'){
          setError("Пользователь не найден");
        }else{
          setError("Произошла неизвестная ошибка. Попробуйте снова.");
        }
      }
    }
  };

  function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return (error as AxiosError<T>)?.isAxiosError !== undefined;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl self-center">Логин</CardTitle>
          <CardDescription className="text-center text-xs">
            Введи email чтобы зайти на свой аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">пароль</Label>
                  <button
                    onClick={() => setIsResetModalOpen(true)}
                    type="button"
                    className="ml-auto inline-block text-xs underline"
                  >
                    Забыли пароль?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="пароль"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button variant="blue" size="lg" type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : 'войти с email' }
                
              </Button>
              <div className="flex items-center w-full">
                <div className="w-1/2 border"></div>
                <p className="px-3 text-gray-400">или</p>
                <div className="w-1/2 border"></div>
              </div>
              {/* 
              
              */}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            нет аккаунта?{" "}
            <Link href={"/register"} className="underline">
              создать
            </Link>
          </div>
        </CardContent>
      </Card>
      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
