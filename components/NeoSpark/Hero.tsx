'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquareIcon } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from './EditButton';


const Hero = ({currentPortTheme} : any) => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  const inTheme = portfolioData?.find((item : any) => item.type === "themes" )
  const theme = inTheme.data[currentPortTheme]

  const [badgeScope, animateBadge] = useAnimate();
  const [titleScope, animateTitle] = useAnimate();
  
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  
  useEffect(() => {
    if (portfolioData) {
      const heroSectionData = portfolioData.find((section: any) => section.type === "hero")?.data;
      if (heroSectionData) {
        setHeroData(heroSectionData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);
  
  useEffect(() => {
    if (!portfolioId || !heroData || isLoading) return;
    
    const badgeTexts = heroData?.badge?.texts || [];
    const intervalId = setInterval(() => {
      if (badgeScope.current && badgeTexts.length > 1) {
        animateBadge(badgeScope.current, { opacity: 0, y: 20 }, { duration: 0.3 });

        setTimeout(() => {
          setBadgeIndex((prev) => (prev + 1) % badgeTexts.length);
          if (badgeScope.current) {
            animateBadge(badgeScope.current, { opacity: 1, y: 0 }, { duration: 0.3 });
          }
        }, 300);
      }
    }, 3000);

    const titleTexts = heroData?.titleSuffixOptions || [];
    const titleIntervalId = setInterval(() => {
      if (titleScope.current && titleTexts.length > 1) {
        animateTitle(titleScope.current, { opacity: 0, y: 20 }, { duration: 0.3 });

        setTimeout(() => {
          setTitleIndex((prev) => (prev + 1) % titleTexts.length);
          if (titleScope.current) {
            animateTitle(titleScope.current, { opacity: 1, y: 0 }, { duration: 0.3 });
          }
        }, 300);
      }
    }, 4000);

    const subscription = supabase
      .channel(`portfolio-${portfolioId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'Portfolio', 
          filter: `id=eq.${portfolioId}` 
        }, 
        (payload) => {
          console.log('Portfolio update detected!', payload);
        }
      )
      .subscribe((status) => {
        console.log(`Supabase subscription status: ${status}`);
      });
      
    return () => {
      clearInterval(intervalId);
      clearInterval(titleIntervalId);
      subscription.unsubscribe();
    };
  }, [portfolioId, heroData, isLoading, badgeScope, titleScope, animateBadge, animateTitle]);

  if (isLoading || !heroData) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const badgeTexts = heroData.badge?.texts || [];
  const titleTexts = heroData.titleSuffixOptions || [];

  // Use badge color from theme
  const badgeColor = theme.colors.primary;
  const badgeTextColor = theme.colors.text.secondary;
  const accentColor = theme.colors.accent;
  const titleColor = theme.colors.primary;
  const buttonBgColor = theme.colors.primary;
  const buttonHoverBgColor = theme.colors.primaryHover;
  const buttonTextColor = theme.colors.text.primary;
  const buttonHoverTextColor = theme.colors.text.secondary;
  const mutedColor = theme.colors.states.muted;
  const scrollLineColor = theme.colors.background.secondary;

  return (
    <div className="relative flex-1 flex flex-col items-center mt-12 px-4 md:px-8">
      {heroData?.badge?.isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: badgeColor,
            color: badgeTextColor
          }}
          className="text-sm px-4 py-2 rounded-full inline-flex items-center mb-6"
        >
          <span style={{ 
            height: '0.5rem',
            width: '0.5rem',
            backgroundColor: accentColor,
            borderRadius: '9999px',
            marginRight: '0.5rem',
            animation: 'blink 1s infinite'
          }}></span>
          <span ref={badgeScope} className="text-sm">{badgeTexts[badgeIndex]}</span>
        </motion.div>
      )}

      <motion.h1 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-[66px] tracking-[-0.02em] font-bold text-center leading-snug md:leading-20"
      >
        Hi, I'm {heroData.name} <br />
        <span style={{ color: titleColor }}>
          {heroData.titlePrefix}<span ref={titleScope}> {titleTexts[titleIndex]}</span>.
        </span>
        <div className='absolute right-24 top-8'>
          <EditButton sectionName="hero" />
        </div>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-center mt-6 text-xl font-medium max-w-2xl"
        dangerouslySetInnerHTML={{ __html: heroData.summary }}
      >
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="flex items-center justify-center gap-6 mt-8"
      >
        {heroData?.actions?.map((item: any) => {
          return (
            <motion.div key={item.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={item.style}
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
                className="flex items-center gap-2 !px-7 py-5 cursor-pointer text-sm transition-colors"
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = buttonHoverBgColor;
                  e.currentTarget.style.color = buttonHoverTextColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = buttonBgColor;
                  e.currentTarget.style.color = buttonTextColor;
                }}
              >
                {item.label} <ArrowRight size={18} />
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 1 }}
        style={{ color: mutedColor }}
        className="mt-16 text-center"
      >
        <p>Scroll to explore</p>
        <motion.div 
          initial={{ height: 32 }}
          animate={{ height: 32 }}
          style={{ 
            width: '0.125rem', 
            backgroundColor: scrollLineColor,
            margin: '0.5rem auto 0 auto'
          }}
        ></motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Hero;