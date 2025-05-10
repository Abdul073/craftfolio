import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Lightbulb, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'
import { updatePortfolio } from '@/app/actions/portfolio';
import { useDispatch } from 'react-redux';
import { newPortfolioData, updatePortfolioData } from '@/slices/dataSlice';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  portfolioData: any;
  portfolioId: string;
  onOpenChange: (isOpen: boolean) => void;
}

const PortfolioChatbot = ({portfolioData, portfolioId, onOpenChange} : ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  const callGeminiAPI = async(inputValue : string)=>{
      try {
        const response = await axios.post('/api/updateDataWithChatbot',{portfolioData,inputValue})
        console.log(response.data)
        return response.data.updatedData;
      } catch (error) {
        console.log(error)
      }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    if (inputValue.trim().toLowerCase() === '/help') {
      setShowHelp(true);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await callGeminiAPI(inputValue);
      await updatePortfolio({portfolioId : portfolioId, newPortfolioData : response})
      dispatch(newPortfolioData(response));
      toast.success("Portfolio updated successfully !!");
      const botMessage: Message = {
        id: Date.now() + 1,
        text: "Ok i am trying.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const helpPanelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    onOpenChange(newIsOpen);
  };

  return (
    <div className="fixed top-0 right-0 h-screen z-50 w-[20%]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white text-black border-l border-black h-full w-full flex flex-col"
          >
            <div className="p-4 flex rounded-lg justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleOpenChange(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-black cursor-pointer" />
                </motion.button>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold text-lg"
                >
                  Portfolio Assistant
                </motion.h3>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto rounded-lg bg-white">
              <AnimatePresence mode="wait">
                {showHelp ? (
                  <motion.div
                    key="help-panel"
                    variants={helpPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-gray-50 p-4 rounded-lg mb-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleCloseHelp}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <ArrowLeft size={18} className="text-black cursor-pointer" />
                      </motion.button>
                      <h4 className="font-bold text-lg">Here's what I can help you with:</h4>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {[
                        "Update content and text",
                        "Change name and title",
                        "Rewrite project descriptions",
                        "Reorder sections",
                        "Show/hide elements",
                        "Manage your status badge"
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-blue-600">🔹</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <p className="text-sm text-gray-700 mb-2">Try saying:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {[
                          "• \"Change my name to Alex Morgan\"",
                          "• \"Update my title to Senior Frontend\"",
                          "• \"Rewrite my first project description\"",
                          "• \"Move projects above experience\"",
                          "• \"Hide my status badge\"",
                          "• \"Update summary to [your new summary]\""
                        ].map((example, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + (0.1 * index) }}
                          >
                            {example}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-gray-50 p-4 rounded-lg mb-4"
                    >
                      <p className="text-gray-800 mb-2">👋 Hi there! I'm your AI portfolio assistant.</p>
                      <p className="text-gray-800 mb-3">Just tell me what you'd like to change about your portfolio, and I'll help you update it instantly.</p>
                      <p className="text-gray-800 mb-3">Type <span className="font-mono bg-gray-200 px-2 py-1 rounded">/help</span> or click below to see what I can do.</p>
                      <motion.button 
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleHelpClick}
                        className="flex items-center gap-2 bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full justify-center"
                      >
                        <Lightbulb size={18} />
                        Show Commands
                      </motion.button>
                    </motion.div>
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className={`mb-4 ${message.isUser ? 'flex justify-end' : 'flex justify-start'}`}
                        >
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.isUser
                                ? 'bg-black text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </motion.div>
                        </motion.div>
                      ))}
                      {isProcessing && (
                        <motion.div
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex justify-start mb-4"
                        >
                          <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 border-t-2 rounded-lg bg-gray-50"
            >
              <div className="flex gap-2">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isProcessing}
                  className="flex-1 px-3 py-2 rounded-lg outline-none ring-2 ring-gray-400 bg-white transition-all"
                />
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSendMessage}
                  disabled={isProcessing || !inputValue.trim()}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    isProcessing || !inputValue.trim() 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800 cursor-pointer transition-colors'
                  }`}
                >
                  <Send size={18} />
                </motion.button>
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
          className="fixed bottom-6 right-6 bg-black text-white p-4 cursor-pointer rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default PortfolioChatbot;