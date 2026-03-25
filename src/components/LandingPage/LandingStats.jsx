import React from 'react';

export default function LandingStats() {
    return (
        <section className="py-16 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-100 relative z-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-gray-100 dark:divide-gray-800">
                    <div className="px-4">
                        <p className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">10k+</p>
                        <p className="text-gray-500 font-medium dark:text-gray-400">Premium Properties</p>
                    </div>
                    <div className="px-4">
                        <p className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">50k+</p>
                        <p className="text-gray-500 font-medium dark:text-gray-400">Happy Customers</p>
                    </div>
                    <div className="px-4">
                        <p className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">12+</p>
                        <p className="text-gray-500 font-medium dark:text-gray-400">Years Experience</p>
                    </div>
                    <div className="px-4">
                        <p className="text-4xl font-bold text-gray-900 mb-2 dark:text-white">4.8</p>
                        <p className="text-gray-500 font-medium dark:text-gray-400">Average Rating</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
