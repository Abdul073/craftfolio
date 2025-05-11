import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from './EditButton';

interface ProjectType {
  id: string;
  projectTitle: string;
  projectDescription: string;
  projectImage: string;
  techStack: [{
    name: string;
    logo: string;
  }];
  githubLink: string;
  liveLink: string;
}

const Projects: NextPage = () => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  
  const [isLoading, setIsLoading] = useState(true);
  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
  
  useEffect(() => {
    if (portfolioData) {
      const projectsSectionData = portfolioData?.find((section: any) => section.type === "projects")?.data;

      if (projectsSectionData) {
        setProjectsData(projectsSectionData);
      } else {
        setProjectsData([]);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);
  
  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-${portfolioId}-projects-simplewhite`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          console.log('Projects update detected!', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status for projects: ${status}`);
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
        staggerChildren: 0.3,
      },
    },
  };

  const projectVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }



  return (
    <section
      id="projects"
      className="min-h-screen py-24 bg-gradient-to-b text-gray-900 from-white to-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="relative">
            <EditButton styles="right-0 -top-6" sectionName="projects" />
            <motion.h2
              variants={projectVariants}
              className="text-4xl md:text-5xl font-title font-semibold text-primary-800 mb-12 text-center"
            >
              Featured Projects
            </motion.h2>
          </div>

          <div className="space-y-20">
            {projectsData.map((project, index) => (
              <motion.div
                key={project.id || index}
                // variants={projectVariants}
                className="group relative border-b-2 border-primary-200 pb-12 last:border-none"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Project Image */}
                  <div className="w-full lg:w-[40%] aspect-video relative rounded-xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-500 ease-in-out">
                    <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-primary-900/0 transition-all duration-500" />
                    <img
                      src={project.projectImage}
                      alt={project.projectTitle}
                      className="w-full h-full object-cover transform transition-all duration-700"
                    />
                  </div>

                  {/* Project Info */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <h3 className="text-3xl font-bold text-primary-900 hover:text-primary-700 transition-all duration-300 cursor-pointer">
                      {project.projectTitle}
                    </h3>

                    <p className="text-lg text-primary-600 leading-relaxed">
                      {project.projectDescription}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {project.techStack.slice(0,5).map((tech, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-4 py-2 text-sm font-medium bg-teal-300/50 text-primary-700 rounded-lg"
                        >
                          <img  src={tech.logo || "https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18"} alt={tech.name} className="h-4 w-4 inline-block mr-1"/>  {tech.name}
                          </span>
                      ))}
                    </div>

                    <div className="flex gap-6 pt-4">
                      {project.githubLink && (
                        <motion.a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View project code"
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaGithub size={22} />
                          <span className="font-medium">View Code</span>
                        </motion.a>
                      )}
                      {project.liveLink && (
                        <motion.a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View live demo"
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaExternalLinkAlt size={20} />
                          <span className="font-medium">Live Demo</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;