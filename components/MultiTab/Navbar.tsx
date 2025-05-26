import React from 'react';
import { Settings } from 'lucide-react';

interface NavbarProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const Navbar: React.FC<NavbarProps> = ({ onTabChange, activeTab }) => {
  const tabs = [
    { id: 'home', label: 'home' },
    { id: 'projects', label: 'projects' },
    { id: 'work', label: 'work' },
    { id: 'learning', label: 'learning' },
    { id: 'technologies', label: 'technologies' },
    { id: 'links', label: 'links' }
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-transparent">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center transform rotate-12">
          <div className="w-4 h-4 bg-white rounded-sm transform -rotate-12"></div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`text-sm font-medium transition-all duration-300 hover:text-white ${
              activeTab === tab.id
                ? 'text-orange-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Icon */}
      <div className="flex items-center">
        <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;