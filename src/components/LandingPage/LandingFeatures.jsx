import React from 'react';
import { HomeIcon, CalendarDaysIcon, CheckCircleIcon } from 'lucide-react';

export default function LandingFeatures() {
    const features = [
        {
            icon: <HomeIcon className="w-5.5 h-5.5 text-white" />,
            title: "Premium Properties",
            description: "Browse our hand-picked selection of luxury villas, beachfront apartments, and cozy mountain cabins.",
            image: "/images/home/properties9.webp"
        },
        {
            icon: <CalendarDaysIcon className="w-5.5 h-5.5 text-white" />,
            title: "Instant Booking",
            description: "Real-time availability and instant confirmations so you can secure your perfect stay in seconds.",
            image: "/images/home/booking.webp"
        },
        {
            icon: <CheckCircleIcon className="w-5.5 h-5.5 text-white" />,
            title: "Verified Amenities",
            description: "Every property lists thoroughly verified amenities, ensuring you get exactly what you paid for.",
            image: "/images/home/amenties.webp"
        }
    ];

    return (
        <section
            id="features"
            className="py-12 lg:py-16 bg-white dark:bg-gray-950 dark:border-gray-900 border-t border-gray-150/40 dark:border-gray-800/60 overflow-hidden transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                        Our Platform
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 dark:text-white leading-tight tracking-tight">
                        Everything you need for the perfect trip.
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base dark:text-gray-400 font-medium leading-relaxed">
                        We provide an end-to-end booking experience tailored specifically for luxury comfort, reliability, and value.
                    </p>
                </div>

                {/* Features Grid - Updated to 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative h-[420px] rounded-[32px] overflow-hidden border border-gray-250/20 dark:border-gray-800/40 shadow-xl hover:shadow-[0_20px_50px_rgba(70,95,255,0.03)] bg-gray-950 transition-all duration-500 overflow-visible"
                        >
                            {/* Zooming background image */}
                            <img 
                                src={feature.image} 
                                alt={feature.title} 
                                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                            />

                            {/* Mask overlay for text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/35 to-transparent z-10 transition-all duration-300 group-hover:from-gray-950 group-hover:via-gray-950/50" />

                            <div className="relative h-full flex flex-col justify-between p-6 sm:p-7 z-20 text-white">
                                {/* Icon at top */}
                                <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500 group-hover:border-transparent">
                                    {feature.icon}
                                </div>

                                {/* Text Content Area */}
                                <div className="transition-all duration-300">
                                    <h4 className="text-base sm:text-lg font-black leading-snug text-white">
                                        {feature.title}
                                    </h4>
                                    
                                    {/* Reveal-on-hover Description */}
                                    <p className="text-xs text-gray-300 leading-relaxed font-medium transition-all duration-300 opacity-0 max-h-0 translate-y-3 group-hover:opacity-100 group-hover:max-h-20 group-hover:translate-y-0 group-hover:mt-2.5 overflow-hidden">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
