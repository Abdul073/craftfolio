import { motion } from "framer-motion";
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from '@/components/EditButton';

interface TechnologyType {
  name: string;
  logo: string;
}

const Skills: NextPage = ({ customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  
  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<TechnologyType[]>([]);
  
  useEffect(() => {
    if (portfolioData) {
      const technologiesSectionData = portfolioData?.find((section: any) => section.type === "technologies")?.data;
      const technologiesSection = portfolioData?.find((section: any) => section.type === "technologies");

      if (technologiesSectionData) {
        setTechnologiesData(technologiesSectionData);
      } else {
        setTechnologiesData([]);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);
  
  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-${portfolioId}-technologies`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          // console.log('Technologies update detected!', payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status for technologies: ${status}`);
      });
      
    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const skillVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother animation
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <style>{customCSS}</style>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
        <EditButton styles="right-96 -top-18" sectionName="technologies" />
          <h2 className="text-3xl md:text-4xl section-title font-bold text-gray-800 dark:text-white mb-4">
            {portfolioData?.find((section: any) => section.type === "technologies")?.sectionTitle || "Technical Skills"}
          </h2>
          <p className="text-lg section-description text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {portfolioData?.find((section: any) => section.type === "technologies")?.sectionDescription || "A comprehensive list of technologies and tools I work with"}
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {technologiesData.map((technology, index) => (
            <motion.div 
              key={index}
              className="flex flex-col cursor-pointer items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={skillVariants}
            >
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img 
                  src={technology.logo} 
                  alt={technology.name} 
                  className="max-w-full max-h-full"
                />
              </div>
              <h3 className="text-gray-800 dark:text-gray-200 font-medium text-center">
                {technology.name}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;