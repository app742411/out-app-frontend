import React from 'react';
import { Search, MapPin, CalendarDays, Sparkles } from 'lucide-react';

export default function LandingHowItWorks() {
    const steps = [
        {
            title: "Search Property",
            desc: "Browse our exclusive list of luxury villas, apartments, and premium hotels globally.",
            icon: Search,
        },
        {
            title: "Choose Location",
            desc: "Select the perfect location, whether it's by the sea or in the bustling city center.",
            icon: MapPin,
        },
        {
            title: "Premium Services",
            desc: "Enhance your stay by adding bespoke services like a private chef or chauffeur.",
            icon: Sparkles,
        },
        {
            title: "Book & Enjoy",
            desc: "Confirm your booking securely and get ready for an unforgettable stay.",
            icon: CalendarDays,
        }
    ];

    return (
        <section id="how-it-works" className="py-16 lg:py-24 bg-white dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden border-t border-gray-150/40 dark:border-gray-800/60">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Section Header */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#7a0404]/5 border border-[#7a0404]/10 text-[#7a0404] dark:text-[#7a0404]/80 font-bold text-[10px] uppercase tracking-widest mb-5">
                    Fast & Easy
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-16 lg:mb-20 dark:text-white leading-tight tracking-tight">
                    Book your next stay in <span className="text-[#7a0404]">4 simple steps</span>
                </h3>

                {/* Clean Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative">
                    
                    {/* Horizontal Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-[125px] left-[12%] right-[12%] border-t-[2px] border-dashed border-[#7a0404]/20 dark:border-[#7a0404]/40 z-0" />
                    
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div 
                                key={i} 
                                className="relative z-10 flex flex-col items-center text-center p-8 w-full rounded-[32px] border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(122,4,4,0.08)] group"
                            >
                                {/* Step tag */}
                                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#7a0404]/5 text-[#7a0404] dark:bg-[#7a0404]/20 dark:text-[#7a0404]/80 mb-6 border border-[#7a0404]/10">
                                    Step {`0${i + 1}`}
                                </span>

                                {/* Icon Box */}
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#7a0404]/5 dark:group-hover:bg-[#7a0404]/20 text-gray-400 group-hover:text-[#7a0404]">
                                    <Icon size={28} strokeWidth={1.5} />
                                </div>

                                {/* Step Title */}
                                <h4 className="text-lg font-extrabold text-gray-900 mb-3 dark:text-white leading-none">
                                    {step.title}
                                </h4>

                                {/* Step Description */}
                                <p className="text-sm text-gray-500 text-center leading-relaxed dark:text-gray-400 font-medium">
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
