import { useEffect, useState } from 'react';
import {
  SiMongodb,
  SiExpress,
  SiNodedotjs,
  SiReact,
  SiNextdotjs,
  SiVercel,
  SiPython,
  SiMysql,
  SiTypescript,
  SiGraphql
} from 'react-icons/si';
import { FaAws, FaJava } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentEdit } from '@/slices/editModeSlice';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import EditButton from './EditButton';

const Technologies = () => {


  interface Technology {
    name: string;
    logo: string;
  }

  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [technologiesData, setTechnologiesData] = useState<Technology[]>([]);

  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state: RootState) => state.data);

  const params = useParams();
  const portfolioId = params.portfolioId as string;
  useEffect(() => {
    if (portfolioData) {
      const techData = portfolioData.find((section: any) => section.type === "technologies")?.data;
      if (techData) {
        setTechnologiesData(techData);
        setIsLoading(false);
      }
    }
  }, [portfolioData]);

  useEffect(() => {

    const subscription = supabase
      .channel(`portfolio-tech-${portfolioId}`)
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
      subscription.unsubscribe();
    };


  }, [portfolioId, technologiesData])

  const handleSectionEdit = () => {
    dispatch(setCurrentEdit("technologies"));
  };


  if (isLoading || !technologiesData) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className={`py-16 text-white`}>
<div className='max-w-4xl mx-auto'>
  
<div className="container block relative mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-center text-green-400">My Tech Stack</h1>
        <p className="text-xl text-gray-300 text-center mb-16">
          Technologies I Worked On.
        </p>
        <EditButton  sectionName="technologies"/>

      </div>
</div>


      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex flex-nowrap overflow-hidden max-w-[80%] mx-auto">
          <Marquee pauseOnHover={isPaused} loop={0} speed={100} direction="left">
            {technologiesData.map((tech, index) => (
              <div key={`tech-${index}`} className="flex-none mx-4">
                <div className="bg-stone-800/80 peer cursor-pointer
                     hover:bg-gradient-to-br from-green-400/70 to-stone-900
                      rounded-xl py-6 px-8 border border-transparent
                       hover:border-green-400 flex flex-col items-center
                        justify-center transition-all duration-300 ease-in shadow${index+1}
                        shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20">
                  <img src={tech.logo} alt={tech.name} className="w-12 h-12" />
                </div>
                <p className="font-medium text-center mt-2 text-white peer-hover:font-semibold peer-hover:text-green-400">{tech.name}</p>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Technologies;