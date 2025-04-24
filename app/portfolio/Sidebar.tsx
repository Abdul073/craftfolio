import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { redirect, useParams } from 'next/navigation';
import { updateHero } from '../actions/portfolio';
import HeroSidebar from '@/components/sidebar-forms/HeroSidebar';

const Sidebar = () => {

  const {currentlyEditing} = useSelector((state: RootState) => state.editMode);

  const [isExpanded, setIsExpanded] = useState(currentlyEditing === "hero" ? true : false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <div className={`fixed left-0 top-0 h-screen z-[99999] transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'hidden'} bg-[#1b0808] border-r border-gray-800 flex flex-col`}>
      <div className="absolute -right-3 top-6">
        <Button 
          onClick={toggleSidebar} 
          size="sm" 
          className="rounded-full w-6 h-6 p-0 bg-gray-700 hover:bg-gray-600"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>


      {isExpanded && (
        currentlyEditing === "hero" ? <HeroSidebar /> : null
      )}
    </div>
  );
};

export default Sidebar;