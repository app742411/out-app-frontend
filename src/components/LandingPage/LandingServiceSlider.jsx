import React from 'react';

const sliderServices = [
    { name: "Spa", image: "/images/home/service_spa_1791200955874.jpg" },
    { name: "Photography", image: "/images/home/service_photography_1791200993260.jpg" },
    { name: "Catering", image: "/images/home/service_catering_1791201007013.jpg" },
    { name: "Hair Cut", image: "/images/home/service_haircut_1791201017799.jpg" },
    { name: "Beauty", image: "/images/home/service_beauty_1791201031174.jpg" },
    { name: "Massage", image: "/images/home/service_massage_1791201044650.jpg" }
];

export default function LandingServiceSlider() {
    return (
        <section className="py-12 lg:py-16 bg-white dark:bg-gray-950 overflow-hidden border-t border-gray-150/40 dark:border-gray-800/60">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .animate-scroll {
                    display: flex;
                    width: max-content;
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#7a0404]/5 border border-[#7a0404]/10 text-[#7a0404] dark:text-[#7a0404]/80 font-bold text-[10px] uppercase tracking-widest mb-4">
                            Premium Services
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                            Enhance your experience
                        </h3>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden w-full">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

                    <div className="animate-scroll gap-4 sm:gap-6">
                        {[...sliderServices, ...sliderServices].map((service, index) => (
                            <div key={index} className="w-[240px] sm:w-[280px] shrink-0 group cursor-pointer relative rounded-[28px] overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-300">
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
                                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">{service.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
