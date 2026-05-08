import React from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingFooter from '../components/LandingPage/LandingFooter';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import AppSidebar from '../layout/AppSidebar';
import AppHeader from '../layout/AppHeader';
import Backdrop from '../layout/Backdrop';

function TermsOfServiceContent() {
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms & Conditions</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-brand max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                <p className="leading-relaxed font-medium text-gray-800 dark:text-gray-200">
                    Welcome to Out. By accessing or using Out, you agree to be bound by these Terms & Conditions.
                </p>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                    <p className="leading-relaxed">
                        By using Out, you agree to comply with these Terms & Conditions and all applicable laws and regulations.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. User Accounts</h2>
                    <p className="leading-relaxed mb-3">
                        You are responsible for maintaining the confidentiality of your account.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>You agree to provide accurate and complete information.</li>
                        <li>You are responsible for all activities under your account.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Bookings and Reservations</h2>
                    <p className="leading-relaxed mb-3">
                        All bookings are subject to availability and host approval where applicable.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>Users must provide accurate booking information.</li>
                        <li>Cancellation, refund, and modification policies may vary depending on the booking.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. User Conduct</h2>
                    <p className="leading-relaxed mb-3">You agree not to:</p>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li>Use Out for unlawful purposes</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Post false, misleading, or harmful content</li>
                        <li>Interfere with the operation or security of the platform</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Payments</h2>
                    <p className="leading-relaxed mb-3">
                        Payments are processed through third-party payment providers.
                    </p>
                    <p className="leading-relaxed">
                        Out is not responsible for payment failures caused by external providers.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
                    <p className="leading-relaxed">
                        All content, trademarks, branding, and materials on Out are owned by or licensed to Out and may not be copied or reused without permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                    <p className="leading-relaxed">
                        Out is not liable for indirect, incidental, or consequential damages arising from use of the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Termination</h2>
                    <p className="leading-relaxed">
                        We may suspend or terminate accounts that violate these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to Terms</h2>
                    <p className="leading-relaxed">
                        We may update these Terms & Conditions at any time. Continued use of Out means acceptance of the updated Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact</h2>
                    <p className="leading-relaxed">
                        For questions regarding these Terms, contact: <a href="mailto:support@outapp.com" className="text-brand-500 hover:underline font-medium">support@outapp.com</a> or use our <a href="/contact-us" className="text-brand-500 hover:underline font-medium">Contact Us</a> page.
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

export default function TermsOfService() {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
        return (
            <SidebarProvider>
                <TermsOfServiceContent />
            </SidebarProvider>
        );
    }
    return <TermsOfServiceContent />;
}
