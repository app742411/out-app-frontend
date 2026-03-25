import React from 'react';
import { HomeIcon, CalendarDaysIcon, CheckCircleIcon, TicketIcon } from 'lucide-react';

export default function LandingFeatures() {
    const features = [
        {
            icon: <HomeIcon className="w-7 h-7 text-white" />,
            title: "Premium Properties",
            description: "Browse our hand-picked selection of luxury villas, beachfront apartments, and cozy mountain cabins.",
            image: "/images/home/properties9.webp",
            delay: "100"
        },
        {
            icon: <CalendarDaysIcon className="w-7 h-7 text-white" />,
            title: "Instant Booking",
            description: "Real-time availability and instant confirmations so you can secure your perfect stay in seconds.",
            image: "/images/home/booking.webp",
            delay: "200"
        },
        {
            icon: <CheckCircleIcon className="w-7 h-7 text-white" />,
            title: "Verified Amenities",
            description: "Every property lists thoroughly verified amenities, ensuring you get exactly what you paid for.",
            image: "/images/home/amenties.webp",
            delay: "300"
        },
        {
            icon: <TicketIcon className="w-7 h-7 text-white" />,
            title: "Exclusive Coupons",
            description: "Apply specialized digital coupons directly at checkout for unmatched discounts on premium stays.",
            image: "/images/home/sale.webp",
            delay: "400"
        }
    ];

    return (
        <section
            id="features"
            className="py-24 bg-white dark:bg-gray-900 dark:border-gray-800 border-t border-gray-100 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-500 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">
                        Our Platform
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                        Everything you need for the perfect trip.
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg dark:text-gray-400">
                        We provide an end-to-end booking experience tailored specifically for luxury comfort, reliability, and value.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative h-96 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                            style={{
                                backgroundImage: `url(${feature.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Gradient overlay for better readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                            <div className="relative h-full flex flex-col justify-between p-6 text-white">
                                {/* Icon at top */}
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>

                                {/* Text content at bottom */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-2 leading-snug">
                                        {feature.title}
                                    </h4>
                                    <p className="text-sm text-gray-200 leading-relaxed">
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