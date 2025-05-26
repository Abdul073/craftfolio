import React from "react";
import { ExternalLink, Github, Calendar } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment integration, admin dashboard, and real-time inventory management.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API", "JWT"],
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
      date: "2024",
      status: "Completed",
    },
    {
      id: 2,
      title: "Task Management Dashboard",
      description:
        "Collaborative task management application with real-time updates, drag-and-drop functionality, team collaboration features, and advanced analytics.",
      technologies: [
        "React",
        "TypeScript",
        "Socket.io",
        "Express",
        "PostgreSQL",
      ],
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
      date: "2024",
      status: "Completed",
    },
    {
      id: 3,
      title: "Weather Analytics App",
      description:
        "Beautiful weather application with location-based forecasts, interactive maps, detailed weather analytics, and historical data visualization.",
      technologies: [
        "React",
        "Weather API",
        "Chart.js",
        "Tailwind CSS",
        "Leaflet",
      ],
      image:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=250&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
      date: "2023",
      status: "Completed",
    },
    {
      id: 4,
      title: "Social Media Analytics",
      description:
        "Comprehensive analytics dashboard for social media metrics with data visualization, trend analysis, automated reporting, and AI-powered insights.",
      technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "Redis"],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
      date: "2023",
      status: "In Progress",
    },
    {
      id: 5,
      title: "AI Chat Application",
      description:
        "Real-time chat application with AI integration, smart replies, sentiment analysis, and multi-language support for enhanced user communication.",
      technologies: [
        "Next.js",
        "OpenAI API",
        "WebSocket",
        "Prisma",
        "Supabase",
      ],
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
      date: "2024",
      status: "In Progress",
    },
    {
      id: 6,
      title: "Cryptocurrency Tracker",
      description:
        "Real-time cryptocurrency tracking application with portfolio management, price alerts, market analysis, and trading recommendations.",
      technologies: [
        "React Native",
        "CoinGecko API",
        "Firebase",
        "Redux Toolkit",
      ],
      image:
        "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=250&fit=crop",
      liveUrl: "#",
      githubUrl: "#",
      date: "2023",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white">Projects</h2>
        <div className="text-gray-400 text-sm">{projects.length} projects</div>
      </div>

      <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
        Here are some of the projects I've worked on, showcasing my skills in
        full-stack development, UI/UX design, and problem-solving. Each project
        demonstrates different technologies and approaches to building scalable,
        user-friendly applications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-400/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
          >
            {/* Project Image */}
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === "Completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Quick Action Buttons */}
              <div className="absolute top-4 left-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={project.liveUrl}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                  title="View Live"
                >
                  <ExternalLink size={16} className="text-white" />
                </a>
                <a
                  href={project.githubUrl}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                  title="View Code"
                >
                  <Github size={16} className="text-white" />
                </a>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Calendar size={14} />
                  <span>{project.date}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs font-medium border border-gray-600 hover:border-orange-400/50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center space-x-4 pt-2">
                <a
                  href={project.liveUrl}
                  className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  <span>Live Demo</span>
                </a>
                <a
                  href={project.githubUrl}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  <Github size={16} />
                  <span>Source Code</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Interested in working together?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, creative projects,
            or potential collaborations. Let's build something amazing together!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
              Get In Touch
            </button>
            <button className="border border-gray-600 hover:border-orange-400 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
              View Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
