import React, { useState, useEffect } from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingHero from '../components/LandingPage/LandingHero';
import LandingStats from '../components/LandingPage/LandingStats';
import LandingAbout from '../components/LandingPage/LandingAbout';
import LandingHowItWorks from '../components/LandingPage/LandingHowItWorks';
import LandingFeatures from '../components/LandingPage/LandingFeatures';
import LandingComparison from '../components/LandingPage/LandingComparison';
import LandingReviews from '../components/LandingPage/LandingReviews';
import LandingFooter from '../components/LandingPage/LandingFooter';
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";

import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="font-sans text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900 relative overflow-hidden w-full transition-colors duration-300">
            <LandingHeader isDarkMode={isDarkMode} />
            <LandingHero setIsHovering={setIsHovering} />
            <LandingStats />
            <LandingAbout />
            <LandingHowItWorks />
            <LandingFeatures />
            <LandingComparison />
            <LandingReviews />
            <LandingFooter />
            <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                <ThemeTogglerTwo />
            </div>
        </div>
    );
};

export default LandingPage;
