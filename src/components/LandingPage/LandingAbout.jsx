import React from 'react';

export default function LandingAbout() {
    return (
        <section id="about" className="py-12 lg:py-16 bg-white dark:bg-gray-950 dark:text-gray-300 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column: Asymmetric Editorial Grid Layout */}
                    <div className="order-2 lg:order-1 relative">
                        {/* Soft Glow Background */}
                        <div className="absolute -inset-4 bg-brand-500/5 blur-3xl rounded-full pointer-events-none z-0" />
                        
                        <div className="relative grid grid-cols-12 gap-6 items-start">
                            {/* Main large image (top left - 8 columns) */}
                            <div className="col-span-8 overflow-hidden rounded-[32px] border border-gray-250/20 dark:border-gray-800/40 shadow-2xl hover:scale-[1.01] transition-transform duration-500 group">
                                <img 
                                    src="/images/home/properties8.webp" 
                                    alt="Resort Exterior" 
                                    className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                            </div>
                            
                            {/* Secondary side image (shifted down - 4 columns) */}
                            <div className="col-span-4 mt-12 overflow-hidden rounded-[24px] border border-gray-250/20 dark:border-gray-800/40 shadow-xl hover:scale-105 transition-transform duration-500 group">
                                <img 
                                    src="/images/home/properties6.webp" 
                                    alt="Villa Pool" 
                                    className="w-full h-64 sm:h-[300px] object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Typography & Double Details */}
                    <div className="order-1 lg:order-2">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                            About Us
                        </div>

                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 dark:text-white leading-tight tracking-tight">
                            We perfectly blend comfort and nature for your stay.
                        </h3>
                        
                        <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed dark:text-gray-400 font-medium">
                            Whether you're looking for an oceanfront villa, an urban luxury apartment, or a secluded cabin, we have meticulously curated the finest collection of properties worldwide.
                        </p>

                        {/* Two-Tier Benefit Rows */}
                        <div className="space-y-5 mb-8">
                            {[
                                { title: "Verified high-quality properties", desc: "Every stay inspected by our expert curations team." },
                                { title: "24/7 dedicated customer support", desc: "Always available to assist with bookings or changes." },
                                { title: "Best price guarantee", desc: "Unmatched pricing with zero hidden fees at checkout." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    {/* Emerald check badge */}
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 dark:text-emerald-400 mt-0.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-850 dark:text-white leading-none mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Verified Curation Profile row */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-150/60 dark:border-gray-850/60">
                            <img 
                                src="/images/user/user-03.jpg" 
                                alt="Head Curator" 
                                className="w-10 h-10 rounded-full object-cover border border-gray-250/20 dark:border-gray-800 shadow-sm"
                            />
                            <div>
                                <h4 className="text-xs font-bold text-gray-850 dark:text-white leading-none mb-0.5">Sarah Jenkins</h4>
                                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Head of Property Curation</p>
                            </div>
                            <span className="ml-auto text-[10px] font-black uppercase text-brand-600 bg-brand-600/5 px-2.5 py-1 rounded-lg border border-brand-600/10 tracking-widest">
                                Verified Curator
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
