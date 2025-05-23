"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createPortfolio, fetchThemesApi } from "../actions/portfolio";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import ThemeCard from "@/components/ThemeCard";
import { ColorTheme } from "@/lib/colorThemes";
import { fadeIn, staggerContainer } from "@/lib/animations";
import CreateMethodModal from "@/components/CreateMethodModal";
import LoadingSpinner, { LoadingMessage } from "@/components/LoadingSpinner";
import MainNavbar from "@/components/MainNavbar";
import BgShapes from "@/components/BgShapes";
import { Palette, Layout, CheckCircle } from "lucide-react";

const PortfolioThemePage = () => {
  const { user, isLoaded } = useUser();
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationMethod, setCreationMethod] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  const [selectedThemeName, setSelectedThemeName] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const [themes, setThemes] = useState<any>([]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, isLoaded, router]);

  useEffect(() => {
    fetchThemes();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchThemes = async () => {
    setIsLoadingThemes(true);
    try {
      const response = await fetchThemesApi();
      console.log(response.data);
      if (response.success) {
        setThemes(response.data);
      }
    } catch (error) {
      console.error("Error fetching themes:", error);
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const handleSelectTheme = (id: number, name: string) => {
    setSelectedThemeName(name);
    setSelectedTheme(id);
    setIsModalOpen(true);
  };

  const handleCreatePortfolio = async (customBodyResume: any) => {
    if (selectedTheme && user && creationMethod) {
      setIsCreating(true);
      try {
        const themeName = themes.find(
          (theme: any) => theme.id === selectedTheme
        )?.name;
        if (!themeName) {
          toast.error("Invalid template");
          return;
        }
        const result = await createPortfolio(
          user.id,
          themeName,
          creationMethod,
          customBodyResume
        );
        if (result.success) {
          if (creationMethod === "import") {
            router.push(`/portfolio/${result?.data?.id}`);
          } else {
            router.push(`/portfolio/${result?.data?.id}`);
          }
        } else {
          toast.error("Failed to create portfolio");
          console.error("Failed to create portfolio:", result.error);
        }
      } catch (error) {
        console.error("Error creating portfolio:", error);
        toast.error("An error occurred");
      } finally {
        setIsCreating(false);
        setIsModalOpen(false);
      }
    }
  };

  interface Style {
    [key: string]: string;
  }

  if (isLoadingThemes) {
    const chooseTemplatesMessages: LoadingMessage[] = [
      { text: "Loading themes", icon: Palette },
      { text: "Fetching templates", icon: Layout },
      { text: "Preparing your experience", icon: CheckCircle },
    ];
    return <LoadingSpinner loadingMessages={chooseTemplatesMessages} />;
  }

  return (
    <div className="min-h-screen main-bg-noise  relative">
      <MainNavbar />

      <BgShapes />
      <div
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 50%)`,
        }}
      >
        <div className="container mx-auto max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl pt-16 sm:pt-20 md:pt-24 px-2 sm:px-4 pb-16 sm:pb-20 md:pb-24">
          {/* Hero section */}
          <motion.div
            className="pt-10 sm:pt-14 md:pt-16 text-center mb-10 sm:mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 md:mb-6"
              variants={fadeIn}
            >
              Select Your{" "}
              <span
                style={{
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Portfolio
              </span>{" "}
              Theme
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl max-w-xs sm:max-w-xl md:max-w-2xl mx-auto"
              style={{ color: ColorTheme.textSecondary }}
              variants={fadeIn}
            >
              Choose a theme that reflects your unique style and professional
              identity. Each template is fully customizable to suit your needs.
            </motion.p>
          </motion.div>

          {/* Themes grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14"
            initial="hidden"
            animate={themes.length > 0 ? "visible" : "hidden"}
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {themes?.map((theme: any, index: number) => (
              <motion.div
                key={theme.id}
                className="max-w-full sm:max-w-md md:max-w-lg mx-auto"
                variants={fadeIn}
                custom={index}
              >
                <ThemeCard
                  theme={theme}
                  handleSelectTheme={() =>
                    handleSelectTheme(theme.id, theme.name)
                  }
                  selectedTheme={selectedTheme}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Floating decoration */}
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              border: `1px solid ${ColorTheme.primary}`,
              color: ColorTheme.primary,
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <span>Fully Customizable ✨</span>
          </motion.div>
        </div>
      </div>

      <CreateMethodModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedTheme={selectedThemeName}
        isCreating={isCreating}
        setCreationMethod={setCreationMethod}
        handleCreatePortfolio={handleCreatePortfolio}
        creationMethod={creationMethod}
      />
    </div>
  );
};

export default PortfolioThemePage;
