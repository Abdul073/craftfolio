"use client";

import React, { useEffect, useState } from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setCurrentEdit } from "@/slices/editModeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import EditButton from "@/components/EditButton";
import SectionHeader from "./SectionHeader";

const Contact = ({ currentPortTheme, customCSS }: any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();

  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item: any) => item.type === "themes");
  const theme = inTheme.data[currentPortTheme];
  const titleColor = theme.colors.primary;

  const contactSection = portfolioData?.find(
    (item: any) => item.type === "userInfo"
  );
  const sectionTitle = contactSection?.sectionTitle || "Let's Work Together!";
  const sectionDescription =
    contactSection?.sectionDescription ||
    "Interested in collaborating, hiring, or just having a chat? Reach out to me on your favorite platform!";
  console.log(contactSection);

  const [isLoading, setIsLoading] = useState(true);
  const [contactData, setContactData] = useState<any>(null);

  useEffect(() => {
    if (portfolioData) {
      const contactSectionData = portfolioData.find(
        (section: any) => section.type === "userInfo"
      )?.data;
      if (contactSectionData) {
        setContactData(contactSectionData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {
    const subscription = supabase
      .channel(`portfolio-contact-${portfolioId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Portfolio",
          filter: `id=eq.${portfolioId}`,
        },
        (payload) => {
          console.log("Portfolio update detected!", payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status: ${status}`);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [portfolioId, contactData, isLoading]);

  if (isLoading || !contactData) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div
      id="contact"
      className="py-8 custom-bg sm:py-12 md:py-16 px-2 sm:px-4 md:px-8 relative text-white"
    >
      <style>{customCSS}</style>

      <SectionHeader
        sectionName="contact"
        sectionTitle={sectionTitle}
        sectionDescription={sectionDescription}
        titleColor={titleColor}
      />
      <div className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[95%] sm:max-w-[90%] md:max-w-[70%] mx-auto gap-4 md:gap-8"
        >
          {contactData.email && (
            <motion.a
              href={`mailto:${contactData.email}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-stone-900/60 cursor-pointer p-6 sm:p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 transition-all duration-300 shadow-lg"
              style={{
                borderColor: `${titleColor}30`,
                boxShadow: `0 10px 15px -3px ${titleColor}10, 0 4px 6px -4px ${titleColor}10`,
              }}
            >
              <Mail
                className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3"
                style={{ color: titleColor }}
              />
              <div className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
                Email
              </div>
              <p className="text-gray-300 text-center break-all text-xs sm:text-base">
                {contactData.email}
              </p>
            </motion.a>
          )}

          {contactData.linkedin && (
            <motion.a
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-stone-900/60 cursor-pointer p-6 sm:p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 transition-all duration-300 shadow-lg"
              style={{
                borderColor: `${titleColor}30`,
                boxShadow: `0 10px 15px -3px ${titleColor}10, 0 4px 6px -4px ${titleColor}10`,
              }}
            >
              <Linkedin
                className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3"
                style={{ color: titleColor }}
              />
              <div className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
                LinkedIn
              </div>
              <p className="text-gray-300 text-center text-xs sm:text-base">
                {contactData.linkedin.includes("/")
                  ? "@" + contactData.linkedin.split("/").filter(Boolean).pop()
                  : contactData.linkedin}
              </p>
            </motion.a>
          )}

          {contactData.github && (
            <motion.a
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-stone-900/60 cursor-pointer p-6 sm:p-8 rounded-lg flex flex-col items-center justify-center border border-gray-700 transition-all duration-300 shadow-lg"
              style={{
                borderColor: `${titleColor}30`,
                boxShadow: `0 10px 15px -3px ${titleColor}10, 0 4px 6px -4px ${titleColor}10`,
              }}
            >
              <Github
                className="w-7 h-7 sm:w-8 sm:h-8 mb-2 sm:mb-3"
                style={{ color: titleColor }}
              />
              <div className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
                GitHub
              </div>
              <p className="text-gray-300 text-center text-xs sm:text-base">
                {contactData.github.includes("/")
                  ? "@" + contactData.github.split("/").filter(Boolean).pop()
                  : contactData.github}
              </p>
            </motion.a>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
