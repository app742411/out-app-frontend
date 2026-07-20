import React from 'react';
import { Search, MapPin, CalendarDays } from 'lucide-react';

export default function LandingHowItWorks() {
    const steps = [
        {
            title: "Search Property",
            desc: "Browse through our extensive list of villas, apartments, and hotels.",
            icon: Search,
            color: "text-pink-600 bg-pink-500/10 border-pink-500/20 dark:text-pink-400",
            badgeTag: "bg-pink-500/5 border-pink-500/10 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400"
        },
        {
            title: "Choose Location",
            desc: "Select the perfect location, whether it's by the sea or in the city.",
            icon: MapPin,
            color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400",
            badgeTag: "bg-indigo-500/5 border-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        },
        {
            title: "Book & Enjoy",
            desc: "Confirm your fast booking securely and enjoy an unforgettable stay.",
            icon: CalendarDays,
            color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
            badgeTag: "bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        }
    ];

    return (
        <section id="how-it-works" className="py-16 lg:py-20 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-purple-950/10 dark:via-gray-950 dark:to-blue-950/10 transition-colors duration-300 relative overflow-hidden">
            
            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -24;
                    }
                }
                .animate-dash {
                    stroke-dasharray: 8, 8;
                    animation: dash 15s linear infinite;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Section Header */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                    Fast & Easy
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-14 dark:text-white leading-tight tracking-tight">
                    Book your next stay in <span className="bg-gradient-to-r from-pink-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">3 simple steps</span>
                </h3>

                {/* Staggered Zigzag Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative max-w-5xl mx-auto">
                    
                    {/* SVG Zigzag Connecting Line (Desktop Only) */}
                    <svg 
                        className="hidden md:block absolute top-[18%] left-[15%] right-[15%] w-[70%] h-36 z-0 overflow-visible pointer-events-none opacity-45 dark:opacity-20" 
                        viewBox="0 0 100 100" 
                        preserveAspectRatio="none"
                    >
                        <path 
                            d="M 0,20 C 25,-15 25,85 50,80 C 75,85 75,-15 100,20" 
                            fill="none" 
                            stroke="url(#step-gradient)" 
                            strokeWidth="1.5" 
                            className="animate-dash"
                        />
                        <defs>
                            <linearGradient id="step-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="50%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div 
                                key={i} 
                                className={`relative z-10 flex flex-col items-center text-center p-6 sm:p-7 w-full max-w-[280px] mx-auto rounded-[32px] border border-gray-250/50 bg-white/70 dark:border-gray-800/40 dark:bg-gray-900/60 shadow-[0_12px_35px_rgba(0,0,0,0.015)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(70,95,255,0.03)] group ${
                                    i === 0 ? "md:-translate-y-6" :
                                    i === 1 ? "md:translate-y-6" : "md:-translate-y-6"
                                }`}
                            >
                                {/* Step tag */}
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-4.5 ${step.badgeTag}`}>
                                    Step {`0${i + 1}`}
                                </span>

                                {/* Icon Box */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4.5 border border-transparent shadow-xs transition-transform duration-350 group-hover:scale-105 ${step.color}`}>
                                    <Icon size={24} />
                                </div>

                                {/* Step Title */}
                                <h4 className="text-sm font-extrabold text-gray-850 mb-2.5 dark:text-white leading-none">
                                    {step.title}
                                </h4>

                                {/* Step Description */}
                                <p className="text-[11px] text-gray-500 text-center leading-relaxed dark:text-gray-400 font-medium max-w-[200px]">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
