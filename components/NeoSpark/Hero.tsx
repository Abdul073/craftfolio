'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquareIcon } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEdit } from '@/slices/editModeSlice';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from './EditButton';


const Hero = () => {
  const params = useParams();
  const portfolioId = params.portfolioId as string;
  const dispatch = useDispatch();
  
  const { portfolioData } = useSelector((state: RootState) => state.data);
  
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

  console.log(heroData?.badge?.color)

  return (
    <div className="relative flex-1 flex flex-col items-center mt-12 px-4 md:px-8">
    {heroData?.badge?.isVisible &&  <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{background : heroData?.badge?.color}}
        className={` text-white text-sm px-4 py-2 rounded-full inline-flex items-center mb-6`}
      >
        <span className="h-2 w-2 bg-[yellow] animate-caret-blink rounded-full mr-2"></span>
        <span ref={badgeScope} className="text-sm">{badgeTexts[badgeIndex]}</span>
      </motion.div>
}

      <motion.h1 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl md:text-6xl lg:text-[66px] tracking-[-0.02em] font-bold text-center leading-snug md:leading-20"
      >
        Hi, I'm {heroData.name} <br />
        <span className="text-green-500">{heroData.titlePrefix}<span ref={titleScope}> {titleTexts[titleIndex]}</span>.</span>
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
        {heroData?.actions?.map((item : any)=>{
          return(
            <motion.div key={item.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
          variant={item.style}
          className="flex bg-green-500 hover:bg-green-800 hover:text-white text-black items-center gap-2 !px-7 py-5 cursor-pointer text-sm transition-colors">
            {item.label} <ArrowRight size={18} />
          </Button>
        </motion.div>
          )
        })}

      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-16 text-center opacity-70"
      >
        <p>Scroll to explore</p>
        <motion.div 
          initial={{ height: 32 }}
          animate={{ height: 32 }}
          className="w-0.5 bg-white/50 mx-auto mt-2"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;