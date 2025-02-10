"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/api/auth";
import { AxiosError } from "axios";

export function SignUpForm() {
  // const router = useRouter();
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email не подходящий";
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$/; // Updated regex to include at least one number

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Длина пароля должна быть от 8 до 64 символов, минимум одна цифра, минимум одна строчная и минимум одна заглавная буква";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Call the register API function
      console.log('password: ', formData.email)
      console.log('password: ', formData.password)
      await register(formData.email, formData.password);

      toast({
        title: "Верификация",
        description: "На ваш email была выслана ссылка для верификации",
        variant: "success",
      });

      setVerificationEmailSent(true);

      setLoading(false);

      // router.push("/");
    } catch (error) {
      setLoading(false);
      if (isAxiosError<{ detail: string }>(error)) {
        toast({
          title: "Регистрация не удалась",
          description: error.response?.data?.detail || "Возникла ошибка.",
          variant: "destructive",
        });
        console.error("Registration error:", error.response?.data?.detail);
      } else {
        console.log("Registration error:", error);
        if (error == "Error: User already exists") {
          toast({
            title: "Регистрация не удалась",
            description: "Пользователь с таким email уже существует",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Регистрация не удаласьфвф",
            description: "Произошла неизвестная ошибка. Попробуйте снова.",
            variant: "destructive",
          });
          console.error("Unexpected registration error:", error);
        }
      }
    }
  };

  function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return (error as AxiosError<T>)?.isAxiosError !== undefined;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl self-center">Регистрация</CardTitle>
          <CardDescription className="text-center text-xs">
            Создайте аккаунт чтобы начать
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="придумайте пароль"
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {verificationEmailSent && (
                <div className="w-full rounded-lg border-2 text-center flex p-4 items-center bg-cyan-500/30">
                  <p className="text-sm text-sky-700">
                    Ссылка для подтверждения верификации выслана на вашу почту,
                    пожалуйста, перейдите по ней <br />
                    (через это же устройтсво)
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="blue"
              size="lg"
              type="submit"
              className="w-full mt-10 mb-4"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "зарегистрироваться"
              )}
            </Button>
            <span className="text-xs text-mygray font-semibold">
              By registering you agree with CrossEval{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={"/privacy-policy"}
                className="text-sky-600 underline"
              >
                privacy policy
              </Link>{" "}
            </span>
          </form>
          <div className="mt-4 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link href={"/login"} className="underline">
              Войти
            </Link>
          </div>
        </CardContent>
      </Card> 
    </div>
  )
}
