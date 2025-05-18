"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { fetchContent, getThemeNameApi } from "@/app/actions/portfolio";
import { useParams } from "next/navigation";
import { setCustomCSSState, setFontName, setPortfolioData, setTemplateName, setThemeName } from "@/slices/dataSlice";
import { templatesConfig } from "@/lib/templateConfig";
import Sidebar from "../Sidebar";
import { Spotlight } from "@/components/NeoSpark/Spotlight";
import Chatbot from "@/components/Chatbot/Chatbot";
import { motion } from "framer-motion";
import { fontClassMap } from "@/lib/font";
import { cn } from "@/lib/utils";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { portfolioData, templateName, themeName, fontName,customCSSState } = useSelector(
    (state: RootState) => state.data
  );
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [customCSS, setCustomCSS] = useState("");

  type TemplateType = {
    navbar: React.ComponentType;
    spotlight?: boolean;
    sections: {
      [key: string]: React.ComponentType;
    };
  };

  // Only access portfolio data after it's loaded
  const allSections = dataLoaded ? portfolioData?.map((item: any) => item.type) : [];
  
  const themes = dataLoaded 
    ? portfolioData?.find((item: any) => item.type === "themes")?.data 
    : undefined;

  // Initialize portfolio data
  useEffect(() => {
    const initializePortfolio = async () => {
      setIsLoading(true);
      setDataLoaded(false);

      try {
        // Fetch theme data
        const themeResult = await getThemeNameApi({ portfolioId });
        if (themeResult.success) {
          dispatch(setTemplateName(themeResult?.data?.templateName || "default"));
          dispatch(setThemeName(themeResult?.data?.themeName || "default"));
          dispatch(setFontName(themeResult?.data?.fontName || "Raleway"));
          dispatch(setCustomCSSState(themeResult?.data?.customCSS || ""));
        }

        // Fetch content data
        const contentResult: any = await fetchContent({ portfolioId });
        if (contentResult.success) {
          dispatch(setPortfolioData(contentResult?.data?.sections));
        }
        
        // Mark data as loaded only after both fetches complete
        setDataLoaded(true);
      } catch (error) {
        console.error("Error initializing portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePortfolio();
  }, [portfolioId, dispatch]);

  // Don't try to access template config until we have template name
  const Template = (dataLoaded && templateName)
    ? (templatesConfig[
        templateName as keyof typeof templatesConfig
      ] as TemplateType)
    : null;

  const getComponentForSection = (sectionType: string) => {
    if (!Template || !Template.sections || !Template.sections[sectionType]) {
      return null;
    }
    const SectionComponent : any = Template.sections[sectionType];
    return SectionComponent ? (
      <SectionComponent
        currentPortTheme={themeName}
        customCSS={customCSSState}
        key={`${sectionType}`}
      />
    ) : null;
  };

  // Show loading state until both API calls complete and data is processed
  if (isLoading || !dataLoaded || !Template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading portfolio...</p>
      </div>
    );
  }

  // By this point, we guarantee the data is loaded
  const NavbarComponent : any = Template.navbar;
  const hasSpotlight = Template.spotlight;
  const selectedFontClass = fontClassMap[fontName] || fontClassMap["raleway"];

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
        className={cn("custom-bg min-h-screen w-[80%]", selectedFontClass)}
        animate={{
          width: isChatOpen ? "80%" : "100%",
          marginRight: isChatOpen ? "20%" : "0",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {NavbarComponent && <NavbarComponent customCSS={customCSSState} currentPortTheme={themeName}/>}
        <Sidebar />

        {allSections && allSections.length > 0 ? (
          allSections.map((section: string) => getComponentForSection(section))
        ) : (
          <div className={cn("flex items-center justify-center h-screen")}>
            <p className="text-xl">Portfolio content not found</p>
          </div>
        )}
      </motion.div>
      
      {/* Only render Chatbot after data is loaded */}
      {dataLoaded && (
        <Chatbot
          portfolioData={portfolioData}
          themeOptions={themes}
          setCurrentFont={(font) => dispatch(setFontName(font))}
          setCurrentPortTheme={(theme) => dispatch(setThemeName(theme))}
          portfolioId={portfolioId}
          currentPortTheme={themeName}
          currentFont={fontName}
          onOpenChange={setIsChatOpen}
          setCustomCSS={(css) => dispatch(setCustomCSSState(css))}
          customCSSState={customCSSState}
        />
      )}
    </div>
  );
};

export default Page;