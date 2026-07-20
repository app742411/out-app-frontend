import React from 'react';
import { Building2, UserCheck, History, Sparkles } from 'lucide-react';

const stats = [
    {
        icon: Building2,
        value: "10k+",
        label: "Premium Stays",
        color: "text-blue-600 bg-blue-500/10 border-blue-500/10 dark:text-blue-400"
    },
    {
        icon: UserCheck,
        value: "50k+",
        label: "Happy Guests",
        color: "text-green-600 bg-green-500/10 border-green-500/10 dark:text-green-400"
    },
    {
        icon: History,
        value: "12+",
        label: "Years Service",
        color: "text-amber-600 bg-amber-500/10 border-amber-500/10 dark:text-amber-400"
    },
    {
        icon: Sparkles,
        value: "4.8",
        label: "Rating Review",
        color: "text-purple-600 bg-purple-500/10 border-purple-500/10 dark:text-purple-400"
    }
];

export default function LandingStats() {
    return (
        <section className="relative z-20 py-6 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto rounded-[32px] border border-gray-250 bg-white/70 p-6 md:p-8 dark:border-gray-800/80 dark:bg-gray-900/60 shadow-[0_15px_40px_rgba(0,0,0,0.015)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_50px_rgba(70,95,255,0.02)]">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-150/80 dark:divide-gray-800/60">
                        {stats.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div 
                                    key={idx} 
                                    className={`flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.03] ${
                                        idx === 0 ? "pt-0 pb-4 lg:py-0 lg:px-6" :
                                        idx === 1 ? "pt-4 pb-4 lg:py-0 lg:px-6" :
                                        idx === 2 ? "pt-4 pb-4 lg:py-0 lg:px-6" : "pt-4 pb-0 lg:py-0 lg:px-6"
                                    }`}
                                >
                                    {/* Icon Box */}
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-3.5 border border-transparent shadow-xs ${item.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    {/* Stat Value */}
                                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                                        {item.value}
                                    </h3>
                                    {/* Stat Label */}
                                    <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mt-2">
                                        {item.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
