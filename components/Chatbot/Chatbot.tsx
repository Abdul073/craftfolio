import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { updatePortfolio } from "@/app/actions/portfolio";
import { useDispatch } from "react-redux";
import { newPortfolioData } from "@/slices/dataSlice";
import toast from "react-hot-toast";
import { fontClassMap, fontOptions } from "@/lib/font";
import { Button } from "../ui/button";
import { ColorTheme } from "@/lib/colorThemes";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSystemNotification?: boolean;
}

interface ChatbotProps {
  portfolioData: any;
  portfolioId: string;
  themeOptions: any;
  currentPortTheme: any;
  onOpenChange: (isOpen: boolean) => void;
  setCurrentFont: (font: string) => void;
  setCurrentPortTheme: (theme: string) => void;
}

interface MessageMemory {
  text: string;
  timestamp: Date;
}

const PortfolioChatbot = ({
  portfolioData,
  setCurrentPortTheme,
  currentPortTheme,
  portfolioId,
  themeOptions,
  onOpenChange,
  setCurrentFont,
}: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showFontOptions, setShowFontOptions] = useState(false);
  const [showSectionReorder, setShowSectionReorder] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [messageMemory, setMessageMemory] = useState<MessageMemory[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [reorderedSections, setReorderedSections] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const themeOptionsArray = Object.keys(themeOptions);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "👋 Hi there! I'm your AI portfolio assistant. I can help you edit content, change themes, and update fonts. Use the buttons below to customize your portfolio or just type your request directly.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (portfolioData) {
      let mainSections: any = [];
      portfolioData.map(
        (item: any) =>
          !(
            item.type === "userInfo" ||
            item.type === "themes" ||
            item.type === "hero"
          ) && mainSections.push(item.type)
      );
      setSections(mainSections);
      setReorderedSections(mainSections);
    }
  }, [portfolioData]);

  const callGeminiAPI = async (inputValue: string) => {
    try {
      const response = await axios.post("/api/updateDataWithChatbot", {
        portfolioData,
        inputValue,
        messageMemory: messageMemory.slice(-3),
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setMessageMemory((prev) =>
      [
        ...prev,
        {
          text: messageText,
          timestamp: new Date(),
        },
      ].slice(-3)
    );

    setInputValue("");
    setIsProcessing(true);

    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);

    try {
      const tempId = Date.now() + 1;
      const tempMessage: Message = {
        id: tempId,
        text: "Processing your request...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      const apiResponse = await callGeminiAPI(messageText);

      await updatePortfolio({
        portfolioId: portfolioId,
        newPortfolioData: apiResponse.updatedData,
      });

      dispatch(newPortfolioData(apiResponse.updatedData));

      const botResponse =
        apiResponse.userReply ||
        "I've updated your portfolio with the requested changes.";

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== tempId)
          .concat({
            id: Date.now() + 2,
            text: botResponse,
            isUser: false,
            timestamp: new Date(),
          })
      );

      toast.success("Portfolio updated successfully!");
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to update portfolio");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleThemeSelect = (theme: string) => {
    setCurrentPortTheme(theme);
    setSelectedTheme(theme);
  };

  const handleApplySelectedTheme = () => {
    setCurrentPortTheme(selectedTheme);
    toast.success(`Theme "${selectedTheme}" applied!`);
    const notificationMessage: Message = {
      id: Date.now(),
      text: `Theme changed to ${selectedTheme}.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, notificationMessage]);
    setShowThemeOptions(false);
    setSelectedTheme("");
  };

  const handleShowThemeOptions = () => {
    setShowHelpPanel(false);
    setShowFontOptions(false);
    setShowThemeOptions(true);
  };

  const handleShowFontOptions = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(true);
  };

  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
    setCurrentFont(font);
  };

  const handleApplyFont = (font: string) => {
    console.log("Font applied successfully:", font);
    toast.success("Font applied successfully!");
    const notificationMessage: Message = {
      id: Date.now(),
      text: `Font changed to ${font}.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, notificationMessage]);
    setShowFontOptions(false);
    setSelectedFont("");
  };

  const handleShowHelp = () => {
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowHelpPanel(true);
  };

  const handleShowSectionReorder = () => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(true);
    setReorderedSections([...sections]);
  };

  const handleSectionReorder = async () => {
    try {
      setIsProcessing(true);
      const sectionOrder: any = [];
      portfolioData.map((item : any) => sectionOrder.push(item.type))
      const updatedOrder : any= [];
      let idx = 0;
      sectionOrder.forEach((section : any) => {
        if(section === "hero" || section === "userInfo" || section === "themes"){
          updatedOrder.push(section);
        }else{
          updatedOrder.push(reorderedSections[idx]);
          idx++;
        }
      })
      const finalSections: any = [];
      updatedOrder.forEach((item : any) => {
        const found = portfolioData.find((it : any) => it.type === item);
        if (found) {
          finalSections.push({ type: item, data: found.data });
        } else {
          toast.error("Error while re ordering sections");
          return;
        }
      });

      await updatePortfolio({
        portfolioId: portfolioId,
        newPortfolioData: finalSections,
      });

      dispatch(newPortfolioData(finalSections));
      setSections(reorderedSections);

      const notificationMessage: Message = {
        id: Date.now(),
        text: "Sections reordered successfully!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, notificationMessage]);
      toast.success("Sections reordered successfully!");
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Failed to reorder sections");
    } finally {
      setIsProcessing(false);
      setShowSectionReorder(false);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...reorderedSections];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < reorderedSections.length) {
      [newSections[index], newSections[newIndex]] = [
        newSections[newIndex],
        newSections[index],
      ];
      setReorderedSections(newSections);
    }
  };

  const resetSectionOrder = () => {
    setReorderedSections([...sections]);
  };

  const EXAMPLE_PROMPTS = [
    {
      category: "Content Editing",
      examples: [
        "Update my name to John Smith",
        "Change my bio to 'Full-stack developer with 5 years of experience'",
        "Update my job title to Senior Software Engineer",
        "Add a new project called 'E-commerce Platform'",
        "Update my email to john@example.com",
      ],
    },
    {
      category: "Section Management",
      examples: [
        "Move the Projects section above Skills",
        "Hide the Education section",
        "Add a new section called 'Certifications'",
        "Reorder sections to: About, Skills, Projects, Contact",
        "Make the About section more prominent",
      ],
    },
    {
      category: "Project Updates",
      examples: [
        "Update the description of my React project",
        "Add new technologies to my Portfolio project",
        "Change the image of my E-commerce project",
        "Update the live demo link for Project X",
        "Add a new screenshot to my Mobile App project",
      ],
    },
    {
      category: "Skills & Experience",
      examples: [
        "Add React Native to my skills",
        "Update my years of experience with JavaScript",
        "Add a new skill category called 'Cloud Services'",
        "Update my proficiency level in Python",
        "Add AWS certification to my skills",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowSectionReorder(false);
    setIsOpen(newIsOpen);
    onOpenChange(newIsOpen);
  };

  return (
    <div
      className={
        isOpen
          ? "fixed top-0 right-0 h-screen z-50 w-full md:w-[350px] lg:w-[400px]"
          : ""
      }
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full w-full flex flex-col"
            style={{
              backgroundColor: ColorTheme.bgMain,
              color: ColorTheme.textPrimary,
              borderLeft: `1px solid ${ColorTheme.borderLight}`,
            }}
          >
            <div
              className="p-4 flex rounded-t-lg justify-between items-center"
              style={{ backgroundColor: ColorTheme.bgNav }}
            >
              <div className="flex items-center gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleOpenChange(false)}
                  className="p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                  style={{ color: ColorTheme.textPrimary }}
                >
                  <X size={20} className="cursor-pointer" />
                </motion.button>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold text-lg"
                  style={{ color: ColorTheme.textPrimary }}
                >
                  Portfolio Assistant
                </motion.h3>
              </div>
            </div>

            <div
              className="flex-1 p-4 overflow-y-auto rounded-lg relative"
              style={{ backgroundColor: ColorTheme.bgMain }}
            >
              <AnimatePresence>
                {showThemeOptions ||
                showFontOptions ||
                showHelpPanel ||
                showSectionReorder ? (
                  <motion.div
                    key="options-panel"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-0 left-0 right-0 bottom-0 z-10 p-4 overflow-y-auto"
                    style={{ backgroundColor: ColorTheme.bgMain }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <h4
                        className="font-bold text-lg"
                        style={{ color: ColorTheme.textPrimary }}
                      >
                        {showThemeOptions
                          ? "Select a Theme"
                          : showFontOptions
                          ? "Select a Font"
                          : showSectionReorder
                          ? "Reorder Sections"
                          : "How Can I Help You?"}
                      </h4>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          setShowThemeOptions(false);
                          setShowFontOptions(false);
                          setShowHelpPanel(false);
                          setShowSectionReorder(false);
                        }}
                        className="ml-auto p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                        style={{ color: ColorTheme.textPrimary }}
                      >
                        <X size={18} className="cursor-pointer" />
                      </motion.button>
                    </div>

                    {showHelpPanel && (
                      <div className="space-y-6">
                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: ColorTheme.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: ColorTheme.primary }}
                          >
                            About Me
                          </h5>
                          <p
                            className="text-sm"
                            style={{ color: ColorTheme.textSecondary }}
                          >
                            I'm your AI portfolio assistant. I can help you
                            customize your portfolio's content, layout, and
                            appearance. Just type your request in natural
                            language, and I'll help you make the changes.
                          </p>
                        </div>

                        {EXAMPLE_PROMPTS.map((section, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="rounded-lg p-4"
                            style={{ backgroundColor: ColorTheme.bgCard }}
                          >
                            <h5
                              className="font-semibold mb-3"
                              style={{ color: ColorTheme.primary }}
                            >
                              {section.category}
                            </h5>
                            <div className="space-y-2">
                              {section.examples.map((example, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * (index + idx) }}
                                  className="rounded-lg p-3 cursor-pointer transition-colors"
                                  style={{
                                    backgroundColor: ColorTheme.bgCardHover,
                                    color: ColorTheme.textPrimary,
                                  }}
                                  onClick={() => {
                                    setInputValue(example);
                                    setShowHelpPanel(false);
                                  }}
                                >
                                  <p className="text-sm">{example}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}

                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: ColorTheme.bgCard }}
                        >
                          <h5
                            className="font-semibold mb-2"
                            style={{ color: ColorTheme.primary }}
                          >
                            Tips
                          </h5>
                          <ul
                            className="text-sm space-y-2"
                            style={{ color: ColorTheme.textSecondary }}
                          >
                            <li>
                              • Be specific in your requests for better results
                            </li>
                            <li>
                              • You can combine multiple changes in one request
                            </li>
                            <li>
                              • Use the Theme and Font buttons to quickly change
                              appearance
                            </li>
                            <li>• Click any example above to try it out</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {showThemeOptions && (
                      <div className="grid grid-cols-2 gap-3">
                        {themeOptionsArray.map((theme, index) => {
                          const themeDetails = themeOptions[theme];
                          const bgColor =
                            themeDetails?.colors?.primary || "#f0f0f0";
                          const textColor =
                            themeDetails?.colors?.text?.primary || "#333333";

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              onClick={() => handleThemeSelect(theme)}
                              className={`p-4 rounded-lg border cursor-pointer transition-all text-center relative ${
                                currentPortTheme === theme
                                  ? "ring ring-opacity-50"
                                  : ""
                              }`}
                              style={{
                                backgroundColor: ColorTheme.bgCard,
                                borderColor:
                                  currentPortTheme === theme
                                    ? ColorTheme.primary
                                    : ColorTheme.borderLight,
                                boxShadow:
                                  currentPortTheme === theme
                                    ? `0 0 20px ${ColorTheme.primaryGlow}`
                                    : "none",
                              }}
                            >
                              {(selectedTheme === theme ||
                                currentPortTheme === theme) && (
                                <div
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: ColorTheme.primary,
                                  }}
                                >
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div
                                className="w-full h-16 rounded-md mb-3 flex flex-col items-center justify-center p-1 shadow-inner"
                                style={{ backgroundColor: bgColor }}
                              >
                                <span
                                  style={{ color: textColor }}
                                  className="text-lg font-semibold"
                                >
                                  Aa
                                </span>
                                <div
                                  className="w-10 h-3 mt-1 rounded-sm"
                                  style={{ backgroundColor: bgColor }}
                                ></div>
                              </div>
                              <p
                                className="font-medium capitalize"
                                style={{ color: ColorTheme.textPrimary }}
                              >
                                {theme}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}

                    {showFontOptions && (
                      <div className="grid grid-cols-2 gap-3">
                        {fontOptions.map((font, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            onClick={() => handleFontSelect(font)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all text-center relative ${
                              selectedFont === font
                                ? "ring ring-opacity-50"
                                : ""
                            } ${fontClassMap[font]}`}
                            style={{
                              backgroundColor: ColorTheme.bgCard,
                              borderColor:
                                selectedFont === font
                                  ? ColorTheme.primary
                                  : ColorTheme.borderLight,
                              boxShadow:
                                selectedFont === font
                                  ? `0 0 20px ${ColorTheme.primaryGlow}`
                                  : "none",
                            }}
                          >
                            {selectedFont === font && (
                              <div
                                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: ColorTheme.primary }}
                              >
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                            <p
                              className={`text-xl font-medium`}
                              style={{ color: ColorTheme.textPrimary }}
                            >
                              Aa
                            </p>
                            <p
                              className="font-medium mt-2"
                              style={{ color: ColorTheme.textPrimary }}
                            >
                              {font}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {showSectionReorder && (
                      <div className="space-y-4">
                        <div
                          className="rounded-lg p-4"
                          style={{ backgroundColor: ColorTheme.bgCard }}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <p
                              className="text-sm"
                              style={{ color: ColorTheme.textSecondary }}
                            >
                              Use arrows to reorder sections
                            </p>
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={resetSectionOrder}
                              className="text-sm px-3 py-1 rounded-lg border transition-colors"
                              style={{
                                backgroundColor: ColorTheme.bgCardHover,
                                borderColor: ColorTheme.borderLight,
                                color: ColorTheme.textPrimary,
                              }}
                            >
                              Reset Order
                            </motion.button>
                          </div>
                          <div className="space-y-2">
                            {reorderedSections.map((section, index) => {
                              return (
                                <motion.div
                                  key={section}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="flex items-center gap-2 p-3 rounded-lg"
                                  style={{
                                    backgroundColor: ColorTheme.bgCardHover,
                                    border: `1px solid ${ColorTheme.borderLight}`,
                                  }}
                                >
                                  <div className="flex-1">
                                    <span
                                      className="font-medium capitalize"
                                      style={{ color: ColorTheme.textPrimary }}
                                    >
                                      {section.replace(/_/g, " ")}
                                    </span>
                                    <p
                                      className="text-xs mt-1"
                                      style={{
                                        color: ColorTheme.textSecondary,
                                      }}
                                    >
                                      {/* {portfolioData.sections[section]?.title || 
                                       portfolioData.sections[section]?.name || 
                                       'Section'} */}{" "}
                                      {section} Section
                                    </p>
                                  </div>
                                  <div className="flex gap-1">
                                    <motion.button
                                      variants={buttonVariants}
                                      whileHover="hover"
                                      whileTap="tap"
                                      onClick={() => moveSection(index, "up")}
                                      disabled={index === 0}
                                      className="p-1 rounded hover:bg-[#2c2c2e] transition-colors disabled:opacity-50"
                                      style={{ color: ColorTheme.textPrimary }}
                                    >
                                      ↑
                                    </motion.button>
                                    <motion.button
                                      variants={buttonVariants}
                                      whileHover="hover"
                                      whileTap="tap"
                                      onClick={() => moveSection(index, "down")}
                                      disabled={
                                        index === reorderedSections.length - 1
                                      }
                                      className="p-1 rounded hover:bg-[#2c2c2e] transition-colors disabled:opacity-50"
                                      style={{ color: ColorTheme.textPrimary }}
                                    >
                                      ↓
                                    </motion.button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`${
                            message.isUser
                              ? "flex justify-end"
                              : "flex justify-start"
                          } ${
                            message.isSystemNotification ? "justify-center" : ""
                          }`}
                        >
                          {message.isSystemNotification ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="text-xs py-1 px-3 rounded-full max-w-[80%]"
                              style={{
                                backgroundColor: ColorTheme.primary,
                                color: ColorTheme.textPrimary,
                              }}
                            >
                              {message.text}
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.isUser
                                  ? "rounded-br-none"
                                  : "rounded-bl-none"
                              }`}
                              style={{
                                backgroundColor: message.isUser
                                  ? ColorTheme.primary
                                  : ColorTheme.bgCard,
                                color: ColorTheme.textPrimary,
                              }}
                            >
                              <p className="text-sm whitespace-pre-line">
                                {message.text}
                              </p>
                              <span
                                className="text-xs opacity-70 mt-1 block"
                                style={{ color: ColorTheme.textSecondary }}
                              >
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                      {isProcessing && (
                        <motion.div
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex justify-start"
                        >
                          <div
                            className="rounded-lg rounded-bl-none p-3 max-w-[80%]"
                            style={{ backgroundColor: ColorTheme.bgCard }}
                          >
                            <div className="flex space-x-2">
                              <div
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: ColorTheme.primary,
                                  animationDelay: "0ms",
                                }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: ColorTheme.primary,
                                  animationDelay: "150ms",
                                }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: ColorTheme.primary,
                                  animationDelay: "300ms",
                                }}
                              ></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {!(showFontOptions || showThemeOptions || showSectionReorder) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 border-t rounded-lg"
                style={{
                  backgroundColor: ColorTheme.bgNav,
                  borderColor: ColorTheme.borderLight,
                }}
              >
                <div className="flex gap-2 mb-3">
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isProcessing}
                    className="flex-1 px-3 py-2 rounded-lg outline-none resize-none min-h-[80px]"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      color: ColorTheme.textPrimary,
                      borderColor: ColorTheme.borderLight,
                    }}
                    rows={3}
                  />
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleSendMessage()}
                    disabled={isProcessing || !inputValue.trim()}
                    className={`px-4 rounded-lg font-medium flex items-center justify-center transition-colors`}
                    style={{
                      backgroundColor:
                        isProcessing || !inputValue.trim()
                          ? ColorTheme.bgCard
                          : ColorTheme.primary,
                      color: ColorTheme.textPrimary,
                      boxShadow:
                        !isProcessing && inputValue.trim()
                          ? `0 4px 14px ${ColorTheme.primaryGlow}`
                          : "none",
                    }}
                  >
                    <Send size={18} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowThemeOptions}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary,
                    }}
                  >
                    Change Theme
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowFontOptions}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary,
                    }}
                  >
                    Change Font
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowSectionReorder}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary,
                    }}
                  >
                    Reorder Sections
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleShowHelp}
                    className="text-sm py-2 px-3 text-center rounded-lg border transition-colors"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      borderColor: ColorTheme.borderLight,
                      color: ColorTheme.textPrimary,
                    }}
                  >
                    Help
                  </motion.button>
                </div>
              </motion.div>
            )}

            {showSectionReorder && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: ColorTheme.bgNav,
                  borderColor: ColorTheme.borderLight,
                }}
              >
                <div className="flex gap-2">
                  <Button
                    onClick={resetSectionOrder}
                    className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: ColorTheme.bgCard,
                      color: ColorTheme.textPrimary,
                      borderColor: ColorTheme.borderLight,
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSectionReorder}
                    disabled={
                      isProcessing ||
                      JSON.stringify(sections) ===
                        JSON.stringify(reorderedSections)
                    }
                    className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor:
                        isProcessing ||
                        JSON.stringify(sections) ===
                          JSON.stringify(reorderedSections)
                          ? ColorTheme.bgCard
                          : ColorTheme.primary,
                      color: ColorTheme.textPrimary,
                      boxShadow:
                        !isProcessing &&
                        JSON.stringify(sections) !==
                          JSON.stringify(reorderedSections)
                          ? `0 4px 14px ${ColorTheme.primaryGlow}`
                          : "none",
                    }}
                  >
                    Apply New Order
                  </Button>
                </div>
              </motion.div>
            )}

            {showFontOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: ColorTheme.bgNav,
                  borderColor: ColorTheme.borderLight,
                }}
              >
                <Button
                  onClick={() => selectedFont && handleApplyFont(selectedFont)}
                  disabled={!selectedFont}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !selectedFont
                      ? ColorTheme.bgCard
                      : ColorTheme.primary,
                    color: ColorTheme.textPrimary,
                    boxShadow: selectedFont
                      ? `0 4px 14px ${ColorTheme.primaryGlow}`
                      : "none",
                  }}
                >
                  Apply Selected Font
                </Button>
              </motion.div>
            )}
            {showThemeOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t"
                style={{
                  backgroundColor: ColorTheme.bgNav,
                  borderColor: ColorTheme.borderLight,
                }}
              >
                <Button
                  onClick={handleApplySelectedTheme}
                  disabled={!selectedTheme}
                  className="w-full font-medium py-2 px-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: !selectedTheme
                      ? ColorTheme.bgCard
                      : ColorTheme.primary,
                    color: ColorTheme.textPrimary,
                    boxShadow: selectedTheme
                      ? `0 4px 14px ${ColorTheme.primaryGlow}`
                      : "none",
                  }}
                >
                  Apply Selected Theme
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-6 right-6 p-4 cursor-pointer rounded-full shadow-lg transition-colors"
          style={{
            backgroundColor: ColorTheme.primary,
            color: ColorTheme.textPrimary,
            boxShadow: `0 4px 14px ${ColorTheme.primaryGlow}`,
          }}
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default PortfolioChatbot;
