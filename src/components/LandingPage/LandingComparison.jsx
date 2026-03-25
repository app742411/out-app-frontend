import React from 'react';

export default function LandingComparison() {
    return (
        <section id="why-us" className="py-24 bg-white dark:bg-gray-950 dark:text-gray-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-brand-500 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">Why Choose Us</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 dark:text-white">Compare and see the difference.</h3>

                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800">
                    <table className="w-full text-left bg-white border-none rounded-2xl dark:bg-gray-900/50">
                        <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-800">
                            <tr>
                                <th className="py-6 px-6 font-semibold text-gray-600 w-1/3 dark:text-gray-300">Features</th>
                                <th className="py-6 px-6 font-bold text-brand-600 text-center w-1/3 bg-brand-50 dark:bg-brand-600/10">Our Platform</th>
                                <th className="py-6 px-6 font-semibold text-gray-500 text-center w-1/3 dark:text-gray-400">Others</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[
                                { f: "Zero Hidden Fees", us: true, others: false },
                                { f: "24/7 Dedicated Concierge", us: true, others: false },
                                { f: "Verified Property Photos", us: true, others: true },
                                { f: "Instant Booking Confirmation", us: true, others: true },

                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-800/50">
                                    <td className="py-5 px-6 font-medium text-gray-800 dark:text-gray-200">{row.f}</td>
                                    <td className="py-5 px-6 text-center bg-brand-50/30 dark:bg-brand-600/5">
                                        {row.us ? (
                                            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto dark:bg-brand-600/20 dark:text-brand-600">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto dark:bg-gray-800 dark:text-gray-600">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-5 px-6 text-center">
                                        {row.others ? (
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto dark:bg-gray-800 dark:text-gray-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto dark:bg-red-900/20 dark:text-red-400">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
