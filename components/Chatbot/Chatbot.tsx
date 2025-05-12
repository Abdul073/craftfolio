import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { updatePortfolio } from '@/app/actions/portfolio';
import { useDispatch } from 'react-redux';
import { newPortfolioData } from '@/slices/dataSlice';
import toast from 'react-hot-toast';
import { fontOptions } from '@/lib/font';
import { Button } from '../ui/button';

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
  onOpenChange: (isOpen: boolean) => void;
  setCurrentFont: (font: string) => void;
}

interface MessageMemory {
  text: string;
  timestamp: Date;
}

const THEME_OPTIONS = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Blue', value: 'blue' }
];

const PortfolioChatbot = ({portfolioData, portfolioId, onOpenChange,setCurrentFont} : ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showFontOptions, setShowFontOptions] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [messageMemory, setMessageMemory] = useState<MessageMemory[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "👋 Hi there! I'm your AI portfolio assistant. I can help you edit content, change themes, and update fonts. Use the buttons below to customize your portfolio or just type your request directly.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const callGeminiAPI = async(inputValue : string) => {
    try {
      const response = await axios.post('/api/updateDataWithChatbot', {
        portfolioData, 
        inputValue,
        messageMemory: messageMemory.slice(-3)
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    setMessageMemory(prev => [...prev, {
      text: messageText,
      timestamp: new Date()
    }].slice(-3));
    
    setInputValue('');
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
      setMessages(prev => [...prev, tempMessage]);
      
      const apiResponse = await callGeminiAPI(messageText);
      
      await updatePortfolio({portfolioId: portfolioId, newPortfolioData: apiResponse.updatedData});
      
      dispatch(newPortfolioData(apiResponse.updatedData));
      
      const botResponse = apiResponse.userReply || "I've updated your portfolio with the requested changes.";
      
      setMessages(prev => prev.filter(msg => msg.id !== tempId).concat({
        id: Date.now() + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      }));
      
      toast.success("Portfolio updated successfully!");
    } catch (error) {
      console.error("Error processing message:", error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Failed to update portfolio");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    toast.success(`Theme "${theme}" selected`);
  };

  const handleApplyTheme = (theme: string) => {
    console.log('Theme applied successfully:', theme);
    toast.success('Theme applied successfully!');
    const notificationMessage: Message = {
      id: Date.now(),
      text: `Theme changed to ${theme}.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, notificationMessage]);
    setShowThemeOptions(false);
    setSelectedTheme('');
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
    console.log('Font applied successfully:', font);
    toast.success('Font applied successfully!');
    const notificationMessage: Message = {
      id: Date.now(),
      text: `Font changed to ${font}.`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, notificationMessage]);
    setShowFontOptions(false);
    setSelectedFont('');
  };

  const handleShowHelp = () => {
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setShowHelpPanel(true);
  };

  const EXAMPLE_PROMPTS = [
    {
      category: "Content Editing",
      examples: [
        "Update my name to John Smith",
        "Change my bio to 'Full-stack developer with 5 years of experience'",
        "Update my job title to Senior Software Engineer",
        "Add a new project called 'E-commerce Platform'",
        "Update my email to john@example.com"
      ]
    },
    {
      category: "Section Management",
      examples: [
        "Move the Projects section above Skills",
        "Hide the Education section",
        "Add a new section called 'Certifications'",
        "Reorder sections to: About, Skills, Projects, Contact",
        "Make the About section more prominent"
      ]
    },
    {
      category: "Project Updates",
      examples: [
        "Update the description of my React project",
        "Add new technologies to my Portfolio project",
        "Change the image of my E-commerce project",
        "Update the live demo link for Project X",
        "Add a new screenshot to my Mobile App project"
      ]
    },
    {
      category: "Skills & Experience",
      examples: [
        "Add React Native to my skills",
        "Update my years of experience with JavaScript",
        "Add a new skill category called 'Cloud Services'",
        "Update my proficiency level in Python",
        "Add AWS certification to my skills"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    setShowHelpPanel(false);
    setShowThemeOptions(false);
    setShowFontOptions(false);
    setIsOpen(newIsOpen);
    onOpenChange(newIsOpen);
  };

  return (
    <div className="fixed top-0 right-0 h-screen z-50 w-full md:w-[350px] lg:w-[400px]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#121212] text-gray-100 border-l border-gray-700 h-full w-full flex flex-col"
          >
            <div className="p-4 flex rounded-t-lg justify-between items-center bg-[#1c1c1e]">
              <div className="flex items-center gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleOpenChange(false)}
                  className="p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-200 cursor-pointer" />
                </motion.button>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold text-lg text-gray-100"
                >
                  Portfolio Assistant
                </motion.h3>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto rounded-lg bg-[#121212] relative">
              <AnimatePresence>
                {(showThemeOptions || showFontOptions || showHelpPanel) ? (
                  <motion.div
                    key="options-panel"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-[#121212] p-4 overflow-y-auto"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-bold text-lg text-gray-100">
                        {showThemeOptions ? "Select a Theme" : 
                         showFontOptions ? "Select a Font" : 
                         "How Can I Help You?"}
                      </h4>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          setShowThemeOptions(false);
                          setShowFontOptions(false);
                          setShowHelpPanel(false);
                        }}
                        className="ml-auto p-1 hover:bg-[#2c2c2e] rounded-full transition-colors"
                      >
                        <X size={18} className="text-gray-200 cursor-pointer" />
                      </motion.button>
                    </div>

                    {showHelpPanel && (
                      <div className="space-y-6">
                        <div className="bg-[#1c1c1e] rounded-lg p-4">
                          <h5 className="text-emerald-400 font-semibold mb-2">About Me</h5>
                          <p className="text-gray-300 text-sm">
                            I'm your AI portfolio assistant. I can help you customize your portfolio's content, 
                            layout, and appearance. Just type your request in natural language, and I'll help you make the changes.
                          </p>
                        </div>

                        {EXAMPLE_PROMPTS.map((section, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="bg-[#1c1c1e] rounded-lg p-4"
                          >
                            <h5 className="text-emerald-400 font-semibold mb-3">{section.category}</h5>
                            <div className="space-y-2">
                              {section.examples.map((example, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * (index + idx) }}
                                  className="bg-[#2c2c2e] rounded-lg p-3 cursor-pointer hover:bg-[#3c3c3e] transition-colors"
                                  onClick={() => {
                                    setInputValue(example);
                                    setShowHelpPanel(false);
                                  }}
                                >
                                  <p className="text-gray-200 text-sm">{example}</p>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}

                        <div className="bg-[#1c1c1e] rounded-lg p-4">
                          <h5 className="text-emerald-400 font-semibold mb-2">Tips</h5>
                          <ul className="text-gray-300 text-sm space-y-2">
                            <li>• Be specific in your requests for better results</li>
                            <li>• You can combine multiple changes in one request</li>
                            <li>• Use the Theme and Font buttons to quickly change appearance</li>
                            <li>• Click any example above to try it out</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {showThemeOptions && (
                      <div className="grid grid-cols-2 gap-3">
                        {THEME_OPTIONS.map((theme, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            onClick={() => handleThemeSelect(theme.name)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all bg-[#1c1c1e] hover:border-emerald-500 text-center relative ${
                              selectedTheme === theme.name 
                                ? 'border-emerald-500 bg-[#2c2c2e] ring ring-emerald-500 ring-opacity-50' 
                                : 'border-gray-700'
                            }`}
                          >
                            {selectedTheme === theme.name && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
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
                            <div className={`w-full h-12 rounded-md mb-2 ${
                              theme.value === 'light' ? 'bg-gray-100' :
                              theme.value === 'dark' ? 'bg-[#1c1c1e] border border-gray-700' :
                              theme.value === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'
                            }`}></div>
                            <p className="font-medium text-gray-100">{theme.name}</p>
                          </motion.div>
                        ))}
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
                            className={`p-4 rounded-lg border cursor-pointer transition-all bg-[#1c1c1e] hover:border-emerald-500 text-center relative ${
                              selectedFont === font 
                                ? 'border-emerald-500 bg-[#2c2c2e] ring ring-emerald-500 ring-opacity-50' 
                                : 'border-gray-700'
                            }`}
                          >
                            {selectedFont === font && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
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
                            <p className={`text-xl font-medium text-gray-100`}>
                              Aa
                            </p>
                            <p className="font-medium text-gray-100 mt-2">{font}</p>
                          </motion.div>
                        ))}
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
                          className={`${message.isUser ? 'flex justify-end' : 'flex justify-start'} ${
                            message.isSystemNotification ? 'justify-center' : ''
                          }`}
                        >
                          {message.isSystemNotification ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="bg-emerald-900 text-emerald-100 text-xs py-1 px-3 rounded-full max-w-[80%]"
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
                                  ? 'bg-emerald-600 text-white rounded-br-none'
                                  : 'bg-[#1c1c1e] text-gray-100 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-line">{message.text}</p>
                              <span className="text-xs opacity-70 mt-1 block">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                          <div className="bg-[#1c1c1e] text-gray-100 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
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
            
            { !(showFontOptions || showThemeOptions) && <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-t border-gray-700 rounded-lg bg-[#1c1c1e]"
            >
              <div className="flex gap-2 mb-3">
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isProcessing}
                  className="flex-1 px-3 py-2 rounded-lg outline-none bg-[#2c2c2e] text-gray-100 border border-gray-600 focus:border-emerald-500 transition-all resize-none min-h-[80px]"
                  rows={3}
                />
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleSendMessage()}
                  disabled={isProcessing || !inputValue.trim()}
                  className={`px-4 rounded-lg font-medium flex items-center justify-center ${
                    isProcessing || !inputValue.trim() 
                      ? 'bg-[#2c2c2e] text-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition-colors'
                  }`}
                >
                  <Send size={18} />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleShowThemeOptions}
                  className="text-sm py-2 px-3 text-center bg-[#2c2c2e] hover:bg-[#3c3c3e] rounded-lg border border-gray-600 text-gray-200 transition-colors"
                >
                  Change Theme
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleShowFontOptions}
                  className="text-sm py-2 px-3 text-center bg-[#2c2c2e] hover:bg-[#3c3c3e] rounded-lg border border-gray-600 text-gray-200 transition-colors"
                >
                  Change Font
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleShowHelp}
                  className="text-sm py-2 px-3 text-center bg-[#2c2c2e] hover:bg-[#3c3c3e] rounded-lg border border-gray-600 text-gray-200 transition-colors"
                >
                  Help
                </motion.button>
              </div>
            </motion.div>}

            {showFontOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-gray-700 bg-[#1c1c1e]"
              >
                <Button
                  onClick={() => selectedFont && handleApplyFont(selectedFont)}
                  disabled={!selectedFont}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-[#2c2c2e] disabled:cursor-not-allowed"
                >
                  Apply Selected Font
                </Button>
              </motion.div>
            )}
            {showThemeOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-gray-700 bg-[#1c1c1e]"
              >
                <Button
                  onClick={() => selectedTheme && handleApplyTheme(selectedTheme)}
                  disabled={!selectedTheme}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-[#2c2c2e] disabled:cursor-not-allowed"
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
          className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 cursor-pointer rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default PortfolioChatbot;