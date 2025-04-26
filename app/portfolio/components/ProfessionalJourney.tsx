import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentEdit } from '@/slices/editModeSlice';
import { supabase } from '@/lib/supabase-client';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EditButton from './EditButton';

const ProfessionalJourney = () => {

  interface Technology {
    name: string;
    logo: string;
  }

  interface Experience {
    role?: string;
    companyName?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    techStack?: Technology[];
  }

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  
  const portfolioId = params.portfolioId as string;

  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

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
          console.log('project experience detected!', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status experience: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    }
  }, [portfolioId]);

  const handleSectionEdit = () => {
    dispatch(setCurrentEdit("experience"));
  };

  console.log(experienceData)

  if (isLoading) {
    return (
      <section className="py-24 w-full overflow-hidden min-h-screen text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center h-64">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <div className="text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div 
          className={`mb-16 transition-all relative duration-700 ${isHeadingVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
        >
          <h1 className="text-5xl font-bold mb-4 text-center text-green-400">Professional Journey</h1>
          <p className="text-xl text-gray-300 text-center">
            Building real-world experience through innovative projects
          </p>
        <EditButton  sectionName="experience"/>

        </div>


        {experienceData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No professional experience added yet.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-500/30"></div>

            {experienceData.map((experience, index) => (
              <div
                key={index}
                className={`relative  transition-all duration-700 ${visibleItems[index] ? 'opacity-100' : 'opacity-0'} ${index !== experienceData.length - 1 ? 'mb-16' : ''}`}
              >
                <div className="absolute left-6 transform -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 border-4 border-gray-900"></div>
                
                <div className="ml-16 hover:border-green-400 transition-all duration-300 ease-in bg-stone-900/60 rounded-lg p-6 border border-gray-700">
                  <h2 
                    className={`text-2xl font-bold mb-2 transition-all duration-700 delay-100 ${visibleItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  >
                    {experience.role}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-gray-400">
                    <span>{experience.companyName}</span>
                    <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-sm">{experience.location}</span>
                    <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-sm">{experience.startDate} - {experience.endDate}</span>
                  </div>

                  <p 
                    className={`text-gray-300 mb-4 transition-all duration-700 delay-200 ${visibleItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  >
                    {experience.description}
                  </p>

                  {experience.techStack && experience.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {experience.techStack.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-700/30"
                        >
                          <img  src={tech.logo} alt={tech.name} className="h-4 w-4 inline-block mr-1"/>  {tech.name}
                          </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalJourney;