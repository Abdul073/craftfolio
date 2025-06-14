import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { supabase } from "@/lib/supabase-client";
import EditButton from '@/components/EditButton';
import { Code2 } from "lucide-react";
import { getThemeClasses, useLumenFlowTheme } from "./ThemeContext";
import { HeaderComponent } from "./Components";

interface TechnologiesProps {
  currentTheme: string;
}

interface Technology {
  name: string;
  category: string;
  description: string;
  logo?: string;
}

const Technologies: React.FC<TechnologiesProps> = ({ currentTheme }) => {
  const [technologiesData, setTechnologiesData] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const { theme } = useLumenFlowTheme();
  const themeClasses = getThemeClasses(currentTheme);

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const techSection = portfolioData?.find(
    (item: any) => item.type === "technologies"
  );
  const sectionTitle = techSection?.sectionTitle || "Technologies";
  const sectionDescription =
    techSection?.sectionDescription ||
    "A comprehensive collection of technologies, frameworks, and tools I've mastered throughout my development journey, enabling me to build robust and scalable applications.";

  useEffect(() => {
    if (portfolioData) {
      const techData = portfolioData.find(
        (section: any) => section.type === "technologies"
      )?.data;
      if (techData) {
        setTechnologiesData(techData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-tech-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          // console.log("technologies update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status technologies: ${status}`);
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
    <div className="space-y-4 md:space-y-12 max-h-screen overflow-y-auto scrollbar-none max-w-7xl mx-auto md:px-4">
      {/* Header Section */}
      <HeaderComponent
        currentTheme={currentTheme}
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        sectionName="technologies"
      />

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {technologiesData.map((tech: Technology, index: number) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredTech(index)}
            onMouseLeave={() => setHoveredTech(null)}
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-lg"
              style={{ 
                background: theme === "light" 
                  ? "linear-gradient(to right, rgba(249,115,22,0.1), rgba(234,88,12,0.1))"
                  : themeClasses.gradientPrimary 
              }}
            ></div>

            <div className={`relative bg-transparent rounded-2xl overflow-hidden border ${
              theme === "light"
                ? "border-gray-200/50 group-hover:border-orange-400/50"
                : "border-gray-700/50 group-hover:border-orange-400/50"
            } transition-all duration-300 transform group-hover:translate-y-[-2px] group-hover:scale-105`}>
              <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center text-center space-y-2 sm:space-y-3 md:space-y-4 md:h-48">
                <div className="flex-shrink-0">
                  {tech.logo ? (
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden ${
                      theme === "light"
                        ? "bg-gray-100/50 group-hover:bg-orange-50/50"
                        : "bg-gray-700/30 group-hover:bg-gray-600/30"
                    } flex items-center justify-center transition-colors duration-300`}>
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove("hidden");
                          }
                        }}
                      />
                      <div className="hidden w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 items-center justify-center">
                        <Code2 size={24} className={`${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        } sm:text-2xl md:text-3xl`} />
                      </div>
                    </div>
                  ) : (
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl ${
                      theme === "light"
                        ? "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-orange-50 group-hover:to-orange-100"
                        : "bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-gray-600 group-hover:to-gray-700"
                    } flex items-center justify-center border ${
                      theme === "light"
                        ? "border-gray-200/30"
                        : "border-gray-600/30"
                    } transition-colors duration-300`}>
                      <Code2 size={24} className={`${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      } sm:text-2xl md:text-3xl`} />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <h3
                    className={`text-sm sm:text-base md:text-lg font-bold transition-colors duration-300 ${
                      theme === "light" ? "text-gray-900" : themeClasses.textPrimary
                    }`}
                  >
                    {tech.name}
                  </h3>
                  <div
                    className={`text-xs sm:text-sm font-medium opacity-70 ${
                      theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                    }`}
                  >
                    {tech.category}
                  </div>
                </div>

                <div
                  className={`absolute inset-0 ${
                    theme === "light"
                      ? "bg-white/95"
                      : "bg-gray-900/95"
                  } backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col justify-center text-center transition-all duration-300 ${
                    hoveredTech === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-2 sm:space-y-3">
                    <h4
                      className={`text-sm sm:text-base md:text-lg font-bold ${
                        theme === "light" ? "text-gray-900" : themeClasses.textPrimary
                      }`}
                    >
                      {tech.name}
                    </h4>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        theme === "light" ? "text-gray-600" : themeClasses.textSecondary
                      }`}
                    >
                      {tech.description}
                    </p>
                    <div
                      className={`inline-flex items-center space-x-2 text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                        theme === "light"
                          ? "bg-orange-500 text-white"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      }`}
                    >
                      <span>{tech.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: theme === "light"
                    ? "linear-gradient(to right, rgba(249,115,22,0.5), rgba(234,88,12,0.5))"
                    : themeClasses.gradientPrimary 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {technologiesData.length === 0 && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              style={{ background: themeClasses.bgSecondary }}
            >
              <Code2 size={32} style={{ color: themeClasses.textSecondary }} />
            </div>
            <h3
              className="text-xl font-semibold"
              style={{ color: themeClasses.textSecondary }}
            >
              No technologies yet
            </h3>
            <p
              className="max-w-md mx-auto"
              style={{ color: themeClasses.textSecondary }}
            >
              Start adding your technical skills and technologies to showcase
              your expertise and capabilities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Technologies;
