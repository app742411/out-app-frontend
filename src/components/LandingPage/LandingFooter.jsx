import React from 'react';
import { Link } from 'react-router';

export default function LandingFooter() {
    return (
        <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
                    <div className="md:col-span-1">
                        <img className="h-10 w-auto mb-6 brightness-0 invert" src="/images/logo/logo-dark.png" alt="Logo" />
                        <p className="text-gray-400 text-sm mb-6 max-w-xs">
                            The ultimate booking platform for premium stays. Discover places that feel like home, but luxurious.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-1.1 0-2 .9-2 2v1h4l-1 3h-3v6.78C18.4 20.73 22 16.7 22 12z" /></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" /></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.5c0-1.25-1.5-1-1.5 0V17h-2v-6h2v1.5c1.5-1.5 3.5-.5 3.5 2V17z" /></svg>
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">About Us</a></li>
                            <li><a href="#" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Careers</a></li>
                            <li><a href="#" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Press</a></li>
                            <li><a href="#" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Blog</a></li>

                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            <li><Link to="/contact-us" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Help Center</Link></li>
                            <li><a href="#" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Safety Information</a></li>
                            <li><a href="#" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Cancellation Options</a></li>
                            <li><Link to="/contact-us" className="text-gray-400 font-medium hover:text-white transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to find out about special offers and new properties.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email address" className="bg-gray-800 border-none text-white px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                            <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium">Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Out App. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" className="text-sm font-medium text-gray-500 hover:text-white">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="text-sm font-medium text-gray-500 hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
