"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 lg:px-20 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/assets/icons/CrossEvalLogo.png"
            width={150}
            height={100}
            alt="logo"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#about"
            className="text-sm font-medium hover:text-primary"
          >
            Why CrossEval
          </Link>

          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary"
          >
            How It Works
          </Link>

          <Link href="#faq" className="text-sm font-medium hover:text-primary">
            FAQ
          </Link>

          <Link
            href="landing-page/contact-us"
            className="text-sm font-medium hover:text-primary"
          >
            Contact Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant={"indigo"} onClick={() => router.push("/")} size="sm">
            Start Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col space-y-4">
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Why CrossEval
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>

            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>

            <Link
              href="/landing-page/contact-us"
              className="text-sm font-medium hover:text-primary"
            >
              Contact Us
            </Link>
            <div className="pt-4 border-t">
              <Button size="sm" className="w-full">
                Start Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
