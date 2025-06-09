import React from "react";
import { Moon, Sun } from "lucide-react";
import { useLumenFlowTheme } from "./ThemeContext";
import { getThemeClasses } from "./ThemeContext";

const Navbar = ({
  onTabChange,
  activeTab,
  currentTheme,
}: {
  onTabChange: (tab: string) => void;
  activeTab: string;
  currentTheme: any;
}) => {
  const { theme, toggleTheme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "work", label: "Work" },
    { id: "learning", label: "Learning" },
    { id: "technologies", label: "Technologies" },
  ];

  return (
    <nav
      className={`flex items-center justify-between border backdrop-blur-md rounded-2xl shadow-xl px-8 py-4  mx-auto w-full transition-colors duration-300 ${themeClasses.bgSecondary}`}
      style={{ background: themeClasses.gradientHover }}
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
            className={`text-base cursor-pointer font-medium transition-all duration-300 relative ${
              activeTab === tab.id
                ? themeClasses.accent
                : themeClasses.textSecondary
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className={`absolute -bottom-1 left-0 right-0 h-0.5 ${themeClasses.gradientPrimary} rounded-full`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-full transition-colors duration-300 ${
          theme === "dark"
            ? "text-gray-300 hover:text-white hover:bg-gray-800"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
};

export default Navbar;
