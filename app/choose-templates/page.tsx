'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createPortfolio, fetchThemesApi } from '../actions/portfolio';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ThemeCard from '@/components/ThemeCard';
import { ColorTheme } from '@/lib/colorThemes';
import { fadeIn, staggerContainer } from '@/lib/animations';
import CreateMethodModal from '@/components/CreateMethodModal';
import LoadingSpinner from '@/components/LoadingSpinner';



const PortfolioThemePage = () => {
  const { user, isLoaded } = useUser();
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMethod, setCreationMethod] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(true);
  
  const router = useRouter();
  const dispatch = useDispatch();


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
      console.log("hii",response)
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  console.log(themes)

  const handleSelectTheme = (id : number) => {
    setSelectedTheme(id);
    setIsModalOpen(true);
  };
  
  const handleCreatePortfolio = async (customBodyResume : any) => {
    if (selectedTheme && user && creationMethod) {
      setIsCreating(true);
      try {
        const themeName = themes.find((theme : any) => theme.id === selectedTheme)?.name;
        if(!themeName){
          toast.error("Invalid template");
          return;
        }
        const result = await createPortfolio(user.id, themeName, creationMethod,customBodyResume);
        if (result.success) {
          if (creationMethod === 'import') {
            router.push(`/portfolio/${result?.data?.id}`);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirectLoading(false);
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  if (themes.length === 0 && redirectLoading) {
    return <LoadingSpinner />;
  }

  

  return (
    <div 
      className="min-h-screen main-bg-noise  relative" 
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
      <header className={`w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md shadow-lg' : 'bg-transparent'}`} style={{ backgroundColor: scrolled ? ColorTheme.bgNav : 'transparent' }}>
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

      <div className="container mx-auto max-w-[70%] px-4 pb-24">
        {/* Hero section */}
        <motion.div 
          className="pt-16 text-center mb-16"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          // variants={staggerContainer}
        >
          {themes?.map((theme : any) => (

            <div key={theme.id}>
              <ThemeCard theme={theme} handleSelectTheme={handleSelectTheme} selectedTheme={selectedTheme} />
          
            </div>
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
   
      <CreateMethodModal
       isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isCreating={isCreating}
        setCreationMethod={setCreationMethod}
        handleCreatePortfolio={handleCreatePortfolio}
        creationMethod={creationMethod} />
    </div>
  );
};

export default PortfolioThemePage;