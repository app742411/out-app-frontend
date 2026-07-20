import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';

export default function LandingHeader({ isDarkMode }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = ['about', 'services', 'how-it-works', 'why-us', 'faq'];
        
        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        });

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-250/50 dark:border-gray-800/60 shadow-xs"
                    : "bg-transparent border-b border-transparent shadow-none"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? "h-16" : "h-22"}`}>
                    
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="transition-transform duration-300 hover:scale-105 active:scale-95">
                            <img 
                                className={`w-auto transition-all duration-300 ${scrolled ? 'h-10' : 'h-13.5'}`} 
                                src={isDarkMode ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png"} 
                                alt="Logo" 
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
                        {['About', 'Services', 'How it works', 'Why Us', 'FAQ'].map((item) => {
                            const sectionId = item.toLowerCase().replace(/ /g, '-');
                            const hash = '#' + sectionId;
                            const isActive = activeSection === sectionId;
                            return (
                                <a 
                                    key={item}
                                    href={hash} 
                                    className={`relative text-sm font-semibold transition-all duration-200 py-2 group ${
                                        isActive 
                                            ? "text-brand-500 dark:text-brand-400" 
                                            : "text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400"
                                    }`}
                                >
                                    {item}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-500 dark:bg-brand-400 transition-all duration-300 ${
                                        isActive ? "w-full" : "w-0 group-hover:w-full"
                                    }`} />
                                </a>
                            );
                        })}
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center space-x-5">
                        {localStorage.getItem("token") ? (
                            <Link 
                                to="/dashboard" 
                                className="hidden sm:inline-block text-sm font-semibold text-gray-600 dark:text-gray-350 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link 
                                to="/signin" 
                                className="hidden sm:inline-block text-sm font-semibold text-gray-600 dark:text-gray-350 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                                Member Sign In
                            </Link>
                        )}
                        <Link 
                            to="/contact-us" 
                            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all duration-150 active:scale-95 shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 whitespace-nowrap uppercase tracking-wider"
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 dark:text-gray-355 hover:text-brand-500 focus:outline-none p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                    
                </div>
            </div>

            {/* Mobile Dropdown Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-250 dark:border-gray-800 p-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
                    <nav className="flex flex-col space-y-3.5">
                        {['About', 'Services', 'How it works', 'Why Us', 'FAQ'].map((item) => {
                            const sectionId = item.toLowerCase().replace(/ /g, '-');
                            const hash = '#' + sectionId;
                            const isActive = activeSection === sectionId;
                            return (
                                <a 
                                    key={item}
                                    href={hash} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-bold transition-all py-1.5 px-3 rounded-lg ${
                                        isActive 
                                            ? "text-brand-500 bg-brand-500/5 dark:text-brand-400 dark:bg-brand-500/10" 
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                    }`}
                                >
                                    {item}
                                </a>
                            );
                        })}
                        <hr className="border-gray-100 dark:border-gray-800 my-1" />
                        {localStorage.getItem("token") ? (
                            <Link 
                                to="/dashboard" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-bold text-gray-600 dark:text-gray-300 py-1.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link 
                                to="/signin" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm font-bold text-gray-600 dark:text-gray-355 py-1.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                            >
                                Member Sign In
                            </Link>
                        )}
                        <Link 
                            to="/contact-us" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="inline-flex items-center justify-center w-full py-2.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all shadow-md shadow-brand-500/25 uppercase tracking-wider"
                        >
                            Contact Us
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
