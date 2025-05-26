import React, { useState } from "react";
import {
  Mail,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  Download,
} from "lucide-react";

const Navbar = ({
  onTabChange,
  activeTab,
}: {
  onTabChange: (tab: string) => void;
  activeTab: string;
}) => {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "work", label: "Work" },
    { id: "learning", label: "Learning" },
    { id: "technologies", label: "Technologies" },
  ];

  return (
    <nav
      className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl px-8 py-4 max-w-3xl mx-auto  w-full"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 bg-white rounded-md"></div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`text-base font-medium transition-all duration-300 relative ${
              activeTab === tab.id
                ? "text-orange-400"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center">
        <button className="p-2 text-gray-300 hover:text-white transition-colors duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
