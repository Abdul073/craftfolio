import React, { useState } from 'react';
import { motion } from "framer-motion";
import Slider from "react-slick";
import { ColorTheme } from '@/lib/colorThemes';
import { CheckCircle, GripHorizontalIcon, MousePointer2, ChevronLeft, ChevronRight, ChevronDown, Star, Sparkles, Palette, Zap } from 'lucide-react';
import { fadeInScale } from '@/lib/animations';
import { useRouter } from 'next/navigation';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ThemeCardProps {
  theme: {
    id: number;
    templateName: string;
    name: string;
    category: string;
    description: string;
    previewImageUrl: string[]; // Changed to string array
    features: string[];
  };
  handleSelectTheme: (id: number) => void;
  selectedTheme: number;
  isExpanded: boolean;
  handleCardClick: (id: number) => void;
}

const PrevArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute bottom-4 right-[52px] z-10 cursor-pointer bg-black bg-opacity-50 rounded-full p-1"
      style={{ ...style }}
      onClick={onClick}
    >
      <ChevronLeft size={20} color={ColorTheme.primary} />
    </div>
  );
};

const NextArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute bottom-4 right-4 z-10 cursor-pointer bg-black bg-opacity-50 rounded-full p-1"
      style={{ ...style }}
      onClick={onClick}
    >
      <ChevronRight size={20} color={ColorTheme.primary} />
    </div>
  );
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, handleSelectTheme, selectedTheme, isExpanded, handleCardClick }) => {
  const router = useRouter();
  
  // State to track current slide index
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // Use the actual preview images from the theme object
  // If previewImageUrl is empty, provide a fallback
  const previewImages = theme.previewImageUrl.length > 0 
    ? theme.previewImageUrl 
    : ['/placeholder-image.jpg'];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <div
        style={{
          width: "20px",
          height: "3px",
          borderRadius: "1px",
          background: i === currentSlide ? ColorTheme.primary : "rgba(255, 255, 255, 0.5)",
          margin: "0 3px",
          transition: "all 0.3s ease"
        }}
      />
    ),
    dotsClass: "slick-dots custom-line-indicators"
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <motion.div 
      className="rounded-xl overflow-visible transition-all h-full w-full max-w-full md:max-w-none sm:max-w-md md:mx-0 mx-auto"
      variants={fadeInScale}
      style={{ 
        backgroundColor: ColorTheme.bgCard,
        backdropFilter: "blur(12px)",
        border: `1px solid ${selectedTheme === theme.id ? ColorTheme.primary : ColorTheme.borderLight}`,
        boxShadow: selectedTheme === theme.id ? `0 0 20px ${ColorTheme.primaryGlow}` : 'none'
      }}
      whileHover={{ 
        boxShadow: `0 8px 30px rgba(0,0,0,0.12), 0 4px 15px ${ColorTheme.primaryGlow}`,
      }}
    >
      {/* Theme Tag - Moved to extreme top left */}
      <div className="absolute -top-3 -left-3 z-20">
        <span 
          className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'rgba(0, 0, 0, 0.75)',
            border: `1px solid ${ColorTheme.primary}`,
            color: ColorTheme.primary,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3)`,
            backdropFilter: 'blur(4px)'
          }}
        >
          {theme.name === 'LumenFlow' ? (
            <>
              <Star size={14} className="text-yellow-500" />
              Recommended
            </>
          ) : theme.name === 'SimpleWhite' ? (
            <>
              <Palette size={14} />
              Minimalistic
            </>
          ) : theme.name === 'NeoSpark' ? (
            <>
              <Zap size={14} className="text-blue-500" />
              Modern & Dynamic
            </>
          ) : (
            <>
              <Sparkles size={14} className="text-purple-500" />
              Professional
            </>
          )}
        </span>
      </div>
      
      {/* Image Section with Slider */}
      <div className="h-48 sm:h-56  md:h-64 lg:h-64 xl:h-64 relative overflow-hidden group">
        <Slider {...sliderSettings} className="h-full">
          {previewImages.map((image, index) => (
            <div key={index} className="h-48 sm:h-56 md:h-64  lg:h-64 xl:h-64">
              <img
                src={image}
                alt={`${theme.name} theme preview ${index + 1}`}
                className="max-w-full mx-auto h-full object-cover transition-transform duration-500"
              />
            </div>
          ))}
        </Slider>
        
        {selectedTheme === theme.id && (
          <motion.div 
            className="absolute top-4 right-4 p-1 rounded-full z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ 
              backgroundColor: ColorTheme.primary,
              color: '#000'
            }}
          >
            <CheckCircle className="h-5 w-5" />
          </motion.div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 sm:p-6 md:p-6 lg:p-6 xl:p-6">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl font-bold mb-2 md:mb-2" style={{ color: ColorTheme.textPrimary }}>{theme.name}</h3>
        
        <p className="mb-4 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg" style={{ color: ColorTheme.textSecondary }}>
          {isExpanded ? theme.description : truncateDescription(theme.description)}
        </p>
        
        {/* Show More Button */}
        <motion.button
          className="flex items-center cursor-pointer gap-2 text-sm mb-4"
          onClick={() => handleCardClick(theme.id)}
          style={{ color: ColorTheme.primary }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </motion.button>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Features Section */}
            <div className="mb-4 sm:mb-6 md:mb-6 lg:mb-6 xl:mb-6">
              <h4 className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-sm font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>Features:</h4>
              <div className="flex flex-wrap gap-2">
                {theme.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: `1px solid ${ColorTheme.primary}30`,
                      color: ColorTheme.primary
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center md:items-center">
              <motion.button 
                className="flex items-center cursor-pointer gap-2 px-3 sm:px-4 md:px-4 py-2 md:py-2 rounded-lg font-medium transition-all w-full md:w-auto justify-center md:justify-start"
                style={{ 
                  backgroundColor: 'rgba(38, 38, 42, 0.8)',
                  color: ColorTheme.textPrimary
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(48, 48, 52, 0.8)',
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/portfolio')}
              >
                <GripHorizontalIcon className="h-4 w-4" />
                Preview
              </motion.button>
              
              <motion.button 
                className="flex items-center cursor-pointer gap-2 px-3 sm:px-4 md:px-4 py-2 md:py-2 rounded-lg font-medium transition-all w-full md:w-auto justify-center md:justify-start"
                style={{ 
                  background: `linear-gradient(to right, ${ColorTheme.primary}, ${ColorTheme.primaryDark})`,
                  color: '#000',
                  boxShadow: selectedTheme === theme.id ? `0 4px 14px ${ColorTheme.primaryGlow}` : 'none'
                }}
                whileHover={{ 
                  boxShadow: `0 6px 20px ${ColorTheme.primaryGlow}`,
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectTheme(theme.id)}
              >
                <MousePointer2 className="h-4 w-4" />
                {selectedTheme === theme.id ? 'Selected' : 'Select'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add this CSS for styling the line indicators */}
      <style jsx global>{`
        .custom-line-indicators {
          position: absolute;
          bottom: 40px; /* Adjusted to prevent overlap with arrows */
          display: flex !important;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style: none;
          z-index: 10;
        }
        
        .custom-line-indicators li {
          margin: 0 3px;
        }
        
        .slick-slider, .slick-list, .slick-track, .slick-slide, .slick-slide > div {
          height: 100%;
        }
      `}</style>
    </motion.div>
  );
};

export default ThemeCard;