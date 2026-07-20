import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import GridShape from "../../components/common/GridShape";
import bgImage from "../../../public/images/home/properties8.webp";

const slides = [
  {
    title: "Manage Bookings",
    description: "Easily coordinate and audit property bookings, check real-time occupancy rates, and handle check-ins/check-outs seamlessly."
  },
  {
    title: "Monitor Users",
    description: "Supervise player profiles, track service provider verification states, and administer user privileges in real-time."
  },
  {
    title: "Secure Payouts",
    description: "Administer vendor withdrawal requests, track transactional billing logs, and optimize platform commission fee models."
  }
];

export default function AuthLayout({ children }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the slider every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex flex-col lg:flex-row w-full h-screen overflow-hidden dark:bg-gray-950 transition-colors duration-300">
      
      {/* Dynamic Keyframes for Laser Borders & Transitions */}
      <style>{`
        @keyframes scan-horizontal-forward {
          0% { left: -30%; }
          100% { left: 100%; }
        }
        @keyframes scan-vertical-forward {
          0% { top: -30%; }
          100% { top: 100%; }
        }
        @keyframes grid-pulse-effect {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
        @keyframes slide-in-fade {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-scan-h {
          position: absolute;
          width: 30%;
          height: 100%;
          animation: scan-horizontal-forward 5s linear infinite;
        }
        .animate-scan-v {
          position: absolute;
          height: 30%;
          width: 100%;
          animation: scan-vertical-forward 5s linear infinite;
        }
        .animate-slide-transition {
          animation: slide-in-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Back to Homepage Link - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 transition-colors duration-150"
        >
          <svg 
            className="w-3.5 h-3.5 stroke-current" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to homepage
        </Link>
      </div>

      {/* Left Column: Sign In Form with Resort BG and White Wash Overlay */}
      <div 
        className="relative flex items-center justify-center w-full h-full lg:w-1/2 bg-cover bg-center px-4 sm:px-8 z-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* White wash overlay for contrast */}
        <div className="absolute inset-0 bg-white/97 dark:bg-gray-950/97 z-0 transition-colors duration-300" />
        
        {/* Form Container */}
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right Column: Dark Slider Banner with Grid Pattern and Scan lasers */}
      <div
        className="relative flex items-center justify-center hidden w-full h-full lg:w-1/2 lg:flex bg-cover bg-center px-12 border-l border-white/5 overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark mask overlay */}
        <div className="absolute inset-0 bg-gray-950/85 z-0" />

        {/* Animated Glowing Borders */}
        {/* Top border beam */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden bg-transparent z-10">
          <div className="bg-gradient-to-r from-transparent via-brand-600 to-transparent animate-scan-h" />
        </div>

        {/* Bottom border beam */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden bg-transparent z-10">
          <div className="bg-gradient-to-r from-transparent via-brand-600 to-transparent animate-scan-h" style={{ animationDelay: '2.5s' }} />
        </div>

        {/* Left border beam */}
        <div className="absolute top-0 bottom-0 left-0 w-[1.5px] overflow-hidden bg-transparent z-10">
          <div className="bg-gradient-to-b from-transparent via-brand-600 to-transparent animate-scan-v" style={{ animationDelay: '1.25s' }} />
        </div>

        {/* Right border beam */}
        <div className="absolute top-0 bottom-0 right-0 w-[1.5px] overflow-hidden bg-transparent z-10">
          <div className="bg-gradient-to-b from-transparent via-brand-600 to-transparent animate-scan-v" style={{ animationDelay: '3.75s' }} />
        </div>

        {/* Pulsing Grid shape background */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-1" 
          style={{ animation: 'grid-pulse-effect 6s ease-in-out infinite' }}
        >
          <GridShape />
        </div>

        {/* Glassmorphic Slider Card */}
        <div className="absolute bottom-12 left-12 right-12 z-10 max-w-xl bg-gray-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-white shadow-2xl text-left space-y-5">
          {/* Top Brand Logo Overlay */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-red-500 border border-white/25 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Slide Content Area */}
          <div key={currentSlide} className="space-y-3 animate-slide-transition">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight md:text-5xl font-sans bg-clip-text bg-gradient-to-r from-white via-white to-gray-200">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed font-medium">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Slider Navigation Indicator Dots */}
          <div className="flex justify-start items-center gap-2 pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-hidden ${
                  currentSlide === idx ? "w-7 bg-brand-600 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "w-2 bg-white/35 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
