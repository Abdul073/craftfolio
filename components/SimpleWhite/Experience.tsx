import React from "react";
import { motion } from "framer-motion";

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

const Experience: React.FC = () => {
  const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;

  const experiences: Experience[] = [
    {
      company: "Company Name 1",
      role: "Role 1",
      startDate: "Start Date 1",
      endDate: "End Date 1",
      responsibilities: [
        "Responsibility 1",
        "Responsibility 2",
        "Responsibility 3",
      ],
    },
    {
      company: "Company Name 2",
      role: "Role 2",
      startDate: "Start Date 2",
      endDate: "End Date 2",
      responsibilities: [
        "Responsibility 4",
        "Responsibility 5",
        "Responsibility 6",
      ],
    },
    {
      company: "Company Name 3",
      role: "Role 3",
      startDate: "Start Date 3",
      endDate: "End Date 3",
      responsibilities: [
        "Responsibility 7",
        "Responsibility 8",
        "Responsibility 9",
      ],
    },
]

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
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            Professional Experience
          </h2>
          <p className="font-sans text-lg md:text-xl font-normal text-gray-600 tracking-normal leading-relaxed max-w-2xl mx-auto">
            My journey in the industry
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-300 transform md:-translate-x-px" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-12 border border-gray-300
                       shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-400
                       md:w-[calc(50%-2rem)] ${
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
                {exp.responsibilities.map((responsibility, respIndex) => (
                  <motion.li
                    key={respIndex}
                    variants={itemVariants}
                    className="flex items-start group"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 mt-2.5 mr-3 flex-shrink-0" />
                    <p className="font-sans text-base text-gray-700 leading-relaxed font-normal">
                      {responsibility}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;