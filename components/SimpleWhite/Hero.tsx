import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import type { NextPage } from 'next';
import Navbar from './Navbar';
import AnimatedButton from './AnimatedButton';
import EditButton from './EditButton';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Hero: NextPage = () => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);

  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData?.find((section: any) => section.type === "hero")?.data;
      const userInfoData = portfolioData?.find((section: any) => section.type === "userInfo")?.data;

      if (userInfoData) {
        setUserInfo(userInfoData);
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
      .channel(`portfolio-hero-${portfolioId}`)
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

  const handleResumeDownload = () => {
    if (userInfo?.resumeFile) {
      window.open(userInfo.resumeFile, '_blank');
      return;
    }

    if (userInfo?.resumeLink) {
      window.open(userInfo.resumeLink, '_blank');
      return;
    }

    toast.error('No resume available. Please upload a resume in the contact section.');
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       Loading...
  //     </div>
  //   );
  // }

  console.log(userInfo)

  return (
    <div id='about' className="min-h-screen relative bg-white simple-white">
      <Navbar />

      <div className="flex justify-center items-end min-h-screen">
        <div className="max-w-[90%] mx-auto px-4 pb-0 sm:px-6 lg:px-8">
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 relative">
              <EditButton styles='right-0 -top-16' sectionName="hero" />

              <motion.h1
                className="text-7xl font-extrabold text-gray-900 mb-3"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 0.1
                }}
              >
                {userInfo?.name || "John Doe"}
              </motion.h1>

              <motion.h2
                className="text-2xl font-bold text-gray-600 mb-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 0.2
                }}
              >
                {heroData?.title || "Full Stack Developer"}
              </motion.h2>

              <motion.p
                className="text-lg font-medium text-gray-700 mb-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 0.3
                }}
              >
                {heroData?.summary || "I build exceptional and accessible digital experiences for the web."}
              </motion.p>

              {/* Social Links */}
              <div className="flex space-x-4 mb-16">
                <motion.a
                  href={userInfo?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 duration-200 ease-in border-4 border-transparent hover:border-8 hover:border-black/30 rounded-full bg-white flex items-center justify-center  transition-all"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    // transition: {
                    //   type: "spring",
                    //   stiffness: 260,
                    //   damping: 20,
                    // }
                  }}
                >
                  <FaGithub className="w-8 h-8 text-gray-900" />
                </motion.a>

                <motion.a
                  href={userInfo?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 duration-200 ease-in border-4 border-transparent hover:border-8 hover:border-black/30 rounded-full bg-white flex items-center justify-center  transition-all"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                >
                  <FaLinkedin className="w-8 h-8 text-gray-900" />
                </motion.a>
              </div>
            </div>

            {/* Right Column - About */}
            <div className="lg:col-span-2 relative">
              <EditButton styles='right-72 -top-16' sectionName="contact" />

              <motion.div
                className="relative bg-gradient-to-br from-white to-primary-100 p-6 rounded-lg shadow-lg border-2 border-primary-100 hover:border-black/20 border-transparent transition-all duration-300"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.4
                  }
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <motion.h2
                  className="text-4xl font-bold text-gray-900 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.5, duration: 0.5 }
                  }}
                >
                  About Me
                </motion.h2>

                <motion.div
                  className="flex items-center mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.5 }
                  }}
                >
                  <MdEmail className="w-5 h-5 text-gray-500 mr-3" />
                  <a href={`mailto:${userInfo?.email}`} className="text-gray-700 text-xl font-medium hover:text-gray-900">
                    {userInfo?.email}
                  </a>
                </motion.div>

                <motion.div
                  className="flex items-center mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.7, duration: 0.5 }
                  }}
                >
                  <MdLocationOn className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-gray-700 text-lg font-medium">{userInfo?.location}</span>
                </motion.div>

                <motion.p
                  className="text-gray-700 text-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.8, duration: 0.5 }
                  }}
                >
                  {userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web."}
                </motion.p>
              </motion.div>

              <motion.div
                className='ml-32'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <AnimatedButton
                  text="Download Resume"
                  icon={<FaFile size={20} />}
                  onClick={handleResumeDownload}
                />
              </motion.div>

            </div>
          </main>

          {/* Scroll Down Indicator */}
          <motion.div
            className="flex justify-center mt-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 1.2, duration: 0.5 }
            }}
            whileHover={{
              y: [0, -8, 0],
              transition: {
                y: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5
                }
              }
            }}
          >
            <motion.button
              className="rounded-full w-12 h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronDown />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;