import React from 'react';

export default function LandingAbout() {
    return (
        <section id="about" className="py-24 bg-white dark:bg-gray-900 dark:text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img src="/images/home/properties8.webp" alt="Hotel Exterior" className="rounded-2xl w-full h-64 object-cover" />
                            <img src="/images/home/properties6.webp" alt="Mansion Pool" className="rounded-2xl w-full h-64 object-cover mt-8" />
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-brand-500 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">About Us</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 dark:text-white">We perfectly blend comfort and nature for your stay.</h3>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
                            Whether you're looking for an oceanfront villa, an urban luxury apartment, or a secluded cabin, we have meticulously curated the finest collection of properties worldwide.
                            Experience unparalleled comfort, dedicated service, and breathtaking views everywhere you book with us.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {['Verified high-quality properties', '24/7 dedicated customer support', 'Best price guarantee'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0 dark:bg-brand-500/20 dark:text-brand-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium dark:text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="text-brand-600 font-semibold flex items-center gap-2 hover:text-brand-700 transition-colors">
                            Discover More
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
