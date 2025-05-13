import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { UserButton } from "@clerk/nextjs"

const MainNavbar = ({ColorTheme, user, isOpen, setIsOpen} : any) => {
  // Initialize with false (not scrolled)
  const [scrolled, setScrolled] = useState(false);
  
  // Scroll detection effect - separated from the state dependency
  useEffect(() => {
    // Define the scroll handler function
    const handleScroll = () => {
      // Check if window exists (for SSR compatibility)
      if (typeof window !== 'undefined') {
        // Set scrolled to true when scrolled more than 10px, otherwise false
        if (window.scrollY > 10) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Run once on mount to set initial state
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array - only run on mount and unmount
  
  // Debug output
  console.log("Scroll state:", scrolled);
  
  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-lg shadow-lg py-2' : 'bg-transparent py-4'
      }`} 
      style={{ 
        backgroundColor: scrolled ? 'rgba(13, 13, 18, 0.75)' : 'transparent',
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.span
              className="text-2xl font-bold"
              style={{
                background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
              whileHover={{ scale: 1.05 }}
            >
              CraftFolio
              <span className="relative">
                <motion.span
                  className="absolute -top-2 -right-4 text-xs font-normal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: ColorTheme.primary }}
                >
                  ✦
                </motion.span>
              </span>
            </motion.span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#features"
              className="relative hover:text-opacity-100 transition-colors text-lg"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{
                color: ColorTheme.primary,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              Features
            </motion.a>
            <motion.a
              href="#resume-import"
              className="relative hover:text-opacity-100 transition-colors text-lg"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{
                color: ColorTheme.primary,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              Resume Import
            </motion.a>
            <motion.a
              href="#templates"
              className="relative hover:text-opacity-100 transition-colors text-lg"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{
                color: ColorTheme.primary,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              Templates
            </motion.a>
            <motion.a
              href="#testimonials"
              className="relative hover:text-opacity-100 transition-colors text-lg"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{
                color: ColorTheme.primary,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              Testimonials
            </motion.a>

            {/* Authentication Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <motion.span
                  className="text-lg"
                  style={{ color: ColorTheme.textPrimary }}
                  whileHover={{ scale: 1.05 }}
                >
                  {user.firstName || user.username || 'User'}
                </motion.span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <motion.a
                  href="/sign-in"
                  className="px-6 py-2 rounded-md text-lg transition-all"
                  style={{
                    color: ColorTheme.textPrimary,
                    backgroundColor: 'rgba(28, 28, 30, 0.7)',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(38, 38, 42, 0.9)',
                    scale: 1.03
                  }}
                >
                  Log In
                </motion.a>
                <motion.a
                  href="/sign-up"
                  className="px-6 py-2 rounded-md text-lg transition-all"
                  style={{
                    color: ColorTheme.textPrimary,
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`
                  }}
                >
                  Sign Up Free
                </motion.a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="outline-none"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" style={{ color: ColorTheme.textPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 rounded-lg p-4"
            style={{ 
              backgroundColor: 'rgba(13, 13, 18, 0.85)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <motion.a
              href="#features"
              className="block py-3 hover:text-opacity-100 transition-colors"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{ color: ColorTheme.primary }}
            >
              Features
            </motion.a>
            <motion.a
              href="#resume-import"
              className="block py-3 hover:text-opacity-100 transition-colors"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{ color: ColorTheme.primary }}
            >
              Resume Import
            </motion.a>
            <motion.a
              href="#templates"
              className="block py-3 hover:text-opacity-100 transition-colors"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{ color: ColorTheme.primary }}
            >
              Templates
            </motion.a>
            <motion.a
              href="#testimonials"
              className="block py-3 hover:text-opacity-100 transition-colors"
              style={{ color: ColorTheme.textSecondary }}
              whileHover={{ color: ColorTheme.primary }}
            >
              Testimonials
            </motion.a>
            
            {!user && (
              <div className="mt-4 flex flex-col space-y-3">
                <motion.a
                  href="/sign-in"
                  className="px-4 py-3 text-center rounded-md transition-all"
                  style={{ 
                    backgroundColor: 'rgba(38, 38, 42, 0.7)',
                    color: ColorTheme.textPrimary
                  }}
                  whileHover={{ backgroundColor: 'rgba(48, 48, 52, 0.9)' }}
                >
                  Log In
                </motion.a>
                <motion.a
                  href="/sign-up"
                  className="px-4 py-3 text-center rounded-md transition-all"
                  style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                    color: ColorTheme.textPrimary
                  }}
                  whileHover={{
                    boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`
                  }}
                >
                  Sign Up Free
                </motion.a>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default MainNavbar