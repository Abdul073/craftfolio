"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Head from "next/head";
import {
  fadeIn,
  fadeInScale,
  pulseAnimation,
  revealUpload,
  staggerContainer,
} from "@/lib/animations";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import MainNavbar from "@/components/MainNavbar";
// import ArrowLottie from "@/components/ArrowLottie";
import { ColorTheme } from "@/lib/colorThemes";
import BgShapes from "@/components/BgShapes";
import { testimonials, features, benefitsList } from "@/lib/data";
import ArrowLottie from "@/components/ArrowLottie";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const router = useRouter();

  const handleResumeUpload = () => {
    setResumeUploaded(true);
    setTimeout(() => {
      setShowPreview(true);
    }, 2000);
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a minimal loading spinner
  }

  return (
    <div className="relative min-h-screen scrollbar main-bg-noise  custom-scrollbar">
      <BgShapes />

      <Head>
        <title>
          CraftFolio | Create Professional Portfolio Websites Instantly from
          Your Resume
        </title>
        <meta
          name="description"
          content="Build stunning portfolio websites without code. Import your resume and get an instant portfolio or create from scratch with CraftFolio's easy-to-use builder."
        />
        <style jsx global>{`
          body {
            background-color: ${ColorTheme.bgMain};
            color: ${ColorTheme.textPrimary};
          }
        `}</style>
      </Head>

      <MainNavbar />
 <main>
        <section className="pt-40 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full -z-10"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, ${ColorTheme.primaryGlow}, transparent 70%)`,
            }}
            animate={{
              opacity: [1, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="max-w-4xl text-center mx-auto">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                  variants={fadeIn}
                >
                  From{" "}
                  <span
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Resume
                  </span>{" "}
                  to Stunning Portfolio in Seconds
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
                  style={{ color: ColorTheme.textSecondary }}
                  variants={fadeIn}
                >
                  Just upload your resume and get an instant professional
                  portfolio website. Customize it or build from scratch - no
                  coding required.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
                  variants={fadeIn}
                >
                  <motion.p
                    onClick={() => router.push("/choose-templates")}
                    className="px-8 py-4 rounded-lg flex items-center justify-center cursor-pointer group font-medium transition-all"
                    style={{
                      color: ColorTheme.textPrimary,
                      background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                    }}
                    whileHover={{
                      boxShadow: `0 8px 20px ${ColorTheme.primaryGlow}`,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Build My Portfolio{" "}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:ml-5    transition-all duration-300 ease" />
                  </motion.p>
                  <motion.a
                    href="#resume-import"
                    className="px-8 py-4 rounded-lg font-medium border transition-all"
                    style={{
                      color: ColorTheme.textPrimary,
                      backgroundColor: "rgba(28, 28, 30, 0.6)",
                      borderColor: ColorTheme.borderLight,
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(38, 38, 42, 0.8)",
                      borderColor: ColorTheme.primary,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.a>
                </motion.div>
              </div>

              <motion.div
                className="relative w-full max-w-7xl mx-auto rounded-xl overflow-hidden mt-32"
                style={{
                  boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 10px 25px rgba(22, 189, 156, 0.4)`,
                }}
                variants={fadeInScale}
              >
                <div
                  className="p-2"
                  style={{ backgroundColor: "rgba(28, 28, 30, 0.9)" }}
                >
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-12 ">
                    <motion.h3
                      className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      Transform Your Resume
                    </motion.h3>
                    <motion.p
                      className="mt-4 text-lg text-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      Watch your resume transform into a stunning portfolio in
                      seconds
                    </motion.p>
                  </div>

                  <div
                    ref={ref}
                    className="flex flex-col md:flex-row items-center justify-between gap-8"
                  >
                    <motion.div
                      className="w-full md:w-2/5 rounded-lg shadow-2xl transform transition-all duration-500"
                      transition={{ duration: 0.8 }}
                      style={{
                        boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 10px 20px ${ColorTheme.primaryGlow}`,
                      }}
                    >
                      <div className="relative">
                        <img
                          src="/johndoe_resume.png"
                          alt="Resume Document"
                          className="w-full h-auto border rounded-xl border-gray-300"
                        />
                      </div>
                    </motion.div>

                    {/* {isInView ? <div className="flex flex-col items-center justify-center py-4">
                        <span className="lg:rotate-[-180deg] rotate-[55deg] lg:scale-x-[-1] w-32 overflow-hidden block arrow-animation ">
                          <ArrowLottie />
                        </span>
                    </div> : <div className="flex flex-col items-center justify-center py-4">
                        <span className="lg:rotate-[-180deg] rotate-[55deg] lg:scale-x-[-1] w-32 overflow-hidden block arrow-animation ">
                        </span>
                    </div> } */}

                    <motion.div
                      className="w-full md:w-5/5 rounded-lg shadow-2xl transform transition-all duration-500"
                      transition={{ duration: 0.8 }}
                      style={{
                        boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 10px 20px ${ColorTheme.primaryGlow}`,
                      }}
                    >
                      <div className="relative">
                        <img
                          src="/johndoe_portfolio2.png"
                          alt="Generated Portfolio Website"
                          className="w-full h-auto border rounded-xl"
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {[
                      {
                        icon: "⚡",
                        title: "Lightning Fast",
                        description: "Transform your resume in seconds",
                      },
                      {
                        icon: "🎨",
                        title: "Beautiful Design",
                        description: "Professional templates that stand out",
                      },
                      {
                        icon: "🔄",
                        title: "Easy Customization",
                        description: "Modify any element to match your style",
                      },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg text-center"
                        style={{ backgroundColor: "rgba(28, 28, 30, 0.7)" }}
                        whileHover={{
                          y: -5,
                          backgroundColor: "rgba(38, 38, 42, 0.8)",
                        }}
                      >
                        <div className="text-3xl mb-2">{feature.icon}</div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-400">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Subtle wave decoration */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="w-full h-auto opacity-10"
            >
              <path
                fill={ColorTheme.primary}
                fillOpacity="1"
                d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,176C672,181,768,139,864,122.7C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Resume Import Feature */}
        <section
          id="resume-import"
          className="py-20 md:py-28 relative overflow-hidden"
        >
          {/* Background decoration */}
          <motion.div
            className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full opacity-10 -z-10"
            style={{
              background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  color: ColorTheme.primary,
                  backgroundColor: ColorTheme.primaryGlow,
                }}
                whileHover={{ scale: 1.05 }}
              >
                Revolutionary Feature
              </motion.span>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The{" "}
                <span
                  style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Magic
                </span>{" "}
                of Resume Import
              </h2>
              <p
                className="text-xl max-w-3xl mx-auto"
                style={{ color: ColorTheme.textSecondary }}
              >
                Transform your existing resume into a stunning portfolio website
                with just one click
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Import Demo */}
              <motion.div
                className="rounded-xl overflow-hidden p-8"
                style={{
                  backgroundColor: ColorTheme.bgCard,
                  borderColor: ColorTheme.borderLight,
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 6px 12px ${ColorTheme.primaryGlow}`,
                }}
                variants={revealUpload}
                whileHover={{
                  boxShadow: `0 15px 40px rgba(0,0,0,0.4), 0 8px 20px ${ColorTheme.primaryGlow}`,
                  y: -5,
                }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Try It Now</h3>
                  <p
                    style={{ color: ColorTheme.textSecondary }}
                    className="mb-6"
                  >
                    Upload your resume and see the magic happen in seconds
                  </p>

                  <div className="relative">
                    {!resumeUploaded ? (
                      <motion.div
                        className="border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer"
                        style={{ borderColor: ColorTheme.borderLight }}
                        whileHover={{
                          borderColor: ColorTheme.primary,
                          backgroundColor: "rgba(16, 185, 129, 0.05)",
                        }}
                        animate={pulseAnimation}
                      >
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleResumeUpload}
                        />
                        <svg
                          className="w-12 h-12 mx-auto mb-4"
                          style={{ color: ColorTheme.textMuted }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p style={{ color: ColorTheme.textSecondary }}>
                          Drag & drop your resume here or click to browse
                        </p>
                        <p
                          style={{ color: ColorTheme.textMuted }}
                          className="text-sm mt-2"
                        >
                          Supports PDF, DOCX, and TXT
                        </p>
                      </motion.div>
                    ) : (
                      <div
                        className="rounded-lg p-6"
                        style={{ backgroundColor: "rgba(28, 28, 30, 0.9)" }}
                      >
                        {!showPreview ? (
                          <div className="text-center">
                            <div
                              className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
                              style={{
                                borderColor: ColorTheme.primary,
                                borderTopColor: "transparent",
                              }}
                            ></div>
                            <p style={{ color: ColorTheme.textSecondary }}>
                              Analyzing your resume...
                            </p>
                            <p
                              style={{ color: ColorTheme.textMuted }}
                              className="text-sm mt-2"
                            >
                              This will just take a moment
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <motion.div
                              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                              style={{
                                backgroundColor: `${ColorTheme.primary}20`,
                              }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.6 }}
                            >
                              <svg
                                className="w-8 h-8"
                                style={{ color: ColorTheme.primary }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </motion.div>
                            <p
                              style={{ color: ColorTheme.textSecondary }}
                              className="mb-4"
                            >
                              Your portfolio is ready!
                            </p>
                            <motion.div
                              className="rounded-lg overflow-hidden mb-4"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <img
                                src="/api/placeholder/400/300"
                                alt="Portfolio Preview"
                                className="w-full h-auto"
                              />
                            </motion.div>
                            <motion.div
                              className="flex justify-center gap-4"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <motion.button
                                className="px-4 py-2 rounded-lg"
                                style={{
                                  backgroundColor: ColorTheme.primary,
                                  color: ColorTheme.textPrimary,
                                  boxShadow: `0 4px 10px ${ColorTheme.primaryGlow}`,
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  boxShadow: `0 6px 14px ${ColorTheme.primaryGlow}`,
                                }}
                              >
                                View Portfolio
                              </motion.button>
                              <motion.button
                                className="px-4 py-2 rounded-lg"
                                style={{
                                  backgroundColor: "rgba(38, 38, 42, 0.9)",
                                  color: ColorTheme.textPrimary,
                                }}
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: "rgba(48, 48, 52, 0.9)",
                                }}
                              >
                                Customize
                              </motion.button>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={staggerContainer}>
                <h3 className="text-2xl font-semibold mb-6">
                  Why Use Resume Import?
                </h3>

                <motion.div className="space-y-6" variants={staggerContainer}>
                  {benefitsList.map(
                    (benefit: {
                      id: number;
                      icon: React.ReactNode;
                      title: string;
                      description: string;
                    }) => (
                      <motion.div
                        key={benefit.id}
                        className="flex gap-4"
                        variants={fadeIn}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex-shrink-0">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${ColorTheme.primary}30`,
                            }}
                          >
                            <span style={{ color: ColorTheme.primary }}>
                              {benefit.icon}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            {benefit.title}
                          </h4>
                          <p style={{ color: ColorTheme.textSecondary }}>
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </motion.div>

                {/* Call to action */}
                <motion.div
                  className="mt-8 pt-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                    style={{
                      background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      color: ColorTheme.textPrimary,
                      boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                    }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                    }}
                  >
                    Try Resume Import
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 relative">
          {/* Background pattern */}
          <div
            className="absolute inset-0 -z-10 opacity-10"
            style={{
              backgroundImage: `radial-gradient(${ColorTheme.primary} 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>

          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  color: ColorTheme.primary,
                  backgroundColor: ColorTheme.primaryGlow,
                }}
                whileHover={{ scale: 1.05 }}
              >
                Powerful Toolkit
              </motion.span>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need To{" "}
                <span
                  style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Stand Out
                </span>
              </h2>
              <p
                className="text-xl max-w-3xl mx-auto"
                style={{ color: ColorTheme.textSecondary }}
              >
                Powerful tools designed to showcase your work in the best
                possible light
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  className="p-8 rounded-xl backdrop-blur-sm border"
                  style={{
                    backgroundColor: ColorTheme.bgCard,
                    borderColor: ColorTheme.borderLight,
                  }}
                  variants={fadeInScale}
                  whileHover={{
                    y: -10,
                    borderColor: ColorTheme.primary,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 5px 15px ${ColorTheme.primaryGlow}`,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                      boxShadow: `0 5px 15px ${ColorTheme.primaryGlow}`,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p style={{ color: ColorTheme.textSecondary }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section (New) */}
        <section
          id="testimonials"
          className="py-20 md:py-28 relative overflow-hidden"
        >
          {/* Background decoration */}
          <motion.div
            className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-full -z-10"
            style={{
              background: `linear-gradient(90deg, ${ColorTheme.primaryGlow}, transparent 30%, transparent 70%, ${ColorTheme.primaryGlow})`,
            }}
            animate={{
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <motion.span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  color: ColorTheme.primary,
                  backgroundColor: ColorTheme.primaryGlow,
                }}
                whileHover={{ scale: 1.05 }}
              >
                Success Stories
              </motion.span>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our{" "}
                <span
                  style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Users
                </span>{" "}
                Say
              </h2>
              <p
                className="text-xl max-w-3xl mx-auto"
                style={{ color: ColorTheme.textSecondary }}
              >
                Join thousands of professionals who have already transformed
                their online presence
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {testimonials.map(
                (testimonial: {
                  id: number;
                  name: string;
                  role: string;
                  image: string;
                  content: string;
                  rating: number;
                }) => (
                  <motion.div
                    key={testimonial.id}
                    className="p-8 rounded-xl backdrop-blur-sm border relative"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                    }}
                    variants={fadeInScale}
                    whileHover={{
                      y: -8,
                      borderColor: ColorTheme.primary,
                      boxShadow: `0 10px 30px rgba(0,0,0,0.15), 0 5px 15px ${ColorTheme.primaryGlow}`,
                    }}
                  >
                    {/* Quote mark */}
                    <div
                      className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xl font-serif"
                      style={{
                        backgroundColor: ColorTheme.primary,
                        color: ColorTheme.textPrimary,
                      }}
                    >
                      "
                    </div>

                    <div className="mb-6">
                      {/* Star rating */}
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            style={{
                              color:
                                i < testimonial.rating
                                  ? ColorTheme.primary
                                  : ColorTheme.borderLight,
                            }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p
                        className="italic mb-6"
                        style={{ color: ColorTheme.textSecondary }}
                      >
                        "{testimonial.content}"
                      </p>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2"
                        style={{ borderColor: ColorTheme.primary }}
                      >
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p
                          className="text-sm"
                          style={{ color: ColorTheme.textMuted }}
                        >
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* Call-to-action */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-medium transition-all"
                style={{
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  color: ColorTheme.textPrimary,
                  boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                }}
              >
                Join Them Today
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundColor: "rgba(18, 18, 18, 0.8)",
              backdropFilter: "blur(10px)",
            }}
          ></div>

          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="md:col-span-1">
                <motion.span
                  className="text-2xl font-bold"
                  style={{
                    background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  CraftFolio
                </motion.span>
                <p
                  className="mt-4 mb-6"
                  style={{ color: ColorTheme.textSecondary }}
                >
                  Build stunning portfolio websites without code. Import your
                  resume and get an instant portfolio in seconds.
                </p>
                <div className="flex space-x-4">
                  {["twitter", "facebook", "instagram", "linkedin"].map(
                    (social) => (
                      <motion.a
                        key={social}
                        href="#"
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: ColorTheme.bgCardHover,
                          color: ColorTheme.textSecondary,
                        }}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: ColorTheme.primary,
                          color: ColorTheme.textPrimary,
                        }}
                      >
                        <span className="sr-only">{social}</span>
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </motion.a>
                    )
                  )}
                </div>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-2">
                    {[
                      "Features",
                      "Templates",
                      "Integration",
                      "Pricing",
                      "FAQ",
                    ].map((item) => (
                      <li key={item}>
                        <motion.a
                          href="#"
                          style={{ color: ColorTheme.textSecondary }}
                          whileHover={{ color: ColorTheme.primary }}
                        >
                          {item}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    {["About", "Blog", "Careers", "Press", "Contact"].map(
                      (item) => (
                        <li key={item}>
                          <motion.a
                            href="#"
                            style={{ color: ColorTheme.textSecondary }}
                            whileHover={{ color: ColorTheme.primary }}
                          >
                            {item}
                          </motion.a>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2">
                    {[
                      "Terms",
                      "Privacy",
                      "Cookies",
                      "Licenses",
                      "Settings",
                    ].map((item) => (
                      <li key={item}>
                        <motion.a
                          href="#"
                          style={{ color: ColorTheme.textSecondary }}
                          whileHover={{ color: ColorTheme.primary }}
                        >
                          {item}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="border-t pt-8 mt-12 text-center"
              style={{ borderColor: ColorTheme.borderLight }}
            >
              <p style={{ color: ColorTheme.textMuted }}>
                © {new Date().getFullYear()} CraftFolio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
     
    </div>
  );
}
