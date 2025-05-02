import { useState, useEffect } from 'react';
import { Loader2, Palette, Layout, Image, Code, CheckCircle } from 'lucide-react';

export default function LoadingSpinner() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  const loadingMessages = [
    { text: 'Loading themes', icon: Palette },
    { text: 'Processing assets', icon: Image },
    { text: 'Almost there', icon: CheckCircle }
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        prevIndex === loadingMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  // Animate dots every 500ms
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  const { text, icon: Icon } = loadingMessages[currentMessageIndex];

  return (
    <div className="fixed inset-0 main-bg-noise flex items-center justify-center ">
      <div className="bg-transparent p-8 rounded-lg flex flex-col items-center">
        <div className="relative mb-4">
          {/* Main spinner */}
          <Loader2 
            className="h-16 w-16 text-emerald-500 animate-spin" 
            style={{ color: '#10b981' }}
          />
          
          {/* Secondary icon that changes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon 
              className="h-8 w-8 opacity-90" 
              style={{ color: '#10b981' }}
            />
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-xl font-medium text-white">CraftFolio</div>
          <div className="flex items-center justify-center mt-2">
            <span className="text-white">{text}{dots}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-3 bg-white bg-opacity-20 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full rounded-full animate-pulse"
            style={{ 
              width: `${(currentMessageIndex + 1) * 20}%`,
              backgroundColor: '#10b981'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}