import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import Projects from "./Projects";
import Navbar from "./Navbar";
import Technologies from "./Technologies";
import Experience from "./Experience";
import Contact from "./Contact";
import Education from "./Education";
import { useState } from "react";

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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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
        return <Experience />;
      case "learning":
        return <Education />;
      case "technologies":
        return <Technologies />;
      case "links":
        return <Contact />;
      case "home":
      default:
        return (
          <div className="space-y-8">
            <h2 className="text-5xl font-bold text-white mb-8">About me</h2>

            <div className="text-gray-300 text-base leading-relaxed space-y-5">
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

            <div className="space-y-5 pt-3">
              <p className="text-gray-300 text-base leading-relaxed">
                <span className="text-white font-semibold">
                  Interested in collaborating?
                </span>{" "}
                If you're up for building something awesome, check out my work
                and let's connect! I'm actively exploring full-time
                opportunities worldwide (hybrid preferred, but remote works
                too). Let's create impactful tech solutions together!
              </p>

              <button className="inline-flex items-center space-x-3 bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-300 hover:shadow-lg">
                <span>Download CV</span>
                <Download size={18} />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative  max-h-screen overflow-y-none bg-gradient-to-b from-[#2d193c] via-[#18181b] to-black">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/grid5.png')",
          backgroundRepeat: "repeat",
          backgroundPosition: "top",
          opacity: 0.15,
        }}
      />
      {/* Hanging Navbar */}
      <div className="relative z-10 w-full flex justify-center pt-8">
        <div className="max-w-4xl w-full">
          <Navbar onTabChange={handleTabChange} activeTab={activeTab} />
        </div>
      </div>
      {/* Main content area, centered, 80% width */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex gap-12 mt-12">
        {/* Sidebar sticky card */}
        <div className="w-64 sticky top-32 self-start h-fit bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col items-center text-center space-y-6 border border-gray-700/50">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600/50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                alt="Sayantan Paul"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 shadow-lg"></div>
          </div>

          {/* Name and Title */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white">Sayantan Paul</h1>
            <p className="text-gray-300 text-xs leading-relaxed max-w-xs">
              Full-Stack Software Engineer | Product Design | Cross-Platform
              Development
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <MapPin size={16} />
            <span>Kolkata, West Bengal, India</span>
          </div>

          {/* Social Links */}
          <div className="space-y-1 w-full pt-1">
            {socialLinks.map((link, index) => {
              const IconComponent =
                typeof link.icon === "function" ? link.icon : link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className={`flex items-center space-x-1 text-xs transition-all duration-300 p-2 rounded-xl hover:bg-gray-800/50 ${link.color}`}
                >
                  <IconComponent size={16} />
                  <span className="font-medium">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Hero;
