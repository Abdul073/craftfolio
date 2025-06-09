"use client";

import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon, PaperclipIcon, Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import EditButton from '@/components/EditButton';

const Navbar = ({ currentPortTheme, customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { portfolioData } = useSelector((state: RootState) => state.data);

  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const buttonBgColor = theme.colors.primary;
  const buttonTextColor = theme.colors.text.primary;
  const buttonHoverBgColor = theme.colors.primaryHover;
  const buttonHoverTextColor = theme.colors.text.secondary;

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Tech Stack", href: "#tech-stack" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData.find(
        (section: any) => section.type === "hero"
      )?.data;
      const userInfoData = portfolioData.find(
        (section: any) => section.type === "userInfo"
      )?.data;
      
      if (heroSectionData) {
        setHeroData(heroSectionData);
      }
      if (userInfoData) {
        setUserInfo(userInfoData);
      }
      setIsLoading(false);
    }
  }, [portfolioData]);

  useEffect(() => {
    if (!portfolioId || isLoading) return;

    const subscription = supabase
      .channel(`portfolio-navbar-${portfolioId}`)
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

  const spring = {
    type: "spring",
    damping: 50,
    stiffness: 250,
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading || !heroData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <motion.div
      className={`flex items-center justify-between mx-auto backdrop-blur-3xl z-50 bg-black/10 rounded-lg border ${
        scrolled ? "w-4/5 border-gray-300/20 text-white" : "w-full"
      }`}
      layout
      transition={spring}
      style={{
        position: "sticky",
        top: scrolled ? "1rem" : "0",
        padding: scrolled ? "0.75rem" : "1.25rem",
        height: scrolled ? "4rem" : "5rem",
        boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <style>{customCSS}</style>
      <LayoutGroup>
        <div className="flex items-center justify-between w-full">
          <motion.div
            layout
            transition={spring}
            className="overflow-hidden"
            style={{
              width: scrolled ? 0 : "auto",
              opacity: scrolled ? 0 : 1,
              marginRight: scrolled ? 0 : "1rem",
            }}
          >
            <h1 className="text-2xl font-semibold tracking-wide whitespace-nowrap">
              {heroData?.name}
            </h1>
          </motion.div>

          <motion.div
            layout
            transition={spring}
            className="hidden md:flex items-center justify-center gap-8"
          >
            {navItems.map((item) => (
              <motion.a
                layout
                key={item.name}
                href={item.href}
                className="cursor-pointer text-gray-400 text-lg hover:text-white transition duration-200 ease-in"
                transition={spring}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            layout
            transition={spring}
            className="flex items-center justify-center gap-4 md:gap-8"
          >
              <EditButton sectionName="contact" divStyles={" "} styles="relative top-0 right-0" />

            <motion.div
              layout
              transition={spring}
              className="flex items-center justify-center gap-4"
            >
              <motion.a
                layout
                transition={spring}
                href={userInfo?.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon
                  className="cursor-pointer hover:text-green-300 transition-colors"
                  size={20}
                />
              </motion.a>
              <motion.a
                layout
                transition={spring}
                href={userInfo?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon
                  className="cursor-pointer hover:text-green-300 transition-colors"
                  size={20}
                />
              </motion.a>
            </motion.div>
            <motion.div layout transition={spring} className="flex items-center gap-4">
              <Button
                onClick={handleResumeDownload}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = buttonHoverBgColor;
                  e.currentTarget.style.color = buttonHoverTextColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = buttonBgColor;
                  e.currentTarget.style.color = buttonTextColor;
                  e.currentTarget.style.border = `1px solid ${buttonBgColor}`;
                }}
                style={{ background: buttonBgColor, color: buttonTextColor }}
                className="px-4 md:px-8 py-2 rounded-md cursor-pointer flex items-center gap-2 font-medium"
              >
                <PaperclipIcon size={18} /> Resume
              </Button>
            </motion.div>

            <motion.div layout transition={spring} className="md:hidden">
              <Menu
                className="cursor-pointer ml-4"
                size={24}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </motion.div>
          </motion.div>
        </div>
      </LayoutGroup>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full right-0 left-0 bg-black/90 backdrop-blur-3xl p-4 flex flex-col gap-4 border-t border-white/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-white p-2 transition duration-200 ease-in"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
