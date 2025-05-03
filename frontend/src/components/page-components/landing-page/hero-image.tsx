"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import YouTubeEmbed from "./youtube-embed";
export function HeroImage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-300 mix-blend-multiply blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -right-4 top-0 h-72 w-72 rounded-full bg-yellow-300 mix-blend-multiply blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-pink-300 mix-blend-multiply blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
             
              <YouTubeEmbed src="https://www.youtube.com/embed/jzdqW6aX4dE?rel=0&si=LLI2tDVS7oKP-aoF&autoplay=1&mute=0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
