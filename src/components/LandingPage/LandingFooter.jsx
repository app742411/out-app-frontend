import React from 'react';
import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Send, Mail, Phone, MapPin } from 'lucide-react';

export default function LandingFooter() {
    return (
        <footer className="bg-gray-950 pt-20 pb-8 border-t border-gray-900/60 relative overflow-hidden text-gray-400 transition-colors duration-300 shadow-[0_-20px_50px_rgba(0,0,0,0.25)]">
            {/* Ambient Background Glows */}
            <div className="absolute bottom-0 right-[5%] w-80 h-80 rounded-full bg-brand-600/5 blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none z-0" />

            {/* Massive background watermark text "OUT" */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[12rem] sm:text-[18rem] md:text-[22rem] font-black text-white/[0.015] select-none pointer-events-none z-0 tracking-widest leading-none">
                OUT
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Main 5-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-16 border-b border-white/5 pb-16">
                    
                    {/* Column 1: Brand details & contacts */}
                    <div className="md:col-span-1.5 flex flex-col justify-between">
                        <div>
                            <img 
                                className="h-12 w-auto mb-6 brightness-0 invert transition-transform duration-300 hover:scale-103" 
                                src="/images/logo/logo-dark.png" 
                                alt="Out Logo" 
                            />
                            <p className="text-gray-400 text-xs leading-relaxed font-medium mb-6 max-w-xs">
                                The ultimate booking platform for premium stays. Discover places that feel like home, but luxurious.
                            </p>
                        </div>
                        
                        {/* Short Contact Links with visible red icons */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                                <Mail size={14} className="text-red-500" />
                                <span>support@outstays.com</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                                <Phone size={14} className="text-red-500" />
                                <span>+966 500 000 000</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                                <MapPin size={14} className="text-red-500" />
                                <span>Riyadh, Saudi Arabia</span>
                            </div>
                        </div>

                        {/* Social Handles */}
                        <div className="flex space-x-2.5">
                            {[
                                { icon: Facebook, link: "#" },
                                { icon: Twitter, link: "#" },
                                { icon: Instagram, link: "#" }
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <a 
                                        key={index} 
                                        href={item.link} 
                                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500 hover:bg-brand-500/10 hover:text-white flex items-center justify-center transition-all duration-300"
                                    >
                                        <Icon size={15} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Column 2: Popular Destinations */}
                    <div>
                        <div className="relative pb-3 mb-6">
                            <h4 className="text-white font-black text-xs uppercase tracking-widest">Destinations</h4>
                            <div className="absolute bottom-0 left-0 flex flex-col gap-0.5">
                                <div className="h-[2px] w-5 bg-brand-600 rounded-full" />
                                <div className="h-[2px] w-10 bg-brand-600/40 rounded-full" />
                            </div>
                        </div>
                        <ul className="space-y-3.5">
                            {['Santorini Riviera', 'French Alps', 'Amalfi Coast', 'Ibiza Suites'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href="#" 
                                        className="inline-block text-gray-400 font-bold hover:text-white hover:translate-x-1 transition-all duration-200 text-xs"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Property Types */}
                    <div>
                        <div className="relative pb-3 mb-6">
                            <h4 className="text-white font-black text-xs uppercase tracking-widest">Properties</h4>
                            <div className="absolute bottom-0 left-0 flex flex-col gap-0.5">
                                <div className="h-[2px] w-5 bg-brand-600 rounded-full" />
                                <div className="h-[2px] w-10 bg-brand-600/40 rounded-full" />
                            </div>
                        </div>
                        <ul className="space-y-3.5">
                            {['Luxury Villas', 'Beachfront Condos', 'Penthouse Stays', 'Private Islands'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href="#" 
                                        className="inline-block text-gray-400 font-bold hover:text-white hover:translate-x-1 transition-all duration-200 text-xs"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Quick Links */}
                    <div>
                        <div className="relative pb-3 mb-6">
                            <h4 className="text-white font-black text-xs uppercase tracking-widest">Quick Links</h4>
                            <div className="absolute bottom-0 left-0 flex flex-col gap-0.5">
                                <div className="h-[2px] w-5 bg-brand-600 rounded-full" />
                                <div className="h-[2px] w-10 bg-brand-600/40 rounded-full" />
                            </div>
                        </div>
                        <ul className="space-y-3.5">
                            <li>
                                <Link 
                                    to="/contact-us" 
                                    className="inline-block text-gray-400 font-bold hover:text-white hover:translate-x-1 transition-all duration-200 text-xs"
                                >
                                    Help Center
                                </Link>
                            </li>
                            {['Partner Stays', 'Safety Standards'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href="#" 
                                        className="inline-block text-gray-400 font-bold hover:text-white hover:translate-x-1 transition-all duration-200 text-xs"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <Link 
                                    to="/contact-us" 
                                    className="inline-block text-gray-400 font-bold hover:text-white hover:translate-x-1 transition-all duration-200 text-xs"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Newsletter & Payment trust */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="relative pb-3 mb-6">
                                <h4 className="text-white font-black text-xs uppercase tracking-widest">Newsletter</h4>
                                <div className="absolute bottom-0 left-0 flex flex-col gap-0.5">
                                    <div className="h-[2px] w-5 bg-brand-600 rounded-full" />
                                    <div className="h-[2px] w-10 bg-brand-600/40 rounded-full" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed font-medium mb-5">
                                Subscribe to find out about special offers and new properties.
                            </p>
                            {/* Glassmorphic Newsletter input capsule */}
                            <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/10 focus-within:border-brand-500/50 focus-within:bg-white/[0.08] transition-all w-full items-center mb-6">
                                <input 
                                    type="email" 
                                    placeholder="Email address" 
                                    className="bg-transparent border-none text-white px-3 py-1.5 w-full outline-none text-xs font-medium placeholder-gray-500" 
                                />
                                <button className="bg-brand-500 text-white w-8 h-8 shrink-0 rounded-xl hover:bg-brand-600 flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-brand-500/20">
                                    <Send size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Payment Trust Badges */}
                        <div>
                            <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-3">Secure Payments</p>
                            <div className="flex flex-wrap gap-2">
                                {['Visa', 'MC', 'Apple Pay', 'PayPal'].map((pay, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-extrabold text-gray-300 select-none tracking-wider hover:bg-white/10 transition-colors"
                                    >
                                        {pay}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom area */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-gray-500 pt-2 border-t border-white/[0.02]">
                    <p>© {new Date().getFullYear()} Out App. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
