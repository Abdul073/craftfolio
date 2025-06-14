import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import EditButton from '@/components/EditButton';
import SectionHeader from "./SectionHeader";

const Technologies = ({ currentPortTheme, customCSS }: any) => {
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

  const techSection = portfolioData?.find((item: any) => item.type === "technologies");
  const sectionTitle = techSection?.sectionTitle || "My Tech Stack";
  const sectionDescription = techSection?.sectionDescription || "Technologies I Worked On.";

  interface Technology {
    name: string;
    logo: string;
  }

  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<Technology[]>([]);

  const dispatch = useDispatch();

  const params = useParams();
  const portfolioId = params.portfolioId as string;
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
          // console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        // console.log(`Supabase subscription status: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, technologiesData]);

  const handleSectionEdit = () => {
    dispatch(setCurrentEdit("technologies"));
  };

  if (isLoading || !technologiesData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
  <div id="tech-stack" className={`py-8 custom-bg sm:py-12 md:py-16 text-white`}>
      <style>{customCSS}</style>
      <SectionHeader sectionName="technologies" sectionTitle={sectionTitle} sectionDescription={sectionDescription} titleColor={titleColor} />


      <div
        className="relative overflow-hidden px-2 sm:px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex flex-nowrap overflow-hidden max-w-full sm:max-w-[80%] mx-auto">
          <Marquee
            pauseOnHover={isPaused}
            loop={0}
            speed={100}
            direction="left"
          >
            {technologiesData.map((tech, index) => (
              <div key={`tech-${index}`} className="flex-none mx-2 sm:mx-4 w-24 sm:w-32 md:w-40">
                <div
                  className="bg-stone-800/80 peer cursor-pointer hover:bg-gradient-to-br from-stone-900 to-stone-900 rounded-xl py-4 sm:py-6 px-4 sm:px-8 border border-transparent hover:border-current flex flex-col items-center justify-center transition-all duration-300 ease-in shadow-lg hover:shadow-xl"
                  style={{
                    boxShadow: `0 10px 15px -3px ${titleColor}10, 0 4px 6px -4px ${titleColor}10`,
                    borderColor: `${titleColor}30`,
                  }}
                >
                  <img
                    src={
                      tech.logo ||
                      `https://placehold.co/100x100?text=${tech.name}&font=montserrat&fontsize=18`
                    }
                    alt={tech.name}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>
                <p
                  className="font-medium text-center mt-2 text-xs sm:text-base text-white peer-hover:font-semibold"
                  style={{ color: titleColor }}
                >
                  {tech.name}
                </p>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Technologies;
