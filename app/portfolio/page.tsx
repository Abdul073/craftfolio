"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleEditMode } from "@/slices/editModeSlice";
import { Toggle } from "@/components/ui/toggle";
import { Eye, PencilLine } from "lucide-react";
import Sidebar from "./Sidebar";

const Page = () => {
  const isEditMode = useSelector((state: RootState) => state.editMode.isEditMode);
  const dispatch = useDispatch();

  const toggleMode = () => {
    dispatch(toggleEditMode());
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 bg-card border border-border shadow-lg rounded-lg p-6 flex flex-col items-center">
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
      </div> */}
  
      <div className="custom-bg">
        <Navbar />
        <Sidebar />
        <Hero />
        <Projects />
      </div>
    </div>
  );
};

export default Page;
