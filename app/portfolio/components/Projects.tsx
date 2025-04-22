'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Github, ExternalLink, Code2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  github: string;
  liveLink: string;
  year: string;
}

const Projects: React.FC = () => {
  // State to track if section is in view
  const [isInView, setIsInView] = useState<boolean>(false);
  // Ref for the section
  const sectionRef = useRef<HTMLElement | null>(null);

  const projectData: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with product listings, cart functionality, user authentication, and payment processing integration. This project includes a responsive design that works across all devices and implements modern UX patterns for a seamless shopping experience.",
      image: "/portfolio.png",
      techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
      github: "https://github.com/username/ecommerce-platform",
      liveLink: "https://ecommerce-demo.example.com",
      year: "2023"
    },
    {
      id: 2,
      title: "Task Management System",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features. Users can create projects, assign tasks, set deadlines, and track progress through an intuitive dashboard interface. The system includes notifications and detailed reporting capabilities.",
      image: "/portfolio.png",
      techStack: ["NextJS", "TypeScript", "Firebase", "TailwindCSS"],
      github: "https://github.com/username/task-management",
      liveLink: "https://task-manager-demo.example.com",
      year: "2024"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "An interactive weather dashboard displaying current conditions and forecasts using multiple weather APIs with location detection. Features include hourly and 7-day forecasts, historical weather data comparison, severe weather alerts, and customizable display units. The app utilizes geolocation and remembers user preferences.",
      image: "/portfolio.png",
      techStack: ["Vue.js", "OpenWeather API", "Mapbox", "SCSS"],
      github: "https://github.com/username/weather-dashboard",
      liveLink: "https://weather-demo.example.com",
      year: "2024"
    }
  ];

  // Animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "6rem",
      transition: {
        delay: 0.2,
        duration: 0.4
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const projectVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 w-full overflow-hidden min-h-screen text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3 
            className="text-yellow-400 font-medium mb-3"
            variants={headingVariants}
          >
            Projects
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

        <motion.div 
          className="space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projectData.map((project, index) => (
            <motion.div 
              key={project.id}
              variants={projectVariants}
              className="bg-stone-800/30 border border-gray-400/25 rounded-lg overflow-hidden transition-colors duration-300 hover:bg-zinc-900/80"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                <div className="w-full md:w-2/5 relative">
                  <div className="relative overflow-hidden m-4">
                    <motion.img 
                      src={project.image} 
                      alt={`${project.title} project screenshot`}
                      className="w-full h-52 object-cover rounded-lg"
                      initial="rest"
                      whileHover="hover"
                      variants={imageVariants}
                    />
                    <motion.div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-yellow-400/35 blur-lg z-0"
                      initial={{ opacity: 0.5, scale: 1 }}
                      whileHover={{ opacity: 0.8, scale: 1.3 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>
                  <div className="p-3 bg-zinc-900/90 flex justify-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link 
                        href={project.github}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-yellow-400 text-yellow-400 rounded-md hover:bg-yellow-400 hover:text-black transition-colors duration-300 text-sm"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link 
                        href={project.liveLink}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors duration-300 text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </Link>
                    </motion.div>
                  </div>
                </div>
                
                <div className="w-full md:w-3/5 p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white hover:text-yellow-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm mt-1 md:mt-0">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.year}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    {project.description}
                  </p>
                  
                  <div>
                    <h4 className="flex items-center gap-2 text-yellow-400 font-semibold mb-2">
                      <Code2 className="h-4 w-4" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <motion.span 
                          key={idx}
                          whileHover={{ 
                            y: -2,
                            backgroundColor: "#f59e0b",
                            color: "#000"
                          }}
                          className="px-3 py-1 bg-gray-800 rounded-full text-sm font-medium text-yellow-400 border border-gray-700 transition-all duration-300"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;