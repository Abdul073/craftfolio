import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import HeroSidebar from '@/components/sidebar-forms/HeroSidebar';
import ProjectSidebar from '@/components/sidebar-forms/ProjectSidebar';

const Sidebar = () => {
  const { currentlyEditing } = useSelector((state: RootState) => state.editMode);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentlyEditing) {
      setIsExpanded(true);
    }
  }, [currentlyEditing]);

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  if (!currentlyEditing) return null; 

  return (
    <div className={`fixed left-0 top-0 h-screen z-[99999] transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-0'} bg-[#1b0808] border-r border-gray-800 overflow-hidden`}>
      <div className="absolute -right-3 top-6 z-10">
        <Button 
          onClick={toggleSidebar} 
          size="sm" 
          className="rounded-full w-6 h-6 p-0 bg-gray-700 hover:bg-gray-600"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col h-full">
        {currentlyEditing === "hero" && <HeroSidebar />}
        {currentlyEditing === "projects" && <ProjectSidebar />}

      </div>
    </div>
  );
};

export default Sidebar;
