'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { GripHorizontalIcon, MousePointer2, CheckCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { createPortfolio } from '../actions/portfolio';
import toast from 'react-hot-toast';
import { setPortfolioData } from '@/slices/dataSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const PortfolioThemePage = () => {
  const {user,isLoaded } = useUser();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const router = useRouter();
  const [themes] = useState([
    {
      id: 1,
      name: 'NeoSpark',
      description: 'A minimalist theme with a responsive layout, dark/light mode support and smooth transitions',
      image: '/portfolio.png',
    },
    {
      id: 2,
      name: 'Palette',
      description: 'A modern theme featuring a responsive design, profile photo option, sleek aesthetics and skill badges',
      image: '/portfolio.png',
    },
    {
      id: 3,
      name: 'Pinnacle',
      description: 'An interactive theme with a modern interface, skills and category sections and dark/light mode support',
      image: '/portfolio.png',
    },
    {
      id: 4,
      name: 'Classic',
      description: 'A professional theme with traditional layout, perfect for corporate portfolios',
      image: '/portfolio.png',
    },
    {
      id: 5,
      name: 'Creative',
      description: 'An artistic theme with unique animations and layout options for creative professionals',
      image: '/portfolio.png',
    },
    {
      id: 6,
      name: 'Developer',
      description: 'A tech-focused theme with code snippet displays and GitHub integration',
      image: '/portfolio.png',
    },
  ]);


  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [user,isLoaded]);

  const handleSelectTheme = (id : any) => {
    setSelectedTheme(id);
  };
  
  const handleCreateTemplate = async () => {
    if (selectedTheme && user) {
      setIsCreating(true);
      try {
        const themeName = themes.find((theme) => theme.id === selectedTheme)?.name;
        if(!themeName){
          toast.error("Invalid template");
          return;
        }
        const result = await createPortfolio(user.id, themeName);
        if (result.success) {
          toast.success('Portfolio created successfully');
          router.push(`/portfolio/${result?.data?.id}`);
        } else {
          toast.error('Failed to create portfolio');
          console.error("Failed to create portfolio:", result.error);
        }
      } catch (error) {
        console.error("Error creating portfolio:", error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="container mx-auto max-w-[80%] px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Home
            </Link>
          </div>
          <button className="p-2 rounded-full bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </header>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Select Your Portfolio Theme</h1>
          <p className="text-xl text-gray-400">Choose a theme that reflects your unique style and professional identity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {themes.map((theme) => (
            <div 
              key={theme.id} 
              className={`bg-stone-700/30 border rounded-lg overflow-hidden ${
                selectedTheme === theme.id ? 'border border-white' : ''
              }`}
            >
              <div className="h-64 bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={theme.image}
                    alt={`${theme.name} theme preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{theme.name}</h3>
                <p className="text-gray-400 mb-6">{theme.description}</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={()=>router.push('/portfolio')} className="flex items-center gap-2">
                    <GripHorizontalIcon />
                    Live Demo
                  </Button>
                  <Button 
                    onClick={() => handleSelectTheme(theme.id)} 
                    className="flex items-center gap-2"
                  >
                    <MousePointer2 />
                    Select
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedTheme && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-10">
          <Button 
            onClick={handleCreateTemplate}
            disabled={isCreating}
            className="bg-white text-black font-medium !py-6 !px-8 rounded-full shadow-lg text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-xl flex items-center gap-3 border border-gray-200"
          >
            {isCreating ? (
              <>Creating Template...</>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Create Template
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PortfolioThemePage;