import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ArrowLeft, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { updatePortfolio } from '@/app/actions/portfolio';
import { useDispatch } from 'react-redux';
import { newPortfolioData } from '@/slices/dataSlice';
import toast from 'react-hot-toast';

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
}

// Define categories and their suggested prompts - reduced to only the three required categories
const CATEGORIES = {
  'UX Customization': [
    'Change my portfolio theme to dark mode',
    'Update the font style to something more modern',
    'Make my portfolio mobile-friendly',
    'Add animation to project cards'
  ],
  'Content Editing': [
    'Update my name to [new name]',
    'Change my title to [new title]',
    'Rewrite my bio to be more concise',
    'Update my profile picture'
  ],
  'Section Management': [
    'Move projects above experience section',
    'Hide the skills section',
    'Add a new testimonials section',
    'Reorder my portfolio sections'
  ]
};

const PortfolioChatbot = ({portfolioData, portfolioId, onOpenChange} : ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Content Editing');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: "👋 Hi there! I'm your AI portfolio assistant. Currently working on Content Editing. Just tell me what you'd like to change, or select another category from the settings menu.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const callGeminiAPI = async(inputValue : string) => {
    try {
      // Include the selected category with the API call
      const response = await axios.post('/api/updateDataWithChatbot', {
        portfolioData, 
        inputValue,
        category: selectedCategory // Add category to provide context
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

    if (messageText.trim().toLowerCase() === '/help') {
      // Show category selector instead of help
      setShowCategorySelector(true);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Add a temporary "thinking" message that will be replaced with the actual response
      const tempId = Date.now() + 1;
      const tempMessage: Message = {
        id: tempId,
        text: "Processing your request...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, tempMessage]);
      
      // Call the API and get the result
      const apiResponse = await callGeminiAPI(messageText);
      
      // Update the portfolio with the new data
      await updatePortfolio({portfolioId: portfolioId, newPortfolioData: apiResponse.updatedData});
      
      // Update the portfolio data in Redux
      dispatch(newPortfolioData(apiResponse.updatedData));
      
      // Replace the temporary message with the actual response from Gemini
      const botResponse = apiResponse.userReply || "I've updated your portfolio with the requested changes.";
      
      // Remove the temporary message and add the real one
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

  const handleSuggestedPromptClick = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory !== selectedCategory) {
      setSelectedCategory(newCategory);
      setShowCategorySelector(false);
      
      // Add a system notification message
      const notificationMessage: Message = {
        id: Date.now(),
        text: `You're now working on ${newCategory}. How can I help?`,
        isUser: false,
        timestamp: new Date(),
        isSystemNotification: true
      };
      
      setMessages(prev => [...prev, notificationMessage]);
    }
  };

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

  const selectorVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  const handleOpenChange = (newIsOpen: boolean) => {
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
            className="bg-gray-900 text-gray-100 border-l border-gray-700 h-full w-full flex flex-col"
          >
            <div className="p-4 flex rounded-t-lg justify-between items-center bg-gray-800">
              <div className="flex items-center gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleOpenChange(false)}
                  className="p-1 hover:bg-gray-700 rounded-full transition-colors"
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
              
              {/* Category indicator and settings button */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded">{selectedCategory}</span>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowCategorySelector(!showCategorySelector)}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Settings size={18} className="text-gray-200 cursor-pointer" />
                </motion.button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto rounded-lg bg-gray-900 relative">
              <AnimatePresence mode="wait">
                {showCategorySelector ? (
                  <motion.div
                    key="category-selector"
                    variants={selectorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-gray-900 p-4 overflow-y-auto"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowCategorySelector(false)}
                        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <ArrowLeft size={18} className="text-gray-200 cursor-pointer" />
                      </motion.button>
                      <h4 className="font-bold text-lg text-gray-100">Select a Category</h4>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(CATEGORIES).map(([category, prompts]) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          onClick={() => handleCategoryChange(category)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            category === selectedCategory 
                              ? 'bg-blue-900 border-blue-600' 
                              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-gray-100">{category}</p>
                            {category === selectedCategory && (
                              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">Current</span>
                            )}
                          </div>
                          <ul className="space-y-1 text-sm text-gray-300">
                            {prompts.slice(0, 2).map((prompt, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 + (0.05 * i) }}
                              >
                                • {prompt}
                              </motion.li>
                            ))}
                            <li className="text-gray-400 text-xs">+ more options</li>
                          </ul>
                        </motion.div>
                      ))}
                    </div>
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
                              className="bg-blue-900 text-blue-100 text-xs py-1 px-3 rounded-full max-w-[80%]"
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
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
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
                          <div className="bg-gray-800 text-gray-100 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
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
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-t border-gray-700 rounded-lg bg-gray-800"
            >
              <div className="flex gap-2 mb-3">
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isProcessing}
                  className="flex-1 px-3 py-2 rounded-lg outline-none bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 transition-all resize-none min-h-[80px]"
                  rows={3}
                />
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleSendMessage()}
                  disabled={isProcessing || !inputValue.trim()}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    isProcessing || !inputValue.trim() 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors'
                  }`}
                >
                  <Send size={18} />
                </motion.button>
              </div>
              
              {/* Suggested prompts based on category */}
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES[selectedCategory as keyof typeof CATEGORIES]?.slice(0, 4).map((prompt, index) => (
                  <motion.button
                    key={index}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleSuggestedPromptClick(prompt)}
                    disabled={isProcessing}
                    className="text-xs py-2 px-3 text-left bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 text-gray-200 transition-colors truncate"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
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
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 cursor-pointer rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default PortfolioChatbot;