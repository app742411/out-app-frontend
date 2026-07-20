import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import playstoreLottie from "../../lottie/playstore.json";
import appstoreLottie from "../../lottie/appstore.json";

export default function LandingHero({ setIsHovering }) {
    const [activeIndex, setActiveIndex] = useState(0); // Start with first card in center

    const carouselItems = [
        {
            src: "/images/home/properties2.webp",
            title: "Sea View Villa",
            badge: "Santorini",
            price: "SAR 1,200 / night"
        },
        {
            src: "/images/home/properties4.webp",
            title: "Luxury Interior",
            badge: "Interior Design",
            price: "SAR 1,500 / night"
        },
        {
            src: "/images/home/properties3.webp",
            title: "Infinity Pool Resort",
            badge: "Mediterranean",
            price: "SAR 1,800 / night"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % carouselItems.length);
        }, 4500); // Auto shuffle every 4.5 seconds
        return () => clearInterval(timer);
    }, []);

    // Determine the position role for each card index
    const physicalCards = carouselItems.map((item, idx) => {
        let position = "";
        if (idx === activeIndex) {
            position = "center";
        } else if (idx === (activeIndex - 1 + carouselItems.length) % carouselItems.length) {
            position = "left";
        } else {
            position = "right";
        }
        return { ...item, position, idx };
    });

    // Render side cards first and active center card last so it stacks perfectly on top
    const positionOrder = { left: 1, right: 2, center: 3 };
    const sortedCards = [...physicalCards].sort((a, b) => positionOrder[a.position] - positionOrder[b.position]);

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
            `}</style>

            <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-950 flex items-center min-h-[85vh] transition-colors duration-300 pt-24 lg:pt-0">
                {/* Background Grid Pattern with Radial Fade */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Animated color blobs */}
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[10%] -right-[10%] w-[55%] h-[55%] rounded-full bg-brand-500/10 dark:bg-brand-900/15 blur-[120px] animate-blob" />
                    <div className="absolute top-[40%] -left-[10%] w-[45%] h-[45%] rounded-full bg-blue-500/10 dark:bg-blue-900/15 blur-[120px] animate-blob-delayed" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-20">
                    {/* Grid Column Layout 4fr on left, 6fr on right for larger image display */}
                    <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-12 lg:gap-16 items-center">

                        <div className="text-left animate-fade-in duration-500"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}>
                            
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-widest mb-6 shadow-xs">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-600 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                                </span>
                                The best way to book stays
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl lg:text-7.5xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                                Find Your Perfect <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600 dark:from-brand-400 dark:to-blue-500">
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

                        {/* Interactive Premium Right Grid - Horizontal Card Shuffle Deck Layout */}
                        <div className="relative flex items-center justify-center h-[500px] sm:h-[580px] w-full group overflow-visible [perspective:1000px] [transform-style:preserve-3d]">
                            
                            {/* Decorative Radial glow background */}
                            <div className="absolute w-[95%] h-[95%] bg-brand-500/10 dark:bg-brand-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

                            {sortedCards.map((card) => {
                                let positionClass = "";
                                let contentVisible = false;

                                if (card.position === "center") {
                                    // Main Center Active Card
                                    positionClass = "z-30 w-[64%] max-w-[340px] aspect-[3/4] rounded-[32px] border border-white/30 dark:border-gray-800/60 shadow-[0_30px_70px_rgba(0,0,0,0.22)] dark:shadow-[0_35px_80px_rgba(0,0,0,0.5)] [transform:translateZ(60px)_translateX(0)] grayscale-0";
                                    contentVisible = true;
                                } else if (card.position === "left") {
                                    // Left Card - Behind and peeking out horizontally to the left
                                    positionClass = "z-20 w-[64%] max-w-[340px] aspect-[3/4] rounded-[30px] border border-white/20 dark:border-gray-800/40 shadow-xl dark:shadow-black/40 [transform:translateZ(10px)_translateX(-120px)_scale(0.88)] opacity-60 hover:opacity-85 grayscale";
                                } else {
                                    // Right Card - Behind and peeking out horizontally to the right
                                    positionClass = "z-20 w-[64%] max-w-[340px] aspect-[3/4] rounded-[30px] border border-white/20 dark:border-gray-800/40 shadow-xl dark:shadow-black/40 [transform:translateZ(10px)_translateX(120px)_scale(0.88)] opacity-60 hover:opacity-85 grayscale";
                                }

                                return (
                                    <div
                                        key={card.idx}
                                        onClick={() => setActiveIndex(card.idx)}
                                        className={`absolute overflow-hidden transition-all duration-700 ease-out cursor-pointer ${positionClass}`}
                                    >
                                        <img 
                                            src={card.src} 
                                            alt={card.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/25 to-transparent flex items-end p-5 transition-opacity duration-500 ${
                                            contentVisible ? "opacity-100" : "opacity-0"
                                        }`}>
                                            <div>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-500 text-white text-[8px] font-black uppercase tracking-wider mb-2">
                                                    {card.badge}
                                                </span>
                                                <h4 className="text-white font-extrabold text-xs sm:text-base drop-shadow-md">
                                                    {card.title}
                                                </h4>
                                                <p className="text-gray-300 text-[10px] mt-0.5 font-bold drop-shadow-md">
                                                    {card.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Decorative dotted pattern background */}
                            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] [background-size:16px_16px] z-0 pointer-events-none"></div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
