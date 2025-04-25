"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleEditMode } from "@/slices/editModeSlice";
import { Toggle } from "@/components/ui/toggle";
import { Eye, PencilLine } from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import TechnicalProwess from "../components/TechnicalProwess";
import Sidebar from "../Sidebar";
import { useEffect } from "react";
import { fetchContent } from "@/app/actions/portfolio";
import { useParams } from "next/navigation";
import { setPortfolioData } from "@/slices/dataSlice";
import { Spotlight } from "../components/Spotlight";

const Page = () => {
  const isEditMode = useSelector((state: RootState) => state.editMode.isEditMode);
  const dispatch = useDispatch();

    const params = useParams();
    const portfolioId = params.portfolioId as string;
    const {portfolioData} = useSelector((state: RootState) => state.data);

  const toggleMode = () => {
    dispatch(toggleEditMode());
  };

  useEffect(()=>{
    getContent()
  },[])

  
  const getContent = async()=>{
    try {
      const result : any = await fetchContent({portfolioId});
      if(result.success){
        dispatch(setPortfolioData(result.data.sections));
      }
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 bg-card border border-border shadow-lg rounded-lg p-6 flex flex-col items-center">
        <span className="text-base font-semibold mb-4 text-foreground">View Mode</span>
        
        <div className="flex flex-col gap-3">
          <Toggle
            pressed={isEditMode}
            onPressedChange={toggleMode} 
            aria-label="Switch to edit mode"
            className="flex items-center gap-2 cursor-pointer p-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <PencilLine size={16} />
            <span className="font-medium">Edit</span>
          </Toggle>
          
          <Toggle
            pressed={!isEditMode}
            onPressedChange={toggleMode} 
            aria-label="Switch to preview mode"
            className="flex items-center gap-2 cursor-pointer p-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Eye size={16} />
            <span className="font-medium">Preview</span>
          </Toggle>
        </div>
      </div>

<div className="absolute inset-0">
          <Spotlight
            className="-top-40 left-0 md:-top-80 md:left-5"
            fill="white"
          />
        </div>

      <div className="custom-bg">
        <Navbar />
        <Sidebar />
        <Hero />
        <TechnicalProwess />
        <Projects />
      </div>
    </div>
  );
};

export default Page;
