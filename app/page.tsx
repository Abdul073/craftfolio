"use client"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation bar */}
      <header className="border-b border-border/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              NexFolio
              <span className="text-xs ml-1 bg-blue-600 text-white px-2 py-0.5 rounded">Beta</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-secondary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
              </svg>
            </button>
            <button onClick={() => router.push("/choose-templates")} className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium">
              Create Your Portfolio
            </button>
            <div className="relative">
             
              <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
              {/* {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-secondary">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-secondary">
                    Settings
                  </Link>
                  <Link href="/logout" className="block px-4 py-2 hover:bg-secondary">
                    Logout
                  </Link>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center py-16 md:py-32 text-center">
          {/* Product Hunt Badge */}
          <div className="mb-8">
            <a 
              href="https://www.producthunt.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-black rounded-md px-3 py-1.5 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="mr-2">
                  <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                    P
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">FIND US ON</div>
                  <div className="font-medium text-gray-800">Product Hunt</div>
                </div>
              </div>
            </a>
          </div>

          {/* Hero heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-2">
            Craft Your Portfolio
          </h1>
          <p className="text-3xl md:text-5xl font-bold text-blue-500 mb-8">
            No Code Required!
          </p>

          {/* Hero description */}
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Keeping your portfolio updated can feel like a hassle. But with
            Nexfolio, building and managing a standout portfolio is effortless,
            elegant, and always up to date. Showcase your work with confidence
            —without the complexity
          </p>

          {/* CTA button */}
          <button onClick={()=>router.push('/choose-templates')} className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium">
            Create Your Portfolio
          </button>
        </div>

        {/* Gradient background effect */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-black via-blue-950 to-teal-950 opacity-50"></div>
      </main>
    </div>
  );
}