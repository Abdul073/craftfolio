import React, { useState } from 'react';
import { motion } from "framer-motion";
import Slider from "react-slick";
import { ColorTheme } from '@/lib/colorThemes';
import { CheckCircle, GripHorizontalIcon, MousePointer2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    previewImageUrl: string;
    features: string[];
  };
  handleSelectTheme: (id: number) => void;
  selectedTheme: number;
}

const PrevArrow: React.FC<{ className?: string; style?: React.CSSProperties; onClick?: () => void }> = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-2 z-10 cursor-pointer bg-black bg-opacity-50 rounded-full p-1"
      style={{ ...style, transform: 'translateY(-50%)' }}
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
      className="absolute top-1/2 right-2 z-10 cursor-pointer bg-black bg-opacity-50 rounded-full p-1"
      style={{ ...style, transform: 'translateY(-50%)' }}
      onClick={onClick}
    >
      <ChevronRight size={20} color={ColorTheme.primary} />
    </div>
  );
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, handleSelectTheme, selectedTheme }) => {
  const router = useRouter();
  
  // State to track current slide index
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  const [images] = useState([
    theme.previewImageUrl,
    theme.previewImageUrl, // Using the same URL for demo purposes
    theme.previewImageUrl  // Using the same URL for demo purposes
  ]);

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

  return (
    <motion.div 
      className="rounded-xl overflow-hidden transition-all h-full"
      variants={fadeInScale}
      style={{ 
        backgroundColor: ColorTheme.bgCard,
        backdropFilter: "blur(12px)",
        border: `1px solid ${selectedTheme === theme.id ? ColorTheme.primary : ColorTheme.borderLight}`,
        boxShadow: selectedTheme === theme.id ? `0 0 20px ${ColorTheme.primaryGlow}` : 'none'
      }}
      whileHover={{ 
        boxShadow: `0 8px 30px rgba(0,0,0,0.12), 0 4px 15px ${ColorTheme.primaryGlow}`,
        // borderColor: `${ColorTheme.primary}50`
      }}
    >
      {/* Image Section with Slider */}
      <div className="h-64 relative overflow-hidden group">
        <Slider {...sliderSettings} className="h-full">
          {images.map((image, index) => (
            <div key={index} className="h-64">
              <img
                src={image}
                alt={`${theme.name} theme preview ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500"
              />
            </div>
          ))}
        </Slider>
        
        <div 
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium z-10"
          style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: `1px solid ${ColorTheme.primary}`,
            color: ColorTheme.primary,
            backdropFilter: 'blur(8px)'
          }}
        >
          {theme.category}
        </div>
        
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
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2" style={{ color: ColorTheme.textPrimary }}>{theme.templateName}</h3>
        <p className="mb-4" style={{ color: ColorTheme.textSecondary }}>{theme.description}</p>
        
        {/* Features Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2" style={{ color: ColorTheme.textPrimary }}>Features:</h4>
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
        <div className="flex justify-between items-center">
          <motion.button 
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-all"
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
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-all"
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
      </div>

      {/* Add this CSS for styling the line indicators */}
      <style jsx global>{`
        .custom-line-indicators {
          position: absolute;
          bottom: 15px;
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