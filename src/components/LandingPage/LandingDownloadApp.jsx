import React from 'react';
import Lottie from 'lottie-react';
import playstoreLottie from "../../lottie/playstore.json";
import appstoreLottie from "../../lottie/appstore.json";
import { ArrowRight, Sparkles, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function LandingDownloadApp() {
    return (
        <section id="download-app" className="relative py-16 lg:py-20 bg-gray-950 text-white overflow-hidden w-full transition-colors duration-300">
            
            {/* HTML5 video loop background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-25"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-swimming-pool-and-palm-trees-32863-large.mp4" type="video/mp4" />
                </video>
                {/* Visual dark overlays for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#030712_90%)]" />
            </div>

            {/* Glowing neon ambient lights */}
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 rounded-full bg-brand-600/10 blur-[130px] pointer-events-none z-0" />
            <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 rounded-full bg-blue-500/10 blur-[130px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-16 items-center">
                    
                    {/* Left Column: Interactive Phone Mockup */}
                    <div className="flex justify-center items-center relative">
                        {/* Stylized Phone Frame */}
                        <div className="relative w-64 h-[500px] rounded-[40px] border-8 border-gray-800 bg-gray-950 shadow-2xl overflow-hidden [perspective:800px] group">
                            {/* Speaker notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-800 rounded-b-2xl z-30" />
                            
                            {/* Simulated App UI Content */}
                            <div className="p-4 pt-8 h-full flex flex-col justify-between relative bg-slate-900/40">
                                {/* Header */}
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-black tracking-widest text-brand-400">OUT STAYS</span>
                                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-gray-300">★</span>
                                </div>

                                {/* Search mock bar */}
                                <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] text-gray-400 flex items-center gap-2">
                                    <span>🔍</span> Where are you going?
                                </div>

                                {/* Villa Preview Mock Card */}
                                <div className="mt-4 flex-1 rounded-2xl overflow-hidden border border-white/5 bg-slate-950/60 p-2 flex flex-col justify-between">
                                    <img 
                                        src="/images/home/properties2.webp" 
                                        alt="Santorini stay" 
                                        className="w-full h-32 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    <div className="mt-2.5">
                                        <div className="flex justify-between text-[8px] font-black text-brand-400">
                                            <span>SANTORINI</span>
                                            <span>★ 4.9</span>
                                        </div>
                                        <p className="text-[10px] font-extrabold text-white mt-1">Santorini Sea View Suite</p>
                                        <p className="text-[9px] text-gray-400 mt-0.5">SAR 1,200 / night</p>
                                    </div>
                                </div>

                                {/* Footer Mock Navbar */}
                                <div className="mt-4 pt-2.5 border-t border-white/5 flex justify-around text-[9px] text-gray-500 font-bold">
                                    <span className="text-brand-400">Home</span>
                                    <span>Bookings</span>
                                    <span>Account</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating decorative badge 1 */}
                        <div className="absolute top-12 left-0 sm:left-4 z-20 p-3 rounded-2xl bg-white/95 text-gray-900 border border-gray-100 shadow-2xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Rating</p>
                                <p className="text-xs font-bold text-gray-850">⭐ 4.9 Stars</p>
                            </div>
                        </div>

                        {/* Floating decorative badge 2 */}
                        <div className="absolute bottom-12 right-0 sm:right-4 z-20 p-3 rounded-2xl bg-white/95 text-gray-900 border border-gray-100 shadow-2xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center animate-pulse">
                                <Zap size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sync</p>
                                <p className="text-xs font-bold text-gray-850">Instant Booking</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Copy Details and Lottie Stores */}
                    <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-6">
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
