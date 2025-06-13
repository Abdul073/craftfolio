"use client";

import React, { useEffect, useRef, useState } from "react";
import { Github, ExternalLink, Code2, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import EditButton from '@/components/EditButton';
import SectionHeader from "./SectionHeader";

interface Technology {
  name: string;
  logo: string;
}

interface Project {
  projectTitle?: string;
  projectName?: string;
  projectDescription?: string;
  projectImage?: string;
  techStack?: Technology[];
  githubLink?: string;
  liveLink?: string;
  year?: string;
}

const Projects: React.FC = ({ currentPortTheme, customCSS }: any) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();

  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;
  const buttonBgColor = theme.colors.primary;
  const buttonHoverBgColor = theme.colors.primaryHover;
  const buttonTextColor = theme.colors.text.primary;
  const buttonHoverTextColor = theme.colors.text.secondary;
  const mutedColor = theme.colors.states.muted;
  const scrollLineColor = theme.colors.background.secondary;

  const projectsSection = portfolioData?.find((item: any) => item.type === "projects");
  const sectionTitle = projectsSection?.sectionTitle || "My Projects";
  const sectionDescription = projectsSection?.sectionDescription || "A showcase of my full-stack projects, built using modern web technologies and frameworks.";

  useEffect(() => {
    if (portfolioData) {
      const portfolioSectionData = portfolioData.find(
        (section: any) => section.type === "projects"
      )?.data;
      if (portfolioSectionData) {
        setProjectsData(portfolioSectionData || []);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-project-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          console.log("project update detected!", payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status project: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  useEffect(() => {
    if (!isLoading) {
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
          observer.unobserve(sectionRef.current);
        }
      };
    }
  }, [isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const projectVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  
  if (isLoading) {
    return (
      <section className="py-24 w-full overflow-hidden min-h-screen text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center h-64">
            Loading...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 w-full custom-bg overflow-hidden min-h-screen text-white"
    >
      <style>{customCSS}</style>
      <div className="container relative mx-auto max-w-6xl px-4">
        <SectionHeader sectionName="projects" sectionTitle={sectionTitle} sectionDescription={sectionDescription} titleColor={titleColor} />

        {/* Add conditional rendering for projects list */}
        {Array.isArray(projectsData) && projectsData.length > 0 ? (
          <motion.div
            className="space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {projectsData.map((project, index) => (
              <motion.div
                key={index}
                variants={projectVariants}
                onMouseOver={(e) => {
                  e.currentTarget.style.border = `1px solid ${titleColor}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.border = `1px solid rgb(156 163 175 / 0.25)`;
                }}
                className="bg-stone-800/30 section-card border rounded-lg overflow-hidden transition-colors duration-300 hover:bg-zinc-900/80"
              >
                <div className={`flex flex-col md:flex-row items-center`}>
                  <div className="w-full md:w-2/5 relative">
                    <div className="relative overflow-hidden m-4">
                      <motion.img
                        src={project?.projectImage}
                        alt={`${project?.projectTitle} project screenshot`}
                        className="w-full section-image h-52 object-cover rounded-lg"
                        initial="rest"
                        whileHover="hover"
                        variants={imageVariants}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-lg z-0"
                        style={{ backgroundColor: `${titleColor}35` }}
                        initial={{ opacity: 0.5, scale: 1 }}
                        whileHover={{ opacity: 0.8, scale: 1.3 }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </div>
                    <div className="p-3  flex justify-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Link
                          href={project?.githubLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 btn-primary px-3 py-1.5 bg-transparent border rounded-md hover:text-white transition-colors duration-300 text-sm"
                          style={{ borderColor: `${titleColor}30`, color: titleColor }}
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Link
                          href={project?.liveLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center btn-primary gap-2 px-3 py-1.5 bg-stone-700/30 text-white border rounded-md transition-colors duration-300 text-sm font-medium"
                          style={{ borderColor: `${titleColor}30` }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  <div className="w-full md:w-3/5 p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between mb-3">
                      <h3 className="text-xl section-sub-title md:text-2xl font-bold text-white transition-colors duration-300"
                          style={{ color: titleColor }}
                      >
                        {project?.projectName}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1 md:mt-0">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project?.year}
                      </div>
                    </div>

                    <p className="section-sub-description text-gray-300 mb-4">
                      {project?.projectDescription}
                    </p>

                    <div>
                      <h4 className="flex items-center gap-2 font-semibold mb-2">
                        <Code2 className="h-4 w-4" />
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project?.techStack?.map(
                          (tech: Technology, idx: number) => (
                            <motion.span
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1  rounded-full text-sm font-medium text-white cursor-pointer border border-gray-700 transition-all duration-300"
                              style={{ borderColor: `${titleColor}30` }}
                            >
                              <img
                                src={
                                  tech.logo ||
                                  "https://placehold.co/100x100?text=${searchValue}&font=montserrat&fontsize=18"
                                }
                                alt={tech.name}
                                className="h-4 w-4 inline-block mr-1"
                              />{" "}
                              {tech.name}
                            </motion.span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            No projects found. Add some projects to see them here.
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
