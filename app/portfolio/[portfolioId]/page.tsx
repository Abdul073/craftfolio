"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Sidebar from "../Sidebar";
import { useEffect } from "react";
import { fetchContent } from "@/app/actions/portfolio";
import { useParams } from "next/navigation";
import { setPortfolioData } from "@/slices/dataSlice";
import { Spotlight } from "../components/Spotlight";
import ProfessionalJourney from "../components/ProfessionalJourney";
import Technologies from "../components/Technologies";
import Contact from "../components/Contact";

const Page = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const allSections = portfolioData?.map((item : any) => item.type);

  console.log({ portfolioData, allSections });

  useEffect(() => {
    getContent();
  }, []);

  const getContent = async () => {
    try {
      const result: any = await fetchContent({ portfolioId });
      if (result.success) {
        dispatch(setPortfolioData(result.data.sections));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderSection = (sectionType : any) => {
    switch (sectionType) {
      case "userInfo":
        return null;
      case "hero":
        return <Hero key="hero" />;
      case "projects":
        return <Projects key="projects" />;
      case "experience":
        return <ProfessionalJourney key="experience" />;
      case "technologies":
        return <Technologies key="technologies" />;
      case "contact":
        return <Contact key="contact" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0">
        <Spotlight className="-top-40 left-0 md:-top-80 md:left-5" fill="white" />
      </div>

      <div className="custom-bg">
        <Navbar />
        <Sidebar />
        
        {allSections && allSections.map((section : any) => renderSection(section))}
        
        {(!allSections || allSections.length === 0) && (
          <>
            <Hero />
            <Projects />
            <Technologies />
            <ProfessionalJourney />
            <Contact />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;