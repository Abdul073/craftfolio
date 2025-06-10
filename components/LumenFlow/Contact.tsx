import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Contact as ContactIcon, Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter } from "lucide-react";
import { getThemeClasses } from "./ThemeContext";

interface ContactProps {
  currentTheme: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

const Contact: React.FC<ContactProps> = ({ currentTheme }) => {
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const contactData = portfolioData?.find(
    (section: any) => section.type === "userInfo"
  )?.data || {};
  const themeClasses = getThemeClasses(currentTheme);

  const sectionTitle = "Contact";
  const sectionDescription =
    "Get in touch with me for collaborations, opportunities, or just to say hello!";

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${
          currentTheme === "light"
            ? "from-orange-400/5 via-transparent to-indigo-600/5"
            : "from-orange-400/10 via-transparent to-indigo-600/10"
        } rounded-3xl blur-3xl`}></div>
        <div className={`relative backdrop-blur-sm border rounded-3xl p-8 ${
          currentTheme === "light"
            ? "bg-white/80 border-gray-200/50"
            : themeClasses.bgSecondary
        }`}>
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  currentTheme === "light"
                    ? "bg-orange-500"
                    : themeClasses.gradientPrimary
                }`}>
                  <ContactIcon className="text-white" size={24} />
                </div>
                <h2 className={`text-5xl font-bold ${
                  currentTheme === "light" ? "text-gray-900" : themeClasses.textPrimary
                }`}>
                  {sectionTitle}
                </h2>
              </div>
              <p className={`text-lg leading-relaxed max-w-4xl ${
                currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
              }`}>
                {sectionDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="space-y-6">
          {contactData.email && (
            <div className={`flex items-center space-x-4 ${
              currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
            }`}>
              <Mail size={20} className="text-orange-500" />
              <span>{contactData.email}</span>
            </div>
          )}
          {contactData.phone && (
            <div className={`flex items-center space-x-4 ${
              currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
            }`}>
              <Phone size={20} className="text-orange-500" />
              <span>{contactData.phone}</span>
            </div>
          )}
          {contactData.location && (
            <div className={`flex items-center space-x-4 ${
              currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
            }`}>
              <MapPin size={20} className="text-orange-500" />
              <span>{contactData.location}</span>
            </div>
          )}
          {contactData.website && (
            <div className={`flex items-center space-x-4 ${
              currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
            }`}>
              <Globe size={20} className="text-orange-500" />
              <span>{contactData.website}</span>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-6">
          {contactData.socialLinks?.map((link: SocialLink, index: number) => (
            <div key={index} className={`flex items-center space-x-4 ${
              currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
            }`}>
              {link.platform === "linkedin" && <Linkedin size={20} className="text-orange-500" />}
              {link.platform === "github" && <Github size={20} className="text-orange-500" />}
              {link.platform === "twitter" && <Twitter size={20} className="text-orange-500" />}
              <span>{link.url}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!contactData.email && !contactData.phone && !contactData.location && !contactData.website && (!contactData.socialLinks || contactData.socialLinks.length === 0) && (
        <div className="text-center py-16">
          <div className="space-y-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
              currentTheme === "light" ? "bg-gray-50" : themeClasses.bgSecondary
            }`}>
              <ContactIcon size={32} className={currentTheme === "light" ? "text-gray-400" : themeClasses.textSecondary} />
            </div>
            <h3 className={`text-xl font-semibold ${
              currentTheme === "light" ? "text-gray-600" : themeClasses.textSecondary
            }`}>
              No contact information yet
            </h3>
            <p className={`max-w-md mx-auto ${
              currentTheme === "light" ? "text-gray-500" : themeClasses.textSecondary
            }`}>
              Start adding your contact information to make it easy for others to
              reach out to you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;