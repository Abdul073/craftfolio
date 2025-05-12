"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { fetchContent, getThemeNameApi } from "@/app/actions/portfolio";
import { useParams } from "next/navigation";
import { setPortfolioData, setThemeName } from "@/slices/dataSlice";
import { templatesConfig } from "@/lib/templateConfig";
import Sidebar from "../Sidebar";
import { Spotlight } from "@/components/NeoSpark/Spotlight";
import Chatbot from "@/components/Chatbot/Chatbot";
import { motion, AnimatePresence } from "framer-motion";
import { fontClassMap } from "@/lib/font";
import { cn } from "@/lib/utils";
import type { NextPage } from "next";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { portfolioData, themeName: currentTheme } = useSelector((state: RootState) => state.data);
  const allSections = portfolioData?.map((item: any) => item.type);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState("Raleway");
  const [currentPortTheme, setCurrentPortTheme] = useState<any>("default")

  type TemplateType = {
    navbar: React.ComponentType;
    spotlight?: boolean;
    sections: {
      [key: string]: React.ComponentType;
    };
  };

  const Template = currentTheme ? (templatesConfig[currentTheme as keyof typeof templatesConfig] as TemplateType) : null;
  const getComponentForSection = (sectionType: string) => {
    if (!Template || !Template.sections || !Template.sections[sectionType]) {
      return null;
    }
    const SectionComponent = Template.sections[sectionType];
    const themes  = portfolioData?.find((item: any) => item.type === "themes").data;
    return SectionComponent ? <SectionComponent currentPortTheme={currentPortTheme} key={`${sectionType}`} /> : null;
  };

  useEffect(() => {
    const initializePortfolio = async () => {
      setIsLoading(true);
      
      try {
        const themeResult = await getThemeNameApi({ portfolioId });
        if (themeResult.success) {
          dispatch(setThemeName(themeResult?.data?.templateName || 'default'));
        }
        
        const contentResult : any = await fetchContent({ portfolioId });
        if (contentResult.success) {
          dispatch(setPortfolioData(contentResult?.data?.sections));
        }
      } catch (error) {
        console.log("Error initializing portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializePortfolio();
  }, [portfolioId, dispatch]);

  if (!Template || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading portfolio...</p>
      </div>
    );
  }

  const NavbarComponent = Template.navbar;
  const hasSpotlight = Template.spotlight;
  const selectedFontClass = fontClassMap[currentFont] || fontClassMap["raleway"];

  return (
    <div className="min-h-screen flex flex-col">
      {hasSpotlight && (
        <div className="absolute inset-0">
          <Spotlight
            className="-top-40 left-0 md:-top-80 md:left-5"
            fill="white"
          />
        </div>
      )}

      <motion.div 
        className={cn("custom-bg min-h-screen w-[80%]",selectedFontClass)}
        animate={{
          width: isChatOpen ? '80%' : '100%',
          marginRight: isChatOpen ? '20%' : '0',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {NavbarComponent && <NavbarComponent />}
        <Sidebar />
        
        {allSections && allSections.length > 0 ? (
          allSections.map((section: string) => getComponentForSection(section))
        ) : (
          <div className={cn("flex items-center justify-center h-screen")}>
            <p className="text-xl">Portfolio content not found</p>
          </div>
        )}
      </motion.div>
      <Chatbot portfolioData={portfolioData} setCurrentFont={setCurrentFont} setCurrentPortTheme={setCurrentPortTheme} portfolioId={portfolioId} onOpenChange={setIsChatOpen}/>
    </div>
  );
};

export default Page;