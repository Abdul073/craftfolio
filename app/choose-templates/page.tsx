'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GripHorizontalIcon, MousePointer2, CheckCircle, FileText, PlusCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { createPortfolio, fetchThemesApi } from '../actions/portfolio';
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
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};


const PortfolioThemePage = () => {
  const { user, isLoaded } = useUser();
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMethod, setCreationMethod] = useState("");
  const [scrolled, setScrolled] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const ColorTheme = {
    primary: 'var(--primary)',
    primaryHover: 'var(--primary-hover)',
    primaryLight: 'var(--primary-light)',
    primaryDark: 'var(--primary-dark)',
    primaryGlow: 'var(--primary-glow)',
    
    bgMain: 'var(--bg-main)',
    bgCard: 'var(--bg-card)',
    bgCardHover: 'var(--bg-card-hover)',
    bgNav: 'var(--bg-nav)',
    
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    textMuted: 'var(--text-muted)',
    
    borderLight: 'var(--border-light)',
    borderDark: 'var(--border-dark)',
  }

  const [themes,setThemes] = useState<any>([]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, isLoaded, router]);


  useEffect(()=>{

    fetchThemes();

  },[])

  const fetchThemes = async () => {
    try {
      const response = await fetchThemesApi();
      if(response.success){
        setThemes(response.data)
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  const handleSelectTheme = (id : number) => {
    setSelectedTheme(id);
    setIsModalOpen(true);
  };
  
  const handleCreatePortfolio = async () => {
    if (selectedTheme && user && creationMethod) {
      setIsCreating(true);
      try {
        const themeName = themes.find((theme : any) => theme.id === selectedTheme)?.name;
        if(!themeName){
          toast.error("Invalid template");
          return;
        }
        const result = await createPortfolio(user.id, themeName, creationMethod);
        
        if (result.success) {
          toast.success('Portfolio created successfully');
          if (creationMethod === 'import') {
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
  interface Style {
    [key: string]: string;
  }

  console.log(themes)

  if(themes.length === 0){
    return <div>loading...</div>
  }
  

  return (
    <div 
      className="min-h-screen relative" 
      style={{
        "--primary": "#10b981", // emerald-500
        "--primary-hover": "#059669", // emerald-600
        "--primary-light": "#d1fae5", // emerald-100
        "--primary-dark": "#047857", // emerald-700
        "--primary-glow": "rgba(16, 185, 129, 0.15)", // emerald with opacity
        
        "--bg-main": "#121212", // Very dark gray
        "--bg-card": "rgba(28, 28, 30, 0.7)", // Slightly lighter dark with transparency
        "--bg-card-hover": "rgba(38, 38, 42, 0.7)", // Even lighter for hover states
        "--bg-nav": "rgba(18, 18, 18, 0.9)", // Nav background with transparency
        
        "--text-primary": "#f3f4f6", // Gray-100
        "--text-secondary": "#d1d5db", // Gray-300
        "--text-muted": "#9ca3af", // Gray-400
        
        "--border-light": "rgba(75, 85, 99, 0.3)", // Gray-600 with opacity
        "--border-dark": "rgba(55, 65, 81, 0.5)", // Gray-700 with opacity
      } as Style}
    >
      {/* Animated background shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)` }}
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-1/4 h-1/4 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)` }}
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/6 w-1/6 h-1/6 rounded-full opacity-5"
          style={{ background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)` }}
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Fixed navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md shadow-lg' : 'bg-transparent'}`} style={{ backgroundColor: scrolled ? ColorTheme.bgNav : 'transparent' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/" className="text-2xl font-bold">
                  <span style={{ 
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    CraftFolio
                    <span className="relative">
                      <motion.span 
                        className="absolute -top-2 -right-4 text-xs font-normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ color: ColorTheme.primary }}
                      >
                        ✦
                      </motion.span>
                    </span>
                  </span>
                </Link>
              </motion.div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full transition-colors"
              style={{ 
                backgroundColor: 'rgba(28, 28, 30, 0.6)', 
                color: ColorTheme.textPrimary 
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-[85%] px-4 pb-24">
        {/* Hero section */}
        <motion.div 
          className="pt-32 text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-5xl font-bold mb-6"
            variants={fadeIn}
          >
            Select Your <span style={{ 
              background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Portfolio</span> Theme
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: ColorTheme.textSecondary }}
            variants={fadeIn}
          >
            Choose a theme that reflects your unique style and professional identity.
            Each template is fully customizable to suit your needs.
          </motion.p>
        </motion.div>

        {/* Themes grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {themes?.map((theme : any) => (
            <motion.div 
              key={theme.id} 
              className="rounded-xl overflow-hidden transition-all h-full"
              variants={fadeInScale}
              style={{ 
                backgroundColor: ColorTheme.bgCard,
                backdropFilter: "blur(12px)",
                border: `1px solid ${selectedTheme === theme.id ? ColorTheme.primary : ColorTheme.borderLight}`,
                boxShadow: selectedTheme === theme.id ? `0 0 20px ${ColorTheme.primaryGlow}` : 'none'
              }}
              whileHover={{ 
                boxShadow: `0 8px 30px rgba(0,0,0,0.12), 0 4px 15px ${ColorTheme.primaryGlow}`,
                borderColor: `${ColorTheme.primary}50`
              }}
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={theme.previewImageUrl}
                  alt={`${theme.name} theme preview`}
                  className="w-full h-full object-cover transition-transform"
                />
                
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: `1px solid ${ColorTheme.primary}`,
                    color: ColorTheme.primary,
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  Professional
                  {/* {theme.category} */}
                </div>
                
                {selectedTheme === theme.id && (
                  <motion.div 
                    className="absolute top-4 right-4 p-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ 
                      backgroundColor: ColorTheme.primary,
                      color: '#000'
                    }}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: ColorTheme.textPrimary }}>{theme.templateName}</h3>
                <p className="mb-6 h-20" style={{ color: ColorTheme.textSecondary }}>{theme.description}</p>
                
                <div className="flex justify-between items-center">
                  <motion.button 
                    className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                    style={{ 
                      backgroundColor: 'rgba(38, 38, 42, 0.8)',
                      color: ColorTheme.textPrimary
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(48, 48, 52, 0.8)',
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/portfolio')}
                  >
                    <GripHorizontalIcon className="h-4 w-4" />
                    Preview
                  </motion.button>
                  
                  <motion.button 
                    className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                    style={{ 
                      background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      color: '#000',
                      boxShadow: selectedTheme === theme.id ? `0 4px 14px ${ColorTheme.primaryGlow}` : 'none'
                    }}
                    whileHover={{ 
                      boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectTheme(theme.id)}
                  >
                    <MousePointer2 className="h-4 w-4" />
                    Select
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Floating decoration */}
        <motion.div 
          className="fixed bottom-8 right-8 px-4 py-2 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: `1px solid ${ColorTheme.primary}`,
            color: ColorTheme.primary,
            backdropFilter: 'blur(8px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span>Fully Customizable ✨</span>
        </motion.div>
      </div>
   
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent 
    className="backdrop-blur-xl rounded-xl overflow-hidden"
    style={{ 
      backgroundColor: 'rgba(18, 18, 18, 0.95)', 
      border: '1px solid rgba(75, 85, 99, 0.3)',
      color: '#f3f4f6',
      boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(16, 185, 129, 0.15)',
      maxWidth: '900px',
      padding: '48px',
    }}
  >
    <DialogHeader className="mb-4">
      <DialogTitle className='text-3xl text-center md:text-4xl font-bold'>
              How would you like to build your <span style={{ 
                  background: `linear-gradient(to right, #10b981, #047857)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>portfolio</span>?
      </DialogTitle>
    </DialogHeader>
    
    <motion.div 
      className="flex flex-col md:flex-row gap-6 mt-6"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* From scratch option */}
      <motion.div 
        className="flex-1 p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
        variants={fadeInScale}
        style={{ 
          backgroundColor: creationMethod === 'scratch' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(28, 28, 30, 0.8)',
          borderColor: creationMethod === 'scratch' ? '#10b981' : 'rgba(75, 85, 99, 0.3)',
          boxShadow: creationMethod === 'scratch' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
        }}
        whileHover={{ 
          borderColor: '#10b981',
          boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)'
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCreationMethod('scratch')}
      >
        <div className="p-3 rounded-full mb-4" style={{ 
          background: creationMethod === 'scratch' 
            ? '#10b981' 
            : 'rgba(38, 38, 42, 0.8)'
        }}>
          <PlusCircle className="h-7 w-7" style={{ color: creationMethod === 'scratch' ? '#000' : '#f3f4f6' }} />
        </div>
        <h3 className="text-xl font-semibold" style={{ color: '#f3f4f6' }}>Create from Scratch</h3>
        <p className=''>Start with a blank template and build your portfolio step by step. Perfect if you want complete control over your content.</p>
      </motion.div>
      
      {/* Import from resume option */}
      <motion.div 
        className="flex-1 p-5 rounded-xl cursor-pointer border transition-all flex flex-col items-center text-center"
        variants={fadeInScale}
        style={{ 
          backgroundColor: creationMethod === 'import' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(28, 28, 30, 0.8)',
          borderColor: creationMethod === 'import' ? '#10b981' : 'rgba(75, 85, 99, 0.3)',
          boxShadow: creationMethod === 'import' ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
        }}
        whileHover={{ 
          borderColor: '#10b981',
          boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2)'
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCreationMethod('import')}
      >
        <div className="p-3 rounded-full mb-4" style={{ 
          background: creationMethod === 'import' 
            ? '#10b981' 
            : 'rgba(38, 38, 42, 0.8)'
        }}>
          <FileText className="h-7 w-7" style={{ color: creationMethod === 'import' ? '#000' : '#f3f4f6' }} />
        </div>
        <h3 className="text-xl font-semibold" style={{ color: '#f3f4f6' }}>Import from Resume</h3>
        <p> Upload your existing resume and we'll automatically populate your portfolio. Save time by importing your skills, experience, projects and education.</p>
      </motion.div>
    </motion.div>
    
    <motion.div 
      className="flex justify-center mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <motion.button 
        className="px-8 py-3 rounded-lg font-medium text-lg transition-all flex items-center justify-center"
        style={{ 
          background: creationMethod 
            ? '#10b981' 
            : 'rgba(38, 38, 42, 0.8)',
          color: creationMethod ? '#000' : '#9ca3af',
          boxShadow: creationMethod ? '0 6px 20px rgba(16, 185, 129, 0.15)' : 'none',
          cursor: creationMethod && !isCreating ? 'pointer' : 'not-allowed',
          opacity: isCreating ? 0.7 : 1,
          width: '170px'
        }}
        whileHover={{ 
          boxShadow: creationMethod && !isCreating ? '0 8px 24px rgba(16, 185, 129, 0.2)' : 'none',
          scale: creationMethod && !isCreating ? 1.03 : 1
        }}
        whileTap={{ scale: creationMethod && !isCreating ? 0.97 : 1 }}
        onClick={handleCreatePortfolio}
        disabled={isCreating || !creationMethod}
      >
        {isCreating ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Creating...</span>
          </>
        ) : (
          <>Get Started</>
        )}
      </motion.button>
    </motion.div>
  </DialogContent>
</Dialog>


    </div>
  );
};

export default PortfolioThemePage;