"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import { CookieIcon } from "lucide-react";

const CookieBanner: React.FC = () => {
  const [isBannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setBannerVisible(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setBannerVisible(false);
    // Enable analytics or other scripts here if needed
    console.log("All cookies accepted");
  };

  const acceptNecessaryCookies = () => {
    localStorage.setItem("cookieConsent", "necessary-only");
    setBannerVisible(false);
    console.log("Only necessary cookies accepted");
  };

  if (!isBannerVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 sm:left-4 sm:w-[400px] lg:w-[500px] xl:w-[600px] bg-gray-800 text-white rounded-lg shadow-lg p-6 z-50 animate-fadein"
      )}
    >
      <div className="flex items-start justify-center gap-4">
        {/* <AlertCircle className="text-blue-400 w-8 h-8" /> */}
        <div>
          <CookieIcon className="size-14 mb-4" />
          <p className="text-sm mb-4">
            By continuing usage of this website you confirm that you will be using cookie.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button
              onClick={acceptAllCookies}
              className="bg-blue-500 w-full text-white hover:bg-blue-600"
            >
              Ok
            </Button>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default CookieBanner;
