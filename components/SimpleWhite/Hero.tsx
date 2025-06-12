import { FaGithub, FaLinkedin, FaChevronDown, FaFile } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import type { NextPage } from "next";
import Navbar from "./Navbar";
import AnimatedButton from "./AnimatedButton";
import EditButton from "@/components/EditButton";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Hero: NextPage = ({ customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);

  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData?.find(
        (section: any) => section.type === "hero"
      )?.data;
      const userInfoData = portfolioData?.find(
        (section: any) => section.type === "userInfo"
      )?.data;

      if (userInfoData) {
        setUserInfo(userInfoData);
      }

      if (heroSectionData) {
        console.log("yes");
        setHeroData(heroSectionData);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-hero-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          console.log("Portfolio update detected!", payload);
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
      window.open(userInfo.resumeFile, "_blank");
      return;
    }

    if (userInfo?.resumeLink) {
      window.open(userInfo.resumeLink, "_blank");
      return;
    }

    toast.error(
      "No resume available. Please upload a resume in the contact section."
    );
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    <div id="about" className="min-h-screen relative bg-white simple-white">
      <style>{customCSS}</style>

      <Navbar />

      <div className="flex justify-center items-end min-h-screen">
        <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto px-4 pb-4 sm:pb-8 lg:pb-0 sm:px-6 lg:px-8">
          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 xl:gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 relative order-1 lg:order-1">
              <EditButton
                styles="right-0 -top-8 sm:-top-12 lg:-top-16"
                sectionName="hero"
              />

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-2 sm:mb-3 section-title leading-tight"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 0.1,
                }}
              >
                {heroData?.name || "John Doe"}
              </motion.h1>

              <motion.h2
                className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-gray-600 mb-3 sm:mb-4 section-sub-title"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 0.2,
                }}
              >
                {heroData?.title || "Full Stack Developer"}
              </motion.h2>

              <motion.p
                className="text-base sm:text-lg lg:text-lg font-medium text-gray-700 mb-6 sm:mb-8 lg:mb-10 section-description"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: 0.3,
                }}
              >
                {heroData?.summary ||
                  "I build exceptional and accessible digital experiences for the web."}
              </motion.p>

              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4 mb-8 sm:mb-12 lg:mb-16">
                <motion.a
                  href={userInfo?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 duration-200 ease-in border-4 border-transparent hover:border-8 hover:border-black/30 rounded-full bg-white flex items-center justify-center transition-all"
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
                  <FaGithub className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
                </motion.a>

                <motion.a
                  href={userInfo?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 duration-200 ease-in border-4 border-transparent hover:border-8 hover:border-black/30 rounded-full bg-white flex items-center justify-center transition-all"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                >
                  <FaLinkedin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
                </motion.a>
              </div>
            </div>

            {/* Right Column - About */}
            <div className="lg:col-span-2 relative order-2 lg:order-2">
              <EditButton
                styles="right-0 sm:right-16 md:right-32 lg:right-72 -top-8 sm:-top-12 lg:-top-16"
                sectionName="contact"
              />

              <motion.div
                className="relative bg-gradient-to-br from-white to-primary-100 p-4 sm:p-5 lg:p-6 rounded-lg shadow-lg border-2 border-primary-100 hover:border-black/20 border-transparent transition-all duration-300"
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.4,
                  },
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
              >
                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold section-sub-title text-gray-900 mb-4 sm:mb-5 lg:mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.5, duration: 0.5 },
                  }}
                >
                  About Me
                </motion.h2>

                <motion.div
                  className="flex items-center mb-3 sm:mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.5 },
                  }}
                >
                  <MdEmail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
                  <a
                    href={`mailto:${userInfo?.email}`}
                    className="text-gray-700 text-base sm:text-lg lg:text-xl font-medium hover:text-gray-900 break-all"
                  >
                    {userInfo?.email}
                  </a>
                </motion.div>

                <motion.div
                  className="flex items-center mb-6 sm:mb-7 lg:mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.7, duration: 0.5 },
                  }}
                >
                  <MdLocationOn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-gray-700 text-base sm:text-lg font-medium">
                    {userInfo?.location}
                  </span>
                </motion.div>

                <motion.p
                  className="text-gray-700 section-sub-description text-sm sm:text-base lg:text-md leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { delay: 0.8, duration: 0.5 },
                  }}
                >
                  {userInfo?.shortSummary ||
                    "I build exceptional and accessible digital experiences for the web."}
                </motion.p>
              </motion.div>

              <motion.div
                className="mt-4 sm:mt-6 lg:mt-0 lg:ml-32 flex justify-center lg:justify-start"
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
            className="flex justify-center mt-8 sm:mt-10 lg:mt-12"
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 1.2, duration: 0.5 },
            }}
            whileHover={{
              y: [0, -8, 0],
              transition: {
                y: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                },
              },
            }}
          >
            <motion.button
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
