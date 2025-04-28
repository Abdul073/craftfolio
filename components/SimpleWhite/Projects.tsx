import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const Projects = () => {

  interface ProjectType {
        id: string;
        title: string;
        description: string;
        image: string;
        technologies: string[];
        github: string;
        url: string;
  }
      
  const projects: ProjectType[] = [
        {
          id: 'project-one',
          title: 'Project One',
          description: 'A brief description of your project. This project demonstrates how to build a simple web application using React and TypeScript.',
          image: 'https://res.cloudinary.com/dhanvyweu/image/upload/v1745763117/Screenshot_2025-04-27_194021_mw74xy.png',
          technologies: ['React', 'TypeScript', 'TailwindCSS'],
          github: 'https://github.com/yourusername/project-one',
          url: 'https://project-one-demo.vercel.app'
        },
        {
          id: 'project-two',
          title: 'Project Two',
          description: 'Another project showcasing your skills in building responsive and interactive web applications with modern technologies.',
          image: 'https://res.cloudinary.com/dhanvyweu/image/upload/v1745763117/Screenshot_2025-04-27_194021_mw74xy.png',
          technologies: ['Next.js', 'TypeScript', 'Firebase'],
          github: 'https://github.com/yourusername/project-two',
          url: 'https://project-two-demo.vercel.app'
        },
        {
          id: 'project-three',
          title: 'Project Three',
          description: 'A full-stack application featuring authentication, database integration, and responsive design principles.',
          image: 'https://res.cloudinary.com/dhanvyweu/image/upload/v1745763117/Screenshot_2025-04-27_194021_mw74xy.png',
          technologies: ['React', 'Node.js', 'MongoDB'],
          github: 'https://github.com/yourusername/project-three',
          url: 'https://project-three-demo.vercel.app'
        }
  ];
      

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

  return (
    <section
      id={"projects"}
      className="min-h-screen py-24 bg-gradient-to-b text-gray-900 from-white to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            variants={projectVariants}
            className="text-4xl md:text-5xl font-title font-semibold text-primary-800 mb-12 text-center"
          >
            Featured Projects
          </motion.h2>

          <div className="space-y-20">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={projectVariants}
                className="group relative border-b-2 border-primary-200 pb-12 last:border-none"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Project Image */}
                  <div className="w-full lg:w-[40%] aspect-video relative rounded-xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-500 ease-in-out">
                    <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-primary-900/0 transition-all duration-500" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform  transition-all duration-700"
                    />
                  </div>

                  {/* Project Info */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <h3 className="text-3xl font-bold text-primary-900 hover:text-primary-700 transition-all duration-300 cursor-pointer">
                      {project.title}
                    </h3>

                    <p className="text-lg text-primary-600 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-4 py-2 text-sm font-medium bg-teal-300/50 text-primary-700 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-6 pt-4">
                      {project.github && (
                        <motion.a
                          href={project.github}
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
                      {project.url && (
                        <motion.a
                          href={project.url}
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