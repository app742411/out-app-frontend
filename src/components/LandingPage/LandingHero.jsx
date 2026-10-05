import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import playstoreLottie from "../../lottie/playstore.json";
import appstoreLottie from "../../lottie/appstore.json";

export default function LandingHero({ setIsHovering }) {


    return (
        <>
            <style>{`
                @keyframes floatBlob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(35px, -45px) scale(1.08); }
                    66% { transform: translate(-25px, 25px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: floatBlob 14s infinite alternate ease-in-out;
                }
                .animate-blob-delayed {
                    animation: floatBlob 18s infinite alternate-reverse ease-in-out;
                }
                @keyframes floatSimple {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: floatSimple 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: floatSimple 6s ease-in-out infinite;
                    animation-delay: 3s;
                }
            `}</style>

            <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-950 flex items-center justify-center min-h-[100vh] transition-colors duration-300">
                {/* Background Grid Pattern with Radial Fade */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Animated color blobs */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[10%] -right-[10%] w-[55%] h-[55%] rounded-full bg-[#7a0404]/10 dark:bg-[#7a0404]/15 blur-[120px] animate-blob" />
                    <div className="absolute top-[40%] -left-[10%] w-[45%] h-[45%] rounded-full bg-[#7a0404]/5 dark:bg-[#7a0404]/10 blur-[120px] animate-blob-delayed" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-20">
                    {/* Grid Column Layout 4fr on left, 6fr on right for larger image display */}
                    <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-12 lg:gap-16 items-center">

                        <div className="text-left animate-fade-in duration-500"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}>

                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#7a0404]/5 border border-[#7a0404]/10 text-[#7a0404] dark:text-[#7a0404]/80 font-bold text-xs uppercase tracking-widest mb-6 shadow-xs">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7a0404] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7a0404]"></span>
                                </span>
                                The best way to book stays
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7.5xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                                Find Your Perfect <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7a0404] to-[#7a0404]/70 dark:from-[#7a0404]/90 dark:to-[#7a0404]/60">
                                    Stay With Us.
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                                Discover exceptional villas, luxury apartments, and cozy hotels around Mediterranean and sea view properties.
                            </p>

                            <div className="flex gap-4 items-center mb-8">
                                <a href="#" className="w-24 sm:w-32 md:w-36 h-auto hover:scale-105 active:scale-95 transition-transform duration-200">
                                    <Lottie animationData={playstoreLottie} loop className="w-full h-full" />
                                </a>

                                <a href="#" className="w-24 sm:w-32 md:w-36 h-auto hover:scale-105 active:scale-95 transition-transform duration-200">
                                    <Lottie animationData={appstoreLottie} loop className="w-full h-full" />
                                </a>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                <div className="flex -space-x-2 shrink-0">
                                    <img className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-950 object-cover" src="/images/user/user-03.jpg" alt="User" />
                                    <img className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-950 object-cover" src="/images/user/user-01.jpg" alt="User" />
                                    <img className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-950 object-cover" src="/images/user/user-04.jpg" alt="User" />
                                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-950 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-600 dark:text-gray-300 font-bold">+</div>
                                </div>
                                <span>Over 50k+ happy users worldwide</span>
                            </div>
                        </div>

                        {/* Interactive Premium Right Grid - Single Animated Image with Elegant Tags */}
                        <div className="relative flex items-center justify-center h-[500px] sm:h-[580px] w-full group overflow-visible">

                            {/* Decorative Circular Line Animations Behind Image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] z-0 pointer-events-none">
                                <div className="w-full h-full rounded-full border-[2px] border-dashed border-[#7a0404]/30 dark:border-[#7a0404]/20 animate-[spin_24s_linear_infinite]" />
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] z-0 pointer-events-none">
                                <div className="w-full h-full rounded-full border border-[#7a0404]/40 dark:border-[#7a0404]/30 animate-[spin_32s_linear_infinite_reverse]" />
                            </div>

                            <img
                                src="/images/image/herobanner.png"
                                alt="Hero Banner"
                                className="w-full max-w-xl lg:max-w-xl h-auto object-contain animate-float z-10 drop-shadow-2xl relative scale-110"
                            />

                            {/* Top Right Elegant Tag */}
                            <div className="absolute top-[10%] right-[0%] lg:-right-[5%] z-20 animate-float-delayed">
                                <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-3 sm:p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200/60 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">200K+</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Downloads</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Left Elegant Tag */}
                            <div className="absolute bottom-[15%] left-[0%] lg:-left-[5%] z-20 animate-float">
                                <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-3 sm:p-4 flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover" src="/images/user/user-01.jpg" alt="User" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover" src="/images/user/user-03.jpg" alt="User" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover" src="/images/user/user-04.jpg" alt="User" />
                                    </div>
                                    <div>
                                        <p className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">50K+</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Happy Users</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative dotted pattern background */}
                            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] [background-size:16px_16px] z-0 pointer-events-none"></div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
