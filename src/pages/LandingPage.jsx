import React, { useState, useEffect } from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingHero from '../components/LandingPage/LandingHero';
import LandingAbout from '../components/LandingPage/LandingAbout';
import LandingStats from '../components/LandingPage/LandingStats';
import LandingServices from '../components/LandingPage/LandingServices';
import LandingHowItWorks from '../components/LandingPage/LandingHowItWorks';
import LandingFeatures from '../components/LandingPage/LandingFeatures';
import LandingComparison from '../components/LandingPage/LandingComparison';
import LandingDownloadApp from '../components/LandingPage/LandingDownloadApp';
import LandingReviews from '../components/LandingPage/LandingReviews';
import LandingFaq from '../components/LandingPage/LandingFaq';
import LandingFooter from '../components/LandingPage/LandingFooter';
import { ArrowUp } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleScrollButton = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScrollButton);
        return () => window.removeEventListener('scroll', handleScrollButton);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="font-sans text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900 relative overflow-hidden w-full transition-colors duration-300">
            <LandingHeader isDarkMode={isDarkMode} />
            <LandingHero setIsHovering={setIsHovering} />
            <LandingAbout />
            <LandingStats />
            <LandingServices />
            <LandingHowItWorks />
            <LandingFeatures />
            <LandingComparison />
            <LandingDownloadApp />
            <LandingReviews />
            <LandingFaq />
            <LandingFooter />

            {/* Back to Top floating button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-white/90 dark:bg-gray-900/90 border border-gray-250 dark:border-gray-800/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-108 active:scale-95 hover:bg-brand-500 hover:text-white hover:border-transparent cursor-pointer animate-in fade-in slide-in-from-bottom-5 duration-350"
                    aria-label="Back to top"
                >
                    <ArrowUp size={18} strokeWidth={2.5} className="animate-bounce" />
                </button>
            )}
        </div>
    );
};

export default LandingPage;
