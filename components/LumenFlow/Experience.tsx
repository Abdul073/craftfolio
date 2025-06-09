import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton from '@/components/EditButton';
import {
  Briefcase,
  MapPin,
  Calendar,
  Code2,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { getThemeClasses } from "./ThemeContext";
import { HeaderComponent } from "./Components";

interface Technology {
  name: string;
  logo: string;
}

interface Experience {
  role: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack: Technology[];
}

const Experience = ({ currentTheme }: any) => {
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(
    null
  );
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const experienceSection = portfolioData?.find(
    (item: any) => item.type === "experience"
  );
  const sectionTitle = experienceSection?.sectionTitle || "Experience";
  const sectionDescription =
    experienceSection?.sectionDescription ||
    "My professional journey through various roles and technologies, showcasing growth, expertise, and the impact I've made in different organizations and projects.";
    const themeClasses = getThemeClasses(currentTheme);

  useEffect(() => {
    if (portfolioData) {
      const expData = portfolioData.find(
        (section: any) => section.type === "experience"
      )?.data;
      if (expData) {
        setExperienceData(expData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-exp-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          console.log("experience update detected!", payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status experience: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId]);

  if (isLoading) {
    return (
      <div className="space-y-8 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-300 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="projects"
      />

      {/* Experience Timeline */}
      <div className="space-y-8">
        {experienceData.map((exp, index) => (
          <div
            key={index}
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredExperience(index)}
            onMouseLeave={() => setHoveredExperience(null)}
          >
            {/* Background Glow Effect */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: themeClasses.gradientHover }}></div>

            {/* Main Card */}
            <div className="relative bg-transparent rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-orange-400/30 transition-all duration-500 transform group-hover:translate-y-[-4px] h-full flex flex-col">
              {/* Experience Content */}
              <div className="p-6 space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: themeClasses.gradientPrimary }}></div>
                    <h3 className="text-xl font-bold transition-colors duration-300" style={{ color: themeClasses.textPrimary }}>
                      {exp.role}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed" style={{ color: themeClasses.textSecondary }}>
                    {exp.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star size={14} className="text-orange-400" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Tech Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.techStack.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 rounded-full text-xs font-medium border hover:border-orange-400/50 transition-all duration-300"
                        style={{ color: themeClasses.textSecondary }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} className="text-orange-400" />
                      <span className="text-sm" style={{ color: themeClasses.textSecondary }}>
                        {exp.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-orange-400" />
                      <span className="text-sm" style={{ color: themeClasses.textSecondary }}>
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                  </div>

                  {/* View More Arrow */}
                  <div
                    className={`transition-all duration-300 ${
                      hoveredExperience === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <ArrowUpRight size={18} className="text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Side Accent Line */}
              <div className="absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: themeClasses.gradientPrimary }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {experienceData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400">
              No experience yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start adding your professional experience to showcase your career
              journey and expertise.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
