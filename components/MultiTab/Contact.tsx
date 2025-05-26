import React from "react";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

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

const Contact = () => (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-white mb-8">Links & Contact</h2>
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
      <p className="text-gray-300 mb-8 text-lg leading-relaxed">
        Feel free to reach out for collaborations, opportunities, or just to connect!
      </p>
      <div className="space-y-4">
        {socialLinks.map((link, index) => {
          const IconComponent = typeof link.icon === "function" ? link.icon : link.icon;
          return (
            <a
              key={index}
              href={link.href}
              className={`flex items-center space-x-4 text-base transition-all duration-300 p-4 rounded-xl hover:bg-gray-700/30 ${link.color}`}
            >
              <IconComponent size={22} />
              <span className="font-medium">{link.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  </div>
);

export default Contact;