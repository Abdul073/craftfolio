"use client"

import { Button } from '@/components/ui/button'
import { GithubIcon, LinkedinIcon, PaperclipIcon, Menu } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
   const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null)
  const { portfolioData } = useSelector((state: RootState) => state.data);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ]

   useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData.find((section: any) => section.type === "hero")?.data;
      if (heroSectionData) {
        setHeroData(heroSectionData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  const spring = {
    type: "spring",
    damping: 50,
    stiffness: 250,
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

   if (isLoading || !heroData) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <motion.div 
      className={`flex items-center justify-between mx-auto backdrop-blur-3xl z-50 bg-black/10 rounded-lg border ${scrolled ? 'w-4/5 border-gray-300/20 text-white' : 'w-full'}`}
      layout
      transition={spring}
      style={{ 
        position: 'sticky',
        top: scrolled ? '1rem' : '0',
        padding: scrolled ? '0.75rem' : '1.25rem',
        height: scrolled ? '4rem' : '5rem',
        boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <LayoutGroup>
        <div className="flex items-center justify-between w-full">
          <motion.div 
            layout
            transition={spring}
            className="overflow-hidden"
            style={{
              width: scrolled ? 0 : 'auto',
              opacity: scrolled ? 0 : 1,
              marginRight: scrolled ? 0 : '1rem'
            }}
          >
            <h1 className="text-2xl font-semibold tracking-wide whitespace-nowrap">{heroData?.name}</h1>
          </motion.div>
          
          <motion.div 
            layout
            transition={spring}
            className="hidden md:flex items-center justify-center gap-8"
          >
            {navItems.map((item) => (
              <motion.a 
                layout
                key={item.name}
                href={item.href}
                className="cursor-pointer text-gray-400 text-lg hover:text-white transition duration-200 ease-in"
                transition={spring}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>
          
          <motion.div 
            layout
            transition={spring}
            className="flex items-center justify-center gap-4 md:gap-8"
          >
            <motion.div 
              layout
              transition={spring}
              className="flex items-center justify-center gap-4"
            >
              <motion.a layout transition={spring} href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="cursor-pointer hover:text-green-300 transition-colors" size={20}/>
              </motion.a>
              <motion.a layout transition={spring} href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="cursor-pointer hover:text-green-300 transition-colors" size={20}/>
              </motion.a>
            </motion.div>
            <motion.div layout transition={spring}>
              <Button className="px-4 md:px-8 py-2 rounded-md bg-green-500 text-black hover:bg-green-400 cursor-pointer flex items-center gap-2 font-medium">
                <PaperclipIcon size={18} /> Resume
              </Button>
            </motion.div>
            
            <motion.div layout transition={spring} className="md:hidden">
              <Menu 
                className="cursor-pointer ml-4" 
                size={24} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </motion.div>
          </motion.div>
        </div>
      </LayoutGroup>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full right-0 left-0 bg-black/90 backdrop-blur-3xl p-4 flex flex-col gap-4 border-t border-white/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-white p-2 transition duration-200 ease-in"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Navbar