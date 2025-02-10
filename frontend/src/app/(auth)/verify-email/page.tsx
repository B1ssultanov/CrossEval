"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail } from "@/api/auth";

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setError("Токен не найден в параметрах URL.");
        setLoading(false);
        return;
      }

      try {
        const { access_token, refresh_token } = await verifyEmail(token);

        // Save tokens to localStorage
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        // Redirect to the main page
        router.push("/");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Произошла ошибка при верификации email.");
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [router]);

  if (loading) {
    return (
      <main className="w-full flex h-screen items-center justify-center">
        <h1>Проверка...</h1>
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

  return (
    <main className="w-full flex h-screen items-center justify-center">
      <h1>Верификация успешна! Перенаправление...</h1>
    </main>
  );
};

export default VerifyEmail;
