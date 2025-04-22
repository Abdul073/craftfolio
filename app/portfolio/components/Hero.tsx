'use client';

import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquareIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'

const Hero = () => {
  // For the badge text rotation
  const badgeTexts = ["Available for freelance", "Seeking opportunities"];
  const [badgeScope, animateBadge] = useAnimate();
  const [badgeIndex, setBadgeIndex] = React.useState(0);
  
  // For the title text rotation
  const titleTexts = ["Developer", "Engineer"];
  const [titleScope, animateTitle] = useAnimate();
  const [titleIndex, setTitleIndex] = React.useState(0);
  
  useEffect(() => {
    // Badge text animation
    const intervalId = setInterval(() => {
      animateBadge(badgeScope.current, { opacity: 0, y: 20 }, { duration: 0.3 });
      
      setTimeout(() => {
        setBadgeIndex((prev) => (prev + 1) % badgeTexts.length);
        animateBadge(badgeScope.current, { opacity: 1, y: 0 }, { duration: 0.3 });
      }, 300);
    }, 3000);
    
    // Title text animation
    const titleIntervalId = setInterval(() => {
      animateTitle(titleScope.current, { opacity: 0, y: 20 }, { duration: 0.3 });
      
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % titleTexts.length);
        animateTitle(titleScope.current, { opacity: 1, y: 0 }, { duration: 0.3 });
      }, 300);
    }, 4000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(titleIntervalId);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center mt-12 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-green-900  text-white text-sm px-4 py-2 rounded-full inline-flex items-center mb-6"
      >
        <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
        <span ref={badgeScope} className="text-sm">{badgeTexts[badgeIndex]}</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-[66px] tracking-[-0.02em] font-bold text-center leading-snug md:leading-20"
      >
        Hi, I'm Aditya <br />
        <span className="text-[yellow]">Aspiring Software<span ref={titleScope}> {titleTexts[titleIndex]}</span>.</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-center mt-6 text-xl font-medium max-w-2xl"
      >
        Craving to build innovative solutions that make an impact.
        <br />
        Enthusiastic problem solver, always curious about new technologies.
        <br />
        Committed to continuous learning and growth.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="flex items-center justify-center gap-6 mt-8"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="flex bg-[yellow] hover:bg-yellow-400 text-black items-center gap-2 !px-7 py-5 cursor-pointer text-sm transition-colors">
            View Projects <ArrowRight size={18} />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="flex items-center gap-2 !px-7 py-5 cursor-pointer text-sm border-white hover:bg-gray-800 transition-colors"
          >
            Contact Me <MessageSquareIcon size={18} />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-16 text-center opacity-70"
      >
        <p>Scroll to explore</p>
        <motion.div 
          initial={{ height: 32 }}
          animate={{ height: 32 }}
          // transition={{ 
          //   duration: 0.8, 
          //   delay: 1.2,
          //   repeat: Infinity,
          //   repeatType: "reverse",
          //   ease: "easeInOut"
          // }}
          className="w-0.5 bg-white/50 mx-auto mt-2"
        ></motion.div>
      </motion.div>
    </div>
  )
}

export default Hero