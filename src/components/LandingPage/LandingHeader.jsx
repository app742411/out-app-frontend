import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function LandingHeader({ isDarkMode }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled
                ? "top-4 w-[95%] max-w-7xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border border-gray-200/50 dark:border-gray-800/50 rounded-2xl"
                : "top-0 w-full max-w-full rounded-none bg-transparent"
            }`}>
            <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? "max-w-7xl" : "max-w-7xl"}`}>
                <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-16" : "h-24"}`}>
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/">
                            <img className={`w-auto transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`} src={isDarkMode ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"} alt="Logo" />
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">About</a>
                        <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">How it works</a>
                        <a href="#why-us" className="text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">Why Us</a>
                    </nav>
                    <div className="flex items-center space-x-3 md:space-x-5">
                        {localStorage.getItem("token") ? (
                            <Link to="/dashboard" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">Dashboard</Link>
                        ) : (
                            <Link to="/signin" className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 font-medium transition-colors">Member Sign In</Link>
                        )}
                        <Link to="/contact-us" className="bg-brand-500 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg font-medium hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 whitespace-nowrap">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
