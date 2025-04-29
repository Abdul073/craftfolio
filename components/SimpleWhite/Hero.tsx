import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import type { NextPage } from 'next';
import Navbar from './Navbar';
import AnimatedButton from './AnimatedButton';
import EditButton from './EditButton';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

const Hero: NextPage = () => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null)
  
  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData?.find((section: any) => section.type === "hero")?.data;
      const userInfo = portfolioData?.find((section: any) => section.type === "userInfo")?.data;

      if(userInfo){
        setUserInfo(userInfo)
      }

      if (heroSectionData) {
        setHeroData(heroSectionData);
      } else {
        setHeroData({
          name: "John Doe",
          title: "Full Stack Developer",
          summary: "I build exceptional and accessible digital experiences for the web.",
          shortSummary: "I build exceptional and accessible digital experiences for the web.",
        });
      }
      setIsLoading(false);
    }
  }, [portfolioData]);
  
  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-${portfolioId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          console.log('Portfolio update detected!', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status: ${status}`);
      });
      
    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen relative bg-white simple-white">
     
      <Navbar />

      <div className="flex justify-center items-end min-h-screen">
        <div className="max-w-[90%] mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 relative">
            <EditButton styles='right-0 -top-16' sectionName="hero"/>
              <h1 className="text-7xl font-extrabold text-gray-900 mb-3">
                {heroData?.name || "John Doe"}
              </h1>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                {heroData?.title || "Full Stack Developer"}
              </h2>
              <p className="text-lg font-medium text-gray-700 mb-10">
                {heroData?.summary || "I build exceptional and accessible digital experiences for the web."}
              </p>

              {/* Social Links */}
              <div className="flex space-x-4 mb-16">
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 hover:scale-[1.2] duration-200 ease-in rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-2xl  transition-shadow"
                >
                  <FaGithub className="w-8 h-8 text-gray-900" />
                </a>
                <a 
                  href="https://linkedin.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-16 h-16 hover:scale-[1.2] duration-200 ease-in rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-2xl  transition-shadow"
                >
                  <FaLinkedin className="w-8 h-8 text-gray-900" />
                </a>
              </div>
            </div>

            {/* Right Column - About */}
            <div className="lg:col-span-2 relative">
            <EditButton styles='right-0 -top-16' sectionName="contact"/>

              <div
            className="relative bg-gradient-to-br from-white to-primary-100  p-6 rounded-lg shadow-lg border-2 border-primary-100 hover:border-black/20 border-transparent transition-all duration-300">            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Me</h2>
                
                <div className="flex items-center mb-4">
                  <MdEmail className="w-5 h-5 text-gray-500 mr-3" />
                  <a href="mailto:john@example.com" className="text-gray-700 text-xl font-medium hover:text-gray-900">
                    {userInfo?.email}
                  </a>
                </div>
                
                <div className="flex items-center mb-8">
                  <MdLocationOn className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700 text-lg font-medium">{userInfo?.location}</span>
                </div>
                
                <p className="text-gray-700 text-md">
                  {userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web."}
                </p>
              </div>

              {/* Resume Download Button */}
              <div className='ml-32'>
              <AnimatedButton
              text="Download Resume"
              icon={<FaFile size={20} />}
              link={""}
              />
              </div>

            </div>
          </main>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center">
            <button className="rounded-full w-12 h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;