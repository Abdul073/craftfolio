import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentEdit } from '@/slices/editModeSlice';
import { supabase } from '@/lib/supabase-client';
import { useParams } from 'next/navigation';
import EditButton from './EditButton';

interface Technology {
  name: string;
  logo: string;
}

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack?: Technology[];
}

const Experience: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  
  const portfolioId = params.portfolioId as string;

  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.matchMedia("(max-width: 640px)").matches);
    };

    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeadingVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (portfolioData) {
      const experienceSectionData = portfolioData.find((section: any) => section.type === "experience")?.data;
      if (experienceSectionData) {
        setExperienceData(experienceSectionData || []);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    if (experienceData.length > 0) {
      setVisibleItems(Array(experienceData.length).fill(false));
      
      experienceData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 500 + (index * 200)); // Staggered timing
      });
    }
  }, [experienceData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-experience-${portfolioId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          console.log('portfolio experience updated!', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status experience: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    }
  }, [portfolioId]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...(isSmallScreen ? { y: -20 } : { x: -20 }),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (isLoading) {
    return (
      <section
        id="experience"
        className="min-h-screen flex items-center justify-center text-black relative overflow-hidden py-20"
      >
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">Loading...</div>
        </div>
      </section>
    );
  }



  return (
    <section
      id="experience"
      className="min-h-screen flex items-center justify-center bg-white text-black relative overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className={`font-display text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4 transition-all duration-700 ${isHeadingVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            Professional Experience
          </h2>
          <p className={`font-sans text-lg md:text-xl font-normal text-gray-600 tracking-normal leading-relaxed max-w-2xl mx-auto transition-all duration-700 ${isHeadingVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            My journey in the industry
          </p>
          <div className="mt-6">
          <EditButton styles="right-48 -top-6" sectionName="experience" />
          </div>
        </motion.div>

        {experienceData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No professional experience added yet.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-300 transform md:-translate-x-px" />

            {experienceData.map((exp, index) => (
              <motion.div
                key={index}
                // variants={itemVariants}
                className={`relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-12 border border-gray-300
                        shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-400
                        md:w-[calc(50%-2rem)] ${
                          visibleItems[index] ? 'opacity-100' : 'opacity-0'
                        } ${
                          index % 2 === 0
                            ? "md:mr-[calc(50%+2rem)]"
                            : "md:ml-[calc(50%+2rem)]"
                        }`}
              >
                <div
                  className={`absolute top-1/2 w-6 h-6 rounded-full bg-gray-500
                            border-4 border-white hidden md:block transform -translate-y-1/2
                            ${
                              index % 2 === 0
                                ? "right-0 translate-x-[calc(100%+1rem+5px)]"
                                : "left-0 -translate-x-[calc(100%+1rem+6px)]"
                            }`}
                />

                <motion.div className="mb-6">
                  <h3 className="font-title text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    {exp.role}
                  </h3>
                  <p className="font-title text-lg font-medium text-gray-600 mb-3">
                    {exp.company}
                  </p>
                  <p className="font-sans text-sm uppercase tracking-wider font-medium text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </p>
                </motion.div>

                <ul className="space-y-4">
                    <motion.li
                      // variants={itemVariants}
                      className="flex items-start group"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5 mr-3 flex-shrink-0" />
                      <p className="font-sans text-base text-gray-700 leading-relaxed font-normal">
                        {exp.description}
                      </p>
                    </motion.li>
                </ul>

                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {exp.techStack.slice(0,5).map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm border border-gray-200"
                      >
                        {tech.logo && <img src={tech.logo || "https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18"} alt={tech.name} className="h-4 w-4 inline-block mr-1"/>} {tech.name}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experience;