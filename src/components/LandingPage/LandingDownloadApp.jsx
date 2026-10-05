import React from 'react';
import Lottie from 'lottie-react';
import playstoreLottie from "../../lottie/playstore.json";
import appstoreLottie from "../../lottie/appstore.json";
import { ArrowRight, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function LandingDownloadApp() {
    return (
        <section id="download-app" className="relative py-16 lg:py-20 bg-gray-950 text-white overflow-hidden w-full transition-colors duration-300">

            {/* Background Image with Dark Gray Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/images/home/marvin-meyer-bfOQSDwEFg4-unsplash.webp"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-950/90" />
            </div>

            <div className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full bg-brand-600/10 blur-[130px] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-500/10 blur-[130px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-16 items-center">

                    {/* Left Column: Interactive Phone Mockup */}
                    <img src="/images/image/mockup3.png" alt="" className="" />
                    {/* Right Column: Copy Details and Lottie Stores */}
                    <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/15 border border-brand-600/25 text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-6 text-white">
                            Mobile App
                        </div>

                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                            Book your next stay on the go.
                        </h3>

                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium mb-8">
                            Search curated properties, manage bookings, check in digitally, and chat directly with our 24/7 dedicated concierge. Everything you need, pocket-sized.
                        </p>

                        {/* Features highlights list */}
                        <div className="space-y-4.5 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400">
                                    <Smartphone size={16} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-200">Push confirmation alerts for check-ins</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400">
                                    <ShieldCheck size={16} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-200">100% secure direct payments</span>
                            </div>
                        </div>

                        {/* App downloads store buttons */}
                        <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-white/10">
                            <a href="#" className="w-28 sm:w-36 h-auto hover:scale-105 active:scale-95 transition-transform duration-200">
                                <Lottie animationData={playstoreLottie} loop className="w-full h-full" />
                            </a>

                            <a href="#" className="w-28 sm:w-36 h-auto hover:scale-105 active:scale-95 transition-transform duration-200">
                                <Lottie animationData={appstoreLottie} loop className="w-full h-full" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
