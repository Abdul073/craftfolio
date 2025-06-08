import { motion } from "framer-motion";
import { getThemeClasses, useMultiTabTheme } from "./ThemeContext";
import { User } from "lucide-react";
import EditButton from "../NeoSpark/EditButton";

const HeaderComponent = ({
  currentTheme,
  sectionTitle,
  sectionDescription,
  sectionName
}: {
  currentTheme: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionName : string;
}) => {
  const themeClasses = getThemeClasses(currentTheme);
  const { theme } = useMultiTabTheme();


  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={`absolute inset-0 rounded-3xl blur-3xl`} />
      <div
        className={`relative  border rounded-3xl py-6 px-6`}
        style={{ background: "transparent!important" }}
      >
        <div className={`flex justify-between items-start`}>
          <div className="space-y-2">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="p-2 rounded-lg"
                style={{ background: themeClasses.gradientPrimary }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="text-white" size={18} />
              </motion.div>
              <motion.h2
                className="text-3xl font-bold"
                style={{ color: theme==="dark" ? themeClasses.textPrimary : "black" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {sectionTitle || "About me"}
              </motion.h2>
              <div className="absolute right-24 top-16">
                <EditButton
                  sectionName={sectionName}
                  styles="opacity-70 top-16 hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
            <motion.p
              className="text-lg leading-relaxed max-w-4xl"
              style={{ color: themeClasses.textSecondary }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {sectionDescription}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { HeaderComponent };
