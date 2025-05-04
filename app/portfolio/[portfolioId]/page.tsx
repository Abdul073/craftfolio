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

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { portfolioData,themeName: currentTheme } = useSelector((state: RootState) => state.data);
  const allSections = portfolioData?.map((item: any) => item.type);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(portfolioData,allSections)

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
        const themeResult: any = await getThemeNameApi({ portfolioId });
        if (themeResult.success) {
          dispatch(setThemeName(themeResult.data.templateName));
        }
        
        const contentResult: any = await fetchContent({ portfolioId });
        if (contentResult.success) {
          console.log(contentResult.data.sections)
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

  const Template = currentTheme ? templatesConfig[currentTheme] : null;
  if (!Template || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading portfolio...</p>
      </div>
    );
  }

  const NavbarComponent = Template.navbar;
  const SpotlightComponent = Template.spotlight;

  console.log(allSections)

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

      <div className="custom-bg min-h-screen">
        {NavbarComponent && <NavbarComponent />}
       <Sidebar />
        
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