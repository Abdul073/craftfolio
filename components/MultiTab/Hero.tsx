import React, { useState } from "react";
import {
  Mail,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  Download,
} from "lucide-react";
import Navbar from "./Navbar";
import Projects from "./Projects";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const socialLinks = [
    {
      icon: Mail,
      label: "Email",
      href: "mailto:sayantan@example.com",
      color: "text-gray-400 hover:text-blue-400",
    },
    {
      icon: Github,
      label: "Github",
      href: "#",
      color: "text-gray-400 hover:text-white",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "#",
      color: "text-gray-400 hover:text-blue-400",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "#",
      color: "text-gray-400 hover:text-blue-500",
    },
    {
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.18 0 2.31-.21 3.38-.6.39-.14.62-.52.62-.94 0-.41-.23-.79-.62-.94C14.31 19.79 13.18 20 12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83-.31.4-.31.98 0 1.38.4.31.98.31 1.38 0C20.38 16.49 22 14.32 22 12c0-5.52-4.48-10-10-10z" />
        </svg>
      ),
      label: "Dribbble",
      href: "#",
      color: "text-gray-400 hover:text-pink-400",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <Projects />;
      case "work":
        return (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8">
              Work Experience
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Senior Software Engineer
                </h3>
                <p className="text-orange-400 mb-3">
                  Tech Company • 2023 - Present
                </p>
                <p className="text-gray-300">
                  Led development of scalable web applications, mentored junior
                  developers, and improved system performance by 40%.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Full-Stack Developer
                </h3>
                <p className="text-orange-400 mb-3">
                  Startup Inc • 2022 - 2023
                </p>
                <p className="text-gray-300">
                  Built end-to-end applications using React, Node.js, and cloud
                  technologies. Delivered projects to thousands of users.
                </p>
              </div>
            </div>
          </div>
        );
      case "learning":
        return (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8">
              Learning Journey
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                "Machine Learning",
                "Cloud Architecture",
                "DevOps",
                "System Design",
              ].map((skill) => (
                <div
                  key={skill}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-orange-400 transition-colors"
                >
                  <h3 className="text-white font-semibold">{skill}</h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Currently exploring and building projects
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "technologies":
        return (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8">Technologies</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                "React",
                "Node.js",
                "TypeScript",
                "Python",
                "AWS",
                "Docker",
                "PostgreSQL",
                "GraphQL",
                "MongoDB",
              ].map((tech) => (
                <div
                  key={tech}
                  className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700 hover:border-orange-400 transition-colors"
                >
                  <span className="text-white font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "links":
        return (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8">
              Links & Contact
            </h2>
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <p className="text-gray-300 mb-6">
                Feel free to reach out for collaborations or opportunities!
              </p>
              <div className="space-y-4">
                {socialLinks.map((link, index) => {
                  const IconComponent =
                    typeof link.icon === "function" ? link.icon : link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className={`flex items-center space-x-3 text-base transition-all duration-300 p-3 rounded-lg hover:bg-gray-700/50 ${link.color}`}
                    >
                      <IconComponent size={20} />
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case "home":
      default:
        return (
          <div className="space-y-8 max-w-4xl">
            <h2 className="text-4xl font-bold text-white mb-8">About me</h2>

            <div className="text-gray-300 text-base leading-relaxed space-y-6">
              <p>
                Hi, this is{" "}
                <span className="text-white font-semibold">Sayantan Paul</span>{" "}
                - a{" "}
                <span className="text-white font-semibold">
                  software engineer
                </span>{" "}
                with strong expertise in building{" "}
                <span className="text-white font-semibold">
                  end-to-end applications
                </span>{" "}
                and a solid understanding of{" "}
                <span className="text-white font-semibold">
                  full-stack development
                </span>
                . I've built and deployed a lot of applications on cloud. Even
                as a fresh grad, I built a few applications that reached
                thousands of users and received positive feedback, demonstrating
                their robustness.
              </p>

              <p>
                I love experimenting with new technologies and tackling complex
                problems head-on. Though my career is still in its early stages,
                I've actively engaged in diverse projects that showcase my
                skills and dedication. I enjoy continuous learning and applying
                my skills and knowledge to contribute impactful products and
                services that can benefit people and society.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 text-base leading-relaxed">
                <span className="text-white font-semibold">
                  Interested in collaborating?
                </span>{" "}
                If you're up for building something awesome, check out my work
                and let's connect! I'm actively exploring full-time
                opportunities worldwide (hybrid preferred, but remote works
                too). Let's create impactful tech solutions together!
              </p>

              <button className="inline-flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
                <span>Download CV</span>
                <Download size={16} />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar onTabChange={handleTabChange} activeTab={activeTab} />

      <div className="flex px-8 py-12 gap-16">
        {/* Left Sidebar - Profile */}
        <div className="w-80 flex flex-col items-center text-center space-y-6 sticky top-8 h-fit">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                alt="Sayantan Paul"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"></div>
          </div>

          {/* Name and Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Sayantan Paul</h1>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Full-Stack Software Engineer | Product Design | Cross-Platform
              Development
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <MapPin size={16} />
            <span>Kolkata, West Bengal, India</span>
          </div>

          {/* Social Links */}
          <div className="space-y-3 w-full">
            {socialLinks.map((link, index) => {
              const IconComponent =
                typeof link.icon === "function" ? link.icon : link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className={`flex items-center space-x-3 text-sm transition-all duration-300 p-2 rounded-lg hover:bg-gray-800/50 ${link.color}`}
                >
                  <IconComponent size={16} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Hero;
