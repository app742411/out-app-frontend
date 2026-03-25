
import React from 'react';

export default function LandingHowItWorks() {
    const steps = [
        {
            title: "Search Property",
            desc: "Browse through our extensive list of villas, apartments, and hotels.",
            icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            bg: "from-pink-500 to-rose-500"
        },
        {
            title: "Choose Location",
            desc: "Select the perfect location, whether it's by the sea or in the city.",
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
            bg: "from-indigo-500 to-blue-500"
        },
        {
            title: "Book & Enjoy",
            desc: "Confirm your fast booking securely and enjoy an unforgettable stay.",
            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            bg: "from-emerald-500 to-teal-500"
        }
    ];

    return (
        <section id="how-it-works" className="py-28 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-blue-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-brand-500 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-4">
                    Fast & Easy
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-20 dark:text-white">
                    Book your next stay in <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">3 simple steps</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-14 relative">
                    {/* Gradient Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-1 bg-gradient-to-r from-pink-400 via-indigo-400 to-emerald-400 rounded-full opacity-40"></div>

                    {steps.map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center group">
                            {/* Icon Card */}
                            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.bg} shadow-xl flex items-center justify-center text-white mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2`}>
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={step.icon} />
                                </svg>
                            </div>

                            {/* Title */}
                            <h4 className="text-xl font-bold text-gray-900 mb-3 dark:text-white">
                                {step.title}
                            </h4>

                            {/* Description */}
                            <p className="text-gray-600 text-center max-w-xs leading-relaxed dark:text-gray-400">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}