import React from 'react';
import { HomeIcon, CalendarDaysIcon, CheckCircleIcon } from 'lucide-react';

export default function LandingFeatures() {
    const features = [
        {
            icon: <HomeIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
            title: "Premium Properties",
            description: "Browse our hand-picked selection of luxury villas, beachfront apartments, and cozy mountain cabins. We ensure every property meets the highest standards of luxury and comfort.",
            image: "/images/image/sideimage1.png"
        },
        {
            icon: <CalendarDaysIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
            title: "Instant Booking",
            description: "Real-time availability and instant confirmations so you can secure your perfect stay in seconds. Say goodbye to waiting for host approvals.",
            image: "/images/image/sideimage2.png"
        },
        {
            icon: <CheckCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
            title: "Verified Amenities",
            description: "Every property lists thoroughly verified amenities, ensuring you get exactly what you paid for. From high-speed Wi-Fi to private pools, we check it all.",
            image: "/images/image/sideimage3.png"
        }
    ];

    return (
        <section
            id="features"
            className="py-16 lg:py-24 bg-white dark:bg-gray-950 dark:border-gray-900 border-t border-gray-150/40 dark:border-gray-800/60 overflow-hidden transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-24">
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

                {/* Features Layout - Alternating Rows */}
                <div className="flex flex-col gap-16 lg:gap-24">
                    {features.map((feature, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                                {/* Text Content */}
                                <div className={`order-2 ${isEven ? 'md:order-1' : 'md:order-2'} flex flex-col justify-center`}>
                                    <div className="w-14 h-14 bg-brand-500/10 dark:bg-brand-400/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-500/20 shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-5 leading-tight">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-base lg:text-lg leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                                {/* Image Content */}
                                <div className={`order-1 ${isEven ? 'md:order-2' : 'md:order-1'} relative flex justify-center items-center py-10`}>

                                    {/* Decorative Solid Circle Background */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px] rounded-full z-0 pointer-events-none bg-[#7a0404]/5 dark:bg-[#7a0404]/20" />

                                    {/* Subtle pattern or border ring */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full border border-gray-200 dark:border-gray-800 z-0 pointer-events-none" />

                                    {/* Decorative glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none z-0" />

                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="relative z-10 w-full max-w-md lg:max-w-lg h-auto object-contain transition-transform duration-700 hover:-translate-y-2 hover:scale-[1.03] drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
