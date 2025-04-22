"use client"
import React, { useState, useEffect, useRef } from 'react'
import { LucideServer, FileCode, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TechnicalProwess = () => {
  // State to track which cards should be visible
  const [activeCardIndex, setActiveCardIndex] = useState(-1)
  // State to track if section has been viewed
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  // State to track if section is in view
  const [isInView, setIsInView] = useState(false)
  // Ref for the section
  const sectionRef = useRef(null)
  
  const skillCards = [
    {
      title: "Backend Systems",
      description: "Scalable server solutions",
      icon: LucideServer,
      iconColor: "text-green-400",
      glowColor: "bg-green-400/35"
    },
    {
      title: "API Development",
      description: "Crafting robust RESTful APIs and seamless third-party service integrations",
      icon: FileCode,
      iconColor: "text-purple-500",
      glowColor: "bg-purple-500/35"
    },
    {
      title: "Frontend Development",
      description: "Building dynamic and interactive user interfaces",
      icon: Code,
      iconColor: "text-yellow-500",
      glowColor: "bg-yellow-500/35"
    }
  ]

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0.8 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1
      }
    },
  }

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  }

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "6rem",
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    }
  }

  // Function to start the card animation sequence
  const startCardAnimations = () => {
    // Reset first
    setActiveCardIndex(-1);
    
    // Schedule each card to appear one by one
    skillCards.forEach((_, index) => {
      setTimeout(() => {
        setActiveCardIndex(index);
      }, 200 + (index * 250)); // 200ms delay before first card, then 250ms between each card
    });
  }

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When section enters viewport
        if (entry.isIntersecting) {
          setIsInView(true);
          // Only start animations when section is first viewed
          if (!hasBeenViewed) {
            setHasBeenViewed(true);
            startCardAnimations();
          }
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.2 } // 20% of the section needs to be visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, [hasBeenViewed]);

  return (
    <section ref={sectionRef} className="py-24 w-full overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView || hasBeenViewed ? "visible" : "hidden"}
        >
          <motion.h3 
            className="text-yellow-400 font-medium mb-3"
            variants={headingVariants}
          >
            Technical Prowess
          </motion.h3>
          
          <motion.h2 
            className="text-4xl md:text-4xl font-bold text-white"
            variants={headingVariants}
          >
            Engineering With Precision
          </motion.h2>
          
          <motion.div 
            className="h-1 bg-yellow-400 mx-auto mt-6"
            variants={lineVariants}
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[70%] mx-auto">
          {skillCards.map((card, index) => (
            <div key={index} className="min-h-[240px]">
              <AnimatePresence>
                {(activeCardIndex >= index || hasBeenViewed) && (
                  <motion.div 
                    className="bg-stone-800/25 hover:bg-zinc-900/85 cursor-pointer group bg-opacity-40 border border-gray-400/25 rounded-lg p-8 transition-all duration-300 h-full"
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex justify-center mb-6 relative">
                      <motion.div 
                        className={`w-16 h-16 transition-transform duration-100 ease-in bg-transparent rounded-lg flex items-center justify-center ${card.iconColor} group-hover:text-yellow-400 transition-colors relative z-10`}
                        variants={iconVariants}
                      >
                        <card.icon size={34} />
                      </motion.div>
                      <motion.div 
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full ${card.glowColor} blur-lg z-0`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.7, scale: 1 }}
                        whileHover={{ opacity: 1, scale: 1.5 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </div>
                    <motion.h3 
                      className="text-lg font-bold text-white group-hover:text-yellow-400 text-center mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-300 text-sm text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {card.description}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechnicalProwess