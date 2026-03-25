import React, { useState } from "react";
import toast from "react-hot-toast";


export default function ContactUsComp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitting(false);
    };

    return (
        <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base font-semibold text-brand-500 tracking-wide uppercase">Contact Us</h2>
                    <p className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                        Get in touch with us
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="flex items-start gap-6 group">
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500 transition-transform group-hover:scale-110 duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Office</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Riyadh Malaz Dist.<br />
                                    Saudi Arabia
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500 transition-transform group-hover:scale-110 duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email Us</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    support@out.com<br />
                                    info@out.com
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6 group">
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500 transition-transform group-hover:scale-110 duration-300">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Call Us</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    +91 93993 03049<br />
                                    Mon - Fri, 9am - 6pm IST
                                </p>
                            </div>
                        </div>

                        {/* Social Links */}
                        {/* Social Links */}
                        <div className="flex items-center gap-4 pt-4">
                            {/* Facebook */}
                            <a
                                href="#"
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-1.1 0-2 .9-2 2v1h4l-1 3h-3v6.78C18.4 20.73 22 16.7 22 12z" />
                                </svg>
                            </a>

                            {/* Twitter */}
                            <a
                                href="#"
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="#"
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-700 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.27h-3v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.96v5.7h-3v-10h2.88v1.37h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.58z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="#"
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm4.25 5a5 5 0 110 10 5 5 0 010-10zm6-1.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-6 3.25a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-500/10 rounded-full blur-3xl" />

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="name@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
