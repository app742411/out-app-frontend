import React from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingFooter from '../components/LandingPage/LandingFooter';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import AppSidebar from '../layout/AppSidebar';
import AppHeader from '../layout/AppHeader';
import Backdrop from '../layout/Backdrop';

function PrivacyPolicyContent() {
    const isAuthenticated = localStorage.getItem("token");

    let isExpanded = false, isHovered = false, isMobileOpen = false;
    try {
        const sidebar = useSidebar();
        isExpanded = sidebar.isExpanded;
        isHovered = sidebar.isHovered;
        isMobileOpen = sidebar.isMobileOpen;
    } catch (e) {
        // Fallback if SidebarContext is not available
    }

    const renderMainContent = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-brand max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                <p className="leading-relaxed font-medium text-gray-800 dark:text-gray-200">
                    Welcome to Out. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how Out (“we,” “our,” or “us”) collects, uses, stores, and protects your information when you use our mobile application, website, and related services.
                </p>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
                    <p className="leading-relaxed mb-3">When you use Out, we may collect the following information:</p>
                    
                    <div className="ml-4 space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">a. Information You Provide</h3>
                            <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                                <li>Full name</li>
                                <li>Username</li>
                                <li>Phone number</li>
                                <li>Email address (optional)</li>
                                <li>Profile picture</li>
                                <li>Messages and content you send through the app</li>
                                <li>Booking details</li>
                                <li>Bookmarks and saved items</li>
                                <li>Payment-related details (processed securely through third-party payment providers)</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">b. Automatically Collected Information</h3>
                            <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                                <li>Device type and operating system</li>
                                <li>App and website usage data</li>
                                <li>Log data (IP address, crash reports, device identifiers)</li>
                                <li>Language preferences</li>
                                <li>Approximate location (if enabled)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
                    <p className="leading-relaxed mb-3">We use your information to:</p>
                    <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                        <li>Create and manage your account</li>
                        <li>Process bookings and reservations</li>
                        <li>Provide and improve platform features</li>
                        <li>Enable communication between guests and hosts</li>
                        <li>Personalize user experience</li>
                        <li>Provide technical support</li>
                        <li>Detect fraud, abuse, or unauthorized activity</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Sharing Your Information</h2>
                    <p className="leading-relaxed mb-3">We do not sell your personal information. We may share your information only in the following cases:</p>
                    <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                        <li>With service providers that help operate Out</li>
                        <li>With hosts and guests where necessary to complete bookings</li>
                        <li>With payment providers to process transactions securely</li>
                        <li>If required by law or legal process</li>
                        <li>To protect the safety, rights, and security of Out and its users</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Storage and Security</h2>
                    <p className="leading-relaxed">
                        We implement reasonable technical and organizational measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Your Rights</h2>
                    <p className="leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                        <li>Access your data</li>
                        <li>Correct your data</li>
                        <li>Delete your account and personal data</li>
                        <li>Withdraw consent where applicable</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                        To request any of the above, contact us at: <a href="mailto:privacy@outapp.com" className="text-brand-500 hover:underline font-medium">privacy@outapp.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Retention</h2>
                    <p className="leading-relaxed">
                        We retain your information only as long as necessary to provide the service, comply with legal obligations, resolve disputes, and enforce agreements.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Children’s Privacy</h2>
                    <p className="leading-relaxed">
                        Out is not intended for children under the age of 13 (or the minimum legal age in your country). We do not knowingly collect personal information from children.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to This Policy</h2>
                    <p className="leading-relaxed">
                        We may update this Privacy Policy from time to time. Continued use of Out after changes means you accept the updated policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about this Privacy Policy, contact us at: <a href="mailto:privacy@outapp.com" className="text-brand-500 hover:underline font-medium">privacy@outapp.com</a> or use our <a href="/contact-us" className="text-brand-500 hover:underline font-medium">Contact Us</a> page.
                    </p>
                </section>
            </div>
        </div>
    );

    if (isAuthenticated) {
        return (
            <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-900">
                <div>
                    <AppSidebar />
                    <Backdrop />
                </div>
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${
                        isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
                >
                    <AppHeader />
                    <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 pb-20">
                        {renderMainContent()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans text-gray-900 bg-white dark:bg-gray-900 relative overflow-hidden min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderMainContent()}
            </main>

            <LandingFooter />
        </div>
    );
}

export default function PrivacyPolicy() {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
        return (
            <SidebarProvider>
                <PrivacyPolicyContent />
            </SidebarProvider>
        );
    }
    return <PrivacyPolicyContent />;
}
