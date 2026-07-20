import React from 'react';
import { Check, X, Coins, Headphones, Camera, Zap, ShieldCheck } from 'lucide-react';

export default function LandingComparison() {
    const rows = [
        { 
            f: "Zero Hidden Fees", 
            icon: Coins, 
            us: true, 
            others: false 
        },
        { 
            f: "24/7 Dedicated Concierge", 
            icon: Headphones, 
            us: true, 
            others: false 
        },
        { 
            f: "Verified Property Photos", 
            icon: Camera, 
            us: true, 
            others: true 
        },
        { 
            f: "Instant Booking Confirmation", 
            icon: Zap, 
            us: true, 
            others: true 
        },
        { 
            f: "Flexible Cancellation Policy", 
            icon: ShieldCheck, 
            us: true, 
            others: false 
        }
    ];

    return (
        <section id="why-us" className="py-12 lg:py-16 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-purple-950/10 dark:via-gray-950 dark:to-blue-950/10 dark:text-gray-300 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Pill Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                    Why Choose Us
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-10 dark:text-white leading-tight tracking-tight">
                    Compare and see the difference.
                </h3>

                {/* Glassmorphic Table Card */}
                <div className="overflow-hidden rounded-[32px] border border-gray-250 bg-white/70 shadow-[0_15px_40px_rgba(0,0,0,0.015)] backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/60">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                                <th className="py-6 px-6 font-bold text-gray-600 dark:text-gray-400 text-xs sm:text-sm uppercase tracking-wider w-1/3">Features</th>
                                <th className="py-6 px-6 font-black text-brand-600 dark:text-brand-400 text-center w-1/3 bg-brand-600/5 dark:bg-brand-500/5 uppercase text-xs sm:text-sm tracking-wider">Our Platform</th>
                                <th className="py-6 px-6 font-bold text-gray-400 dark:text-gray-500 text-center w-1/3 text-xs sm:text-sm uppercase tracking-wider">Others</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150/60 dark:divide-gray-800/40">
                            {rows.map((row, i) => {
                                const Icon = row.icon;
                                return (
                                    <tr key={i} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.01] transition-colors">
                                        {/* Feature Name & Custom Icon */}
                                        <td className="py-4 px-6 font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-150/40 dark:border-gray-850/40 flex items-center justify-center text-gray-400 dark:text-gray-550 shrink-0">
                                                    <Icon size={14} />
                                                </div>
                                                <span>{row.f}</span>
                                            </div>
                                        </td>
                                        
                                        {/* Our Platform Cell (Highlighted) */}
                                        <td className="py-4 px-6 text-center bg-brand-600/[0.02] dark:bg-brand-500/[0.01]">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        </td>

                                        {/* Others Cell */}
                                        <td className="py-4 px-6 text-center">
                                            {row.others ? (
                                                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800/80 text-gray-400 dark:text-gray-500 flex items-center justify-center mx-auto">
                                                    <Check size={15} strokeWidth={2.5} />
                                                </div>
                                            ) : (
                                                <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                                                    <X size={15} strokeWidth={2.5} />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
