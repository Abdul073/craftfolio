"use client";
import Navbar from "./components/Navbar";
import TechnicalProwess from "./components/TechnicalProwess";
import Hero from "./components/Hero";
import Projects from "./components/Projects";

const page = () => {
  return (
    <div className="min-h-scree flex flex-col">
      <div className="custom-bg">
        <Navbar />
        <Hero />
        <TechnicalProwess />
        <Projects />
      </div>

    </div>
  );
};

export default page;
