'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, BarChart3, Users, Phone, Mail, Instagram, MessageCircle } from 'lucide-react'
import { Faq } from "@/components/page-components/landing-page/faq"
import { HeroImage } from "@/components/page-components/landing-page/hero-image"
import { Navbar } from "@/components/page-components/landing-page/navbar"
import { useRouter } from "next/navigation"
import { Logo, LogosScroller } from "@/components/page-components/landing-page/logos-scroller"
import { PlatformExplainer } from "@/components/page-components/landing-page/platform-explainer"
import PeopleInterract from "@/components/page-components/landing-page/people-interract"

const logos: Logo[] = [
  { src: '/assets/logos/sdu.svg', alt: 'React', width: 120, height: 120 },
  { src: '/assets/logos/CrossEvalLogo.png', alt: 'Next.js', width: 120, height: 120 },
  { src: '/assets/logos/iitu.jpeg', alt: 'Tailwind CSS', width: 120, height: 120 },
  { src: '/assets/logos/narxoz.svg', alt: 'React', width: 120, height: 120 },
  { src: '/assets/logos/moodle.webp', alt: 'Next.js', width: 120, height: 120 },
  { src: '/assets/logos/sdu.svg', alt: 'React', width: 120, height: 120 },
  { src: '/assets/logos/CrossEvalLogo.png', alt: 'Next.js', width: 120, height: 120 },
  { src: '/assets/logos/iitu.jpeg', alt: 'Tailwind CSS', width: 120, height: 120 },
  { src: '/assets/logos/narxoz.svg', alt: 'React', width: 120, height: 120 },
  { src: '/assets/logos/moodle.webp', alt: 'Next.js', width: 120, height: 120 },  
  { src: '/assets/logos/sdu.svg', alt: 'React', width: 120, height: 120 },
  { src: '/assets/logos/CrossEvalLogo.png', alt: 'Next.js', width: 120, height: 120 },
  { src: '/assets/logos/iitu.jpeg', alt: 'Tailwind CSS', width: 120, height: 120 },
  { src: '/assets/logos/narxoz.svg', alt: 'React', width: 120, height: 120 },
  { src: '/assets/logos/moodle.webp', alt: 'Next.js', width: 120, height: 120 },

]


export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:pb-32 lg:pt-10 lg:px-20 xl:pb-48 xl:pt-20 bg-gradient-to-b from-white to-gray-100">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Make <span  className="text-indigo-500">Your</span> Evaluations <span className="text-indigo-500">Smarter</span> with <span className="text-indigo-500">CrossEval</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Streamline your processes, boost productivity, and achieve more with our all-in-one solution.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="" variant={'indigo'} onClick={() => router.push('/')}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link target="_blank" className="w-36 border font-thin text-sm hover:bg-gray-200 duration-100 transition-colors flex justify-center items-center rounded-md " href={'https://www.overleaf.com/read/ptpvrdtrvkgj#933f18'}>
                  Learn More
                </Link>
              </div>
              {/* <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
              </div> */}
            </div>
            <div className="flex items-center justify-center">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>



      <PlatformExplainer />
      
      <PeopleInterract />

      {/* Logos Scroller Section */}
      <section className="w-full bg-gray-50">
        <LogosScroller logos={logos} duration={15} gapPx={24} />  
      </section>
      {/* <YouTubeEmbed src="https://www.youtube.com/embed/jzdqW6aX4dE?si=LLI2tDVS7oKP-aoF&autoplay=1&mute=1" /> */}



      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-indigo-500">Everything You Need</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides all the tools you need to succeed. Here&apos;s what sets us apart.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-start space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-indigo-500">Lightning Fast</h3>
              <p className="text-gray-500">
                Our platform is optimized for speed, ensuring you can work efficiently without delays.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2">
                <Shield className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold">Secure & Reliable</h3>
              <p className="text-gray-500">
                Your data is protected with enterprise-grade security and 99.9% uptime guarantee.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-indigo-500">Advanced Analytics</h3>
              <p className="text-gray-500">
                Gain valuable insights with our comprehensive analytics and reporting tools.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2">
                <Users className="text-indigo-500 h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Peer Assessment</h3>
              <p className="text-gray-500">
                Save your time as a teacher and gain more knowledge as a student.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-500">Automation</h3>
              <p className="text-gray-500">
                Automate repetitive tasks and workflows to save time and reduce errors.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center rounded-lg bg-gray-100 p-2 text-indigo-500">
                <Phone />
              </div>
              <h3 className="text-xl font-bold">24/7 support</h3>
              <p className="text-gray-500">
                Dial us at any time, we will help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50" id="how-it-works">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Process, Powerful Results</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is designed to be intuitive and easy to use. Here&apos;s how you can get started.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white bg-indigo-500">
                1
              </div>
              <h3 className="text-xl font-bold">Sign Up</h3>
              <p className="text-gray-500">
                Create your account in minutes.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white">
                2
              </div>
              <h3 className="text-xl font-bold">Join a course</h3>
              <p className="text-gray-500">
                Join a course by course code teacher <br/>shared with you.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white">
                3
              </div>
              <h3 className="text-xl font-bold">Start Learning</h3>
              <p className="text-gray-500">
                Begin using the CrossEval platform and see immediate improvements in your education flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Testimonials Section */}
      {/* <Testimonials /> */}

      {/* Pricing Section */}
      {/* <PricingCards /> */}

      {/* FAQ Section */}
      <Faq />

      {/* <ContactForm /> */}

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                Ready to Transform Your Workflow?
              </h2>
              <p className="max-w-[900px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the list of satisfied users who have improved their learning and teaching productivity with our platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" onClick={()=> router.push('/')} variant={'indigo'} className="text-white">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="w-full py-12 md:py-24 lg:py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Link href="#" className="flex items-center">
                <span className="text-2xl font-bold">CrossEval</span>
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                CrossEval: Smart Evaluations, Smarter Learning.
              </p>
              {/* <div className="mt-4 flex space-x-4">
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div> */}
            </div>
            {/* <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Product</h3>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Features
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Integrations
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Changelog
              </Link>
            </div> */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Contacts</h3>
              <div className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                <Phone className="mr-2 h-4 w-4 inline" />
                <p>+7 707 649 21 97</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                <Mail className="mr-2 h-4 w-4 inline" />
                <p>zhanbolat.mukan2004@gmail.com</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                <Instagram className="mr-2 h-4 w-4 inline" />
                <p>zh.mukan</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                <MessageCircle className="mr-2 h-4 w-4 inline" />
                <p>Telegram: @ZhSherl</p>
              </div>
            </div>
            {/* <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Resources</h3>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Documentation
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Guides
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Support
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                API
              </Link>
            </div> */}
          </div>
          <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CrossEval. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
