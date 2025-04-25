import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProfessionalJourney = () => {
  // Define your professional experiences as data
  const experiences = [
    {
      id: 1,
      title: "Software Development Intern",
      company: "SkyShine Technologies",
      remote: true,
      period: "Feb 2025 - Present",
      description: "End-to-end development of a web-based platform using the MERN stack to display subscription pricing for multiple cloud, VPS, and dedicated server plans, including maintenance support tiers.",
      technologies: ["MongoDB", "Express.js", "React", "Node.js"],
      achievements: [
        "Integrated dynamic pricing modules for server plans",
        "Collaborated with UI/UX designer to improve user flow and visual hierarchy",
        "Designed and implemented secure customer login panel"
      ]
    },
    {
      id: 2,
      title: "Freelance Web Developer",
      company: "Self-employed",
      remote: false,
      period: "Jan 2024 - Jan 2025",
      description: "Developed responsive websites and web applications for small businesses and startups, focusing on modern UI/UX principles and performance optimization.",
      technologies: ["React", "Tailwind CSS", "NextJS"],
      achievements: [
        "Built 10+ custom websites with modern frameworks",
        "Implemented SEO best practices resulting in 40% traffic increase",
        "Maintained client relationships and delivered projects on schedule"
      ]
    }
  ];

  // Animation for the heading section
  const headingControls = useAnimation();
  const [headingRef, headingInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (headingInView) {
      headingControls.start('visible');
    }
  }, [headingControls, headingInView]);

  // Subtle animation variants
  const headingVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={headingRef}
          initial="hidden"
          animate={headingControls}
          variants={headingVariants}
          className="mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-center text-green-400">Professional Journey</h1>
          <p className="text-xl text-gray-300 text-center">
            Building real-world experience through innovative projects
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-500/30"></div>

          {/* Map through experiences data */}
          {experiences.map((experience, index) => {
            const [ref, inView] = useInView({
              threshold: 0.2,
              triggerOnce: true
            });
            
            return (
              <motion.div
                key={experience.id}
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`relative ${index !== experiences.length - 1 ? 'mb-16' : ''}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 transform -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 border-4 border-gray-900"></div>
                
                {/* Card content */}
                <div className="ml-16 bg-stone-900/60 rounded-lg p-6 border border-gray-700">
                  <motion.h2 
                    className="text-2xl font-bold mb-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {experience.title}
                  </motion.h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-gray-400">
                    <span>{experience.company}</span>
                    {experience.remote && (
                      <>
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-sm">Remote</span>
                      </>
                    )}
                    <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-sm">{experience.period}</span>
                  </div>

                  <motion.p 
                    className="text-gray-300 mb-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {experience.description}
                  </motion.p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {experience.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-700/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2">
                    {experience.achievements.map((achievement, achievementIndex) => (
                      <li 
                        key={achievementIndex}
                        className="flex items-start"
                      >
                        <span className="text-green-400 mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalJourney;