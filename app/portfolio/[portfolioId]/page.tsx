"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { fetchContent, getThemeNameApi } from "@/app/actions/portfolio";
import { useParams } from "next/navigation";
import { setPortfolioData } from "@/slices/dataSlice";
import { Spotlight } from "../components/Spotlight";
import { templatesConfig } from "@/lib/templateConfig";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const allSections = portfolioData?.map((item: any) => item.type);
  
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Only access Template after currentTheme is set
  const Template = currentTheme ? templatesConfig[currentTheme] : null;

  const getComponentForSection = (sectionType: string) => {
    if (!Template || !Template.sections || !Template.sections[sectionType]) {
      return null;
    }
    const SectionComponent = Template.sections[sectionType];
    return SectionComponent ? <SectionComponent key={`${sectionType}`} /> : null;
  };

  useEffect(() => {
    const initializePortfolio = async () => {
      setIsLoading(true);
      
      try {
        // First get theme name so we know which template to use
        const themeResult: any = await getThemeNameApi({ portfolioId });
        if (themeResult.success) {
          setCurrentTheme(themeResult.data.templateName);
        }
        
        // Then fetch content data
        const contentResult: any = await fetchContent({ portfolioId });
        if (contentResult.success) {
          dispatch(setPortfolioData(contentResult.data.sections));
        }
      } catch (error) {
        console.log("Error initializing portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializePortfolio();
  }, [portfolioId, dispatch]);

  console.log(Template,currentTheme)

  // Don't try to render anything template-specific until we have the theme
  if (!Template || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading portfolio...</p>
      </div>
    );
  }

  const NavbarComponent = Template.navbar;
  const SidebarComponent = Template.sidebar;
  const SpotlightComponent = Template.spotlight;

  return (
    <div className="min-h-screen flex flex-col">
      {SpotlightComponent && (
        <div className="absolute inset-0">
          <Spotlight
            className="-top-40 left-0 md:-top-80 md:left-5"
            fill="white"
          />
        </div>
      )}

      <div className="custom-bg">
        {NavbarComponent && <NavbarComponent />}
        {SidebarComponent && <SidebarComponent />}
        
        {allSections && allSections.length > 0 ? (
          allSections.map((section: any) => getComponentForSection(section))
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p className="text-xl">Portfolio content not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;