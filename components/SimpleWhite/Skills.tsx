import React from "react";
import { motion } from "framer-motion";

const Skills: React.FC = () => {

    const skills = [
      { name: "HTML", icon: "https://img.icons8.com/color/48/000000/html-5.png" },
      { name: "CSS", icon: "https://img.icons8.com/color/48/000000/css3.png" },
      { name: "JavaScript", icon: "https://img.icons8.com/color/48/000000/javascript.png" },
      { name: "TypeScript", icon: "https://img.icons8.com/color/48/000000/typescript.png" },
      { name: "React", icon: "https://img.icons8.com/color/48/000000/react.png" },
      { name: "Next.js", icon: "https://img.icons8.com/color/48/000000/nextjs.png" },
    ]

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

  return (
    <section
      id="skills"
      className="min-h-screen flex items-center justify-center bg-[white] text-black relative overflow-hidden py-20"
    >
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-title font-semibold text-primary-800 mb-12 text-center">
            Technical Skills
          </h2>
          <p className="font-sans text-lg text-primary-600 tracking-medium leading-relaxed max-w-2xl mx-auto">
            A comprehensive list of technologies and tools I work with
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={skillVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
            >
              <div
                className="bg-white/50 backdrop-blur-sm border border-gray-300 rounded-full p-3 shadow-sm 
                           hover:shadow-md hover:border-primary-400 transition-all duration-300 
                           hover:bg-white/80"
              >
                <div className="text-center">
                  <h3
                    className="text-base md:text-lg text-primary-800 group-hover:text-primary-900
                             transition-colors duration-300 px-2"
                  >
                    {skill.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;