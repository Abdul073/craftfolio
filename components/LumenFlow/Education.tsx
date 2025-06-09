import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton from '@/components/EditButton';
import {
  GraduationCap,
  MapPin,
  Calendar,
  BookOpen,
  Star,
  ArrowUpRight,
  School,
} from "lucide-react";
import { getThemeClasses } from "./ThemeContext";
import { HeaderComponent } from "./Components";

interface Technology {
  name: string;
  logo: string;
}

interface Education {
  courseName: string;
  endDate: string;
  location: string;
  startDate: string;
  description: string;
  instituteName: string;
}

interface EducationProps {
  currentTheme: string;
}

const Education: React.FC<EducationProps> = ({ currentTheme }) => {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredEducation, setHoveredEducation] = useState<number | null>(null);
  const params = useParams();
  const portfolioId = params.portfolioId as string;

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const educationSection = portfolioData?.find(
    (item: any) => item.type === "education"
  );
  const sectionTitle = educationSection?.sectionTitle || "Education";
  const sectionDescription =
    educationSection?.sectionDescription ||
    "My educational journey through various institutions and courses, building the foundation of knowledge and skills that drive my professional growth and expertise.";
  const themeClasses = getThemeClasses(currentTheme);

  useEffect(() => {
    if (portfolioData) {
      const eduData = portfolioData.find(
        (section: any) => section.type === "education"
      )?.data;
      if (eduData) {
        setEducationData(eduData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-edu-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          console.log("education update detected!", payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status education: ${status}`);
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
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-300 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="projects"
      />

      {/* Education Timeline */}
      <div className="space-y-8">
        {educationData.map((edu, index) => (
          <div
            key={index}
            className="group relative overflow-hidden"
            onMouseEnter={() => setHoveredEducation(index)}
            onMouseLeave={() => setHoveredEducation(null)}
          >
            {/* Background Glow Effect */}
            <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: themeClasses.gradientHover }}></div>

            {/* Main Card */}
            <div className="relative bg-transparent rounded-2xl overflow-hidden border border-gray-700/50 group-hover:border-orange-400/30 transition-all duration-500 transform group-hover:translate-y-[-4px] h-full flex flex-col">
              {/* Education Content */}
              <div className="p-6 space-y-4 flex-grow">
                {/* Header Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: themeClasses.gradientPrimary }}></div>
                    <h3 className="text-xl font-bold transition-colors duration-300" style={{ color: themeClasses.textPrimary }}>
                      {edu.courseName}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed" style={{ color: themeClasses.textSecondary }}>
                    {edu.description}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} className="text-orange-400" />
                      <span className="text-sm" style={{ color: themeClasses.textSecondary }}>
                        {edu.instituteName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-orange-400" />
                      <span className="text-sm" style={{ color: themeClasses.textSecondary }}>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>

                  {/* View More Arrow */}
                  <div
                    className={`transition-all duration-300 ${
                      hoveredEducation === index
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
      {educationData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ background: themeClasses.bgSecondary }}>
              <GraduationCap size={32} style={{ color: themeClasses.textSecondary }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: themeClasses.textSecondary }}>
              No education yet
            </h3>
            <p className="max-w-md mx-auto" style={{ color: themeClasses.textSecondary }}>
              Start adding your educational background to showcase your academic
              journey and qualifications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
