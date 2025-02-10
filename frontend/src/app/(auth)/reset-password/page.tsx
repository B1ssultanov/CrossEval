"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Lottie from "lottie-react";
import successAnimation from "@/animations/lottie/fireworks.json";

const PasswordReset: React.FC = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");

    if (!tokenFromURL) {
      setError("Токен не найден в параметрах URL.");
      setLoading(false);
      return;
    }

    setToken(tokenFromURL);
    setLoading(false);
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Ошибка",
        description: "Токен отсутствует. Пожалуйста, проверьте ссылку.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать не менее 8 символов.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        "https://api.atlantys.kz/api/v1/auth/reset-password",
        { token, new_password: newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast({
          title: "Ошибка",
          description: err.response.data.message || "Произошла ошибка.",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", err);
        toast({
          title: "Ошибка",
          description: "Не удалось сбросить пароль. Попробуйте позже.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full flex h-screen items-center justify-center">
        <h1>Загрузка...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-red-500">Ошибка</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="w-full flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Lottie
            animationData={successAnimation}
            loop={false}
            style={{ width: 300, height: 300 }}
          />
          <p className="text-lg font-semibold text-center mt-4">
            Пароль успешно изменен!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handlePasswordChange}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Сбросить пароль</h2>
        <div className="mb-4">
          <Label htmlFor="new-password">Новый пароль</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="pr-10"
              placeholder="Введите новый пароль"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Изменение..." : "Сменить пароль"}
        </Button>
      </form>
    </main>
  );
};

export default PasswordReset;
