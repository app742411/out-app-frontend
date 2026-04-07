import React from 'react';
import Lottie from "lottie-react";
import playstoreLottie from "../../lottie/playstore.json";
import appstoreLottie from "../../lottie/appstore.json";

export default function LandingHero({ setIsHovering }) {
    return (
        <>

            <section className="relative pt-32 pb-20 lg:pt-25 lg:pb-32 overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center min-h-[90vh] mt-20 transition-colors duration-300">
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pt-50px">
                    <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-200/50 dark:bg-brand-900/30 blur-[100px]" />
                    <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 dark:bg-blue-900/30 blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div className="text-left"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}>
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/50 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-medium text-sm mb-6 animate-fade-in-up">
                                <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2 animate-pulse"></span>
                                The best way to book stays
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up delay-100">
                                Find Your Perfect <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600 dark:from-brand-400 dark:to-blue-500">
                                    Stay With Us.
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed animate-fade-in-up delay-200">
                                Discover exceptional villas, luxury apartments, and cozy hotels around Mediterranean and sea view properties.
                            </p>

                            <div className="flex gap-6 items-center">

                                <a href="#" className="w-24 sm:w-32 md:w-40 h-auto hover:scale-110 transition-transform">
                                    <Lottie animationData={playstoreLottie} loop className="w-full h-full" />
                                </a>

                                <a href="#" className="w-24 sm:w-32 md:w-40 h-auto hover:scale-110 transition-transform">
                                    <Lottie animationData={appstoreLottie} loop className="w-full h-full" />
                                </a>

                            </div>
                            <div className="flex items-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400 font-medium animate-fade-in-up delay-400">
                                <div className="flex -space-x-2">
                                    <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="/images/user/user-03.jpg" alt="User" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="/images/user/user-01.jpg" alt="User" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="/images/user/user-04.jpg" alt="User" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">+</div>
                                </div>
                                <span>Over 50k+ happy users worldwide</span>
                            </div>
                        </div>

                        <div className="relative animate-slide-in-right delay-200">
                            {/* Main prominent image */}
                            <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/50 hover:shadow-brand-500/20 transition-all duration-500 transform hover:-translate-y-2">

                                <img
                                    src="/images/home/properties2.webp"
                                    alt="Luxury Villa"
                                    className="w-full h-auto object-cover aspect-[4/3]"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end justify-end p-6">

                                    <div className="text-right">
                                        <h3 className="text-white font-bold text-xl drop-shadow-md">
                                            Luxury Sea View Villa
                                        </h3>

                                        <p className="text-gray-200 text-sm flex items-center justify-end gap-1 drop-shadow-md">
                                            <svg className="w-4 h-4 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            4.9 (120 reviews) • Santorini, GR
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Floating accent images */}
                            <div className="absolute -bottom-8 -left-8 z-30 w-48 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                <img src="/images/home/properties4.webp" alt="Apartment Interior" className="w-full h-32 object-cover" />
                            </div>

                            <div className="absolute -top-8 -right-8 z-10 w-40 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl hidden sm:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <img src="/images/home/properties3.webp" alt="Hotel Pool" className="w-full h-40 object-cover" />
                            </div>

                            {/* Decorative dotted pattern */}
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] dark:bg-[radial-gradient(#374151_2px,transparent_2px)] [background-size:16px_16px] z-0"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
