import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
    {
        q: "How do I book a property on Out?",
        a: "Booking is simple! Browse our handpicked selections of properties, choose your dates and details, and click the booking button. If you are signed in, your transaction will secure instantly through our encrypted channels."
    },
    {
        q: "Are there any hidden fees on checkout?",
        a: "Absolutely not. We believe in 100% price transparency. The price you see listed on each property card is exactly what you pay, including all local taxes and service parameters."
    },
    {
        q: "What is the cancellation policy for bookings?",
        a: "Cancellation policies vary slightly by host property but are clearly outlined before checkout. Most premium villas offer 100% free cancellation up to 48 hours before your planned check-in date."
    },
    {
        q: "How does the property verification process work?",
        a: "Every listing on our platform undergoes a rigorous 50-point physical inspection by our property curation specialists. We verify that all photos, amenities, views, and services meet our strict luxury standards."
    }
];

export default function LandingFaq() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section id="faq" className="py-12 lg:py-16 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-purple-950/10 dark:via-gray-950 dark:to-blue-950/10 dark:text-gray-300 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-600/5 border border-brand-600/10 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-5">
                        FAQ
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 dark:text-white leading-tight tracking-tight">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base dark:text-gray-400 font-medium leading-relaxed">
                        Find answers to common questions about reservation processing, payments, and curations.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-4 max-w-3xl mx-auto">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div 
                                key={idx}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen 
                                        ? "border-brand-500 bg-brand-600/[0.03] dark:border-brand-500/80 dark:bg-brand-500/5" 
                                        : "border-gray-250 bg-white/70 dark:border-gray-800/40 dark:bg-gray-900/40"
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-gray-850 dark:text-white focus:outline-none cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <HelpCircle size={18} className={isOpen ? "text-brand-600 dark:text-brand-400" : "text-gray-400 dark:text-gray-500"} />
                                        <span>{faq.q}</span>
                                    </div>
                                    <ChevronDown 
                                        size={18} 
                                        className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-600 dark:text-brand-400" : ""}`} 
                                    />
                                </button>

                                {/* Answer container sliding logic */}
                                <div 
                                    className={`transition-all duration-300 ease-in-out ${
                                        isOpen ? "max-h-48 border-t border-gray-150 dark:border-gray-850" : "max-h-0"
                                    }`}
                                >
                                    <div className="p-5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
