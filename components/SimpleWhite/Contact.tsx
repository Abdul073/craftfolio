import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

const Contact = () => {

    const params = useParams();
    const portfolioId = params.portfolioId as string;

    const { portfolioData } = useSelector((state: RootState) => state.data);

    const [isLoading, setIsLoading] = useState(true);
    const [heroData, setHeroData] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        if (portfolioData) {
            const heroSectionData = portfolioData?.find((section: any) => section.type === "hero")?.data;
            const userInfoData = portfolioData?.find((section: any) => section.type === "userInfo")?.data;

            if (userInfoData) {
                setUserInfo(userInfoData);
            }

            if (heroSectionData) {
                setHeroData(heroSectionData);
            } else {
                setHeroData({
                    name: "John Doe",
                    title: "Full Stack Developer",
                    summary: "I build exceptional and accessible digital experiences for the web.",
                    shortSummary: "I build exceptional and accessible digital experiences for the web.",
                });
            }
            setIsLoading(false);
        }
    }, [portfolioData]);

    useEffect(() => {
        if (!portfolioId || isLoading) return;

        const subscription = supabase
            .channel(`portfolio-contact-${portfolioId}`)
            .on('postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'Portfolio',
                    filter: `id=eq.${portfolioId}`
                },
                (payload) => {
                    // console.log('Portfolio update detected!', payload);
                }
            )
            .subscribe((status) => {
                // console.log(`Supabase subscription status: ${status}`);
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [portfolioId, isLoading]);


    return (
        <footer className="w-full bg-white text-black mx-auto px-4 py-8">
            {/* Divider line */}
            <div className="border-t border-gray-200 mb-8"></div>

            <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto items-start md:items-start">
                {/* Left section - Name */}
                <div className="mb-4 md:mb-0">
                    <h2 className="text-3xl font-bold">
                        {heroData?.name || "John Doe"}
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-md">
                        {userInfo?.shortSummary || "I build exceptional and accessible digital experiences for the web."}
                    </p>
                </div>

                {/* Middle section - Quick Links */}
                <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium mb-3">Quick Links</h3>
                    <nav>
                        <ul className="space-y-2">
                            <li><a href="#about" className="text-gray-600 hover:text-gray-900">About Me</a></li>
                            <li><a href="#projects" className="text-gray-600 hover:text-gray-900">Projects</a></li>
                            <li><a href="#skills" className="text-gray-600 hover:text-gray-900">Skills</a></li>
                            <li><a href="#experience" className="text-gray-600 hover:text-gray-900">Experience</a></li>
                        </ul>
                    </nav>
                </div>

                {/* Right section - Connect */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Connect</h3>
                    <div className="flex space-x-4">
                        <a
                            href={userInfo?.linkedin}
                            className="text-gray-600 hover:text-gray-900">GitHub</a>
                        <a
                            href={userInfo?.linkedin}
                            className="text-gray-600 hover:text-gray-900">LinkedIn</a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-sm mt-8">
                © 2025 John Doe. All rights reserved.
            </div>
        </footer>
    );
};

export default Contact;