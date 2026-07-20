import React from 'react';
import { Home, Compass, Car, ArrowRight } from 'lucide-react';

const services = [
    {
        icon: Home,
        title: "Bespoke Stays",
        desc: "Rent hand-picked villas, beachfront apartments, and premium mountain resorts.",
        features: ["Verified Listings", "Private Pools", "Dedicated Staff"],
        image: "/images/home/properties2.webp",
        color: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400"
    },
    {
        icon: Compass,
        title: "Curated Tours",
        desc: "Book sea cruises, historical tours, and premium local guides in Mediterranean hotspots.",
        features: ["Expert Guides", "Private Yacht Charters", "Skip-the-line Tickets"],
        image: "/images/home/properties3.webp",
        color: "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400"
    },
    {
        icon: Car,
        title: "Premium Transport",
        desc: "Rent luxury sport cars, electric SUVs, or book dedicated airport chauffeur pickups.",
        features: ["Luxury Car Fleet", "Professional Drivers", "Instant Confirmations"],
        image: "/images/home/properties4.webp",
        color: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400"
    }
];

export default function LandingServices() {
    return (
        <section id="services" className="py-12 lg:py-16 bg-white dark:bg-gray-950 dark:text-gray-300 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                        Our Services
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 dark:text-white leading-tight tracking-tight">
                        Exquisite offerings for your comfort.
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base dark:text-gray-400 font-medium leading-relaxed">
                        We go beyond just property bookings to curate the complete luxury holiday experience.
                    </p>
                </div>

                {/* Services Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                            <div 
                                key={idx} 
                                className="group relative flex flex-col rounded-[32px] overflow-hidden border border-gray-250/60 bg-white/70 dark:border-gray-800/40 dark:bg-gray-900/60 shadow-[0_12px_35px_rgba(0,0,0,0.015)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(70,95,255,0.03)] cursor-pointer"
                            >
                                {/* Photo Header with overlay */}
                                <div className="h-48 overflow-hidden relative border-b border-gray-150/40 dark:border-gray-800/40">
                                    <img 
                                        src={service.image} 
                                        alt={service.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />
                                    {/* Icon Capsule */}
                                    <div className={`absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-xl border backdrop-blur-md shadow-md ${service.color}`}>
                                        <Icon size={18} />
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                                    <h4 className="text-lg font-black text-gray-850 dark:text-white mb-2 leading-none">
                                        {service.title}
                                    </h4>
                                    
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
                                        {service.desc}
                                    </p>

                                    {/* Feature Bullets list */}
                                    <ul className="space-y-2.5 mb-8 flex-1">
                                        {service.features.map((feat, fidx) => (
                                            <li key={fidx} className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-350">
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Small link arrow */}
                                    <div className="flex items-center gap-1.5 text-xs font-black text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-wider mt-auto group/btn">
                                        Explore More
                                        <ArrowRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
