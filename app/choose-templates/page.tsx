'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { GripHorizontalIcon, MousePointer2, CheckCircle, FileText, PlusCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { createPortfolio } from '../actions/portfolio';
import toast from 'react-hot-toast';
import { setPortfolioData } from '@/slices/dataSlice';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PortfolioThemePage = () => {
  const { user, isLoaded } = useUser();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMethod, setCreationMethod] = useState(null);
  
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
  }, [user, isLoaded, router]);

  const handleSelectTheme = (id) => {
    setSelectedTheme(id);
    setIsModalOpen(true);
  };
  
  const handleCreatePortfolio = async () => {
    if (selectedTheme && user && creationMethod) {
      setIsCreating(true);
      try {
        const themeName = themes.find((theme) => theme.id === selectedTheme)?.name;
        if(!themeName){
          toast.error("Invalid template");
          return;
        }
        
        // You could pass the creation method to your API
        const result = await createPortfolio(user.id, themeName, creationMethod);
        
        if (result.success) {
          toast.success('Portfolio created successfully');
          // If importing from resume, you might want to handle differently
          if (creationMethod === 'import') {
            // Perhaps redirect to an import page or handle the import logic
            router.push(`/portfolio/${result?.data?.id}/import-resume`);
          } else {
            router.push(`/portfolio/${result?.data?.id}`);
          }
        } else {
          toast.error('Failed to create portfolio');
          console.error("Failed to create portfolio:", result.error);
        }
      } catch (error) {
        console.error("Error creating portfolio:", error);
        toast.error('An error occurred');
      } finally {
        setIsCreating(false);
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 relative">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-stone-800/20 to-transparent -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto max-w-[80%] px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-teal-400 to-stone-300 bg-clip-text text-transparent">
              CraftFolio
            </Link>
          </div>
          <button className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </header>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Select Your <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Portfolio</span> Theme
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Choose a theme that reflects your unique style and professional identity.
            Each template is fully customizable to suit your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {themes.map((theme) => (
            <div 
              key={theme.id} 
              className={`bg-stone-800/50 backdrop-blur-sm border border-stone-700/50 rounded-xl overflow-hidden hover:border-teal-500/30 transition-all hover:shadow-lg hover:shadow-teal-700/10 ${
                selectedTheme === theme.id ? 'border-2 border-teal-500 ring-2 ring-teal-500/50' : ''
              }`}
            >
              <div className="h-64 bg-stone-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={theme.image}
                    alt={`${theme.name} theme preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedTheme === theme.id && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-teal-500 text-stone-900 p-1 rounded-full">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{theme.name}</h3>
                <p className="text-stone-300 mb-6 h-20">{theme.description}</p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/portfolio')} 
                    className="flex items-center gap-2 border-stone-600 text-stone-200 hover:bg-stone-700/50"
                  >
                    <GripHorizontalIcon className="h-4 w-4" />
                    Live Demo
                  </Button>
                  <Button 
                    onClick={() => handleSelectTheme(theme.id)} 
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-0 text-stone-900"
                  >
                    <MousePointer2 className="h-4 w-4" />
                    Select
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Creation Method Modal using shadcn/ui Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-stone-900 border border-stone-800 text-stone-100 max-w-lg p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center">
              Choose Creation Method
            </DialogTitle>
            <DialogDescription className="text-stone-400 text-center">
              Select how you'd like to start building your new portfolio
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 mt-4">
            {/* Horizontal Card 1 */}
            <div 
              className={`flex flex-row p-4 rounded-lg cursor-pointer border transition-all ${
                creationMethod === 'scratch' 
                  ? 'border-teal-500 bg-teal-900/20' 
                  : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
              }`}
              onClick={() => setCreationMethod('scratch')}
            >
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg mr-4 self-center">
                <PlusCircle className="h-6 w-6 text-stone-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Create from Scratch</h3>
                <p className="text-stone-300 text-sm">
                  Start with a blank template and build your portfolio step by step. 
                  Perfect if you want complete control over your content.
                </p>
              </div>
            </div>
            
            {/* Horizontal Card 2 */}
            <div 
              className={`flex flex-row p-4 rounded-lg cursor-pointer border transition-all ${
                creationMethod === 'import' 
                  ? 'border-teal-500 bg-teal-900/20' 
                  : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
              }`}
              onClick={() => setCreationMethod('import')}
            >
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg mr-4 self-center">
                <FileText className="h-6 w-6 text-stone-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Import from Resume</h3>
                <p className="text-stone-300 text-sm">
                  Upload your existing resume and we'll automatically populate your portfolio.
                  Save time by importing your skills, experience, and education.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleCreatePortfolio}
              disabled={isCreating || !creationMethod}
              className={`px-8 py-2 rounded-lg font-medium text-lg transition-all ${
                creationMethod 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-stone-900' 
                  : 'bg-stone-700 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <>Creating...</>
              ) : (
                <>Continue</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioThemePage;