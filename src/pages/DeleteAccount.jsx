import React from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingFooter from '../components/LandingPage/LandingFooter';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import AppSidebar from '../layout/AppSidebar';
import AppHeader from '../layout/AppHeader';
import Backdrop from '../layout/Backdrop';

function DeleteAccountContent() {
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Account Deletion Request</h1>
            
            <div className="prose prose-brand max-w-none text-gray-600 dark:text-gray-300 space-y-8">
                <p className="leading-relaxed font-medium text-gray-800 dark:text-gray-200 text-lg">
                    At Out, we respect your right to privacy and provide you with the option to delete your account and all associated data. This page outlines the process and what happens to your information.
                </p>

                <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h2 className="text-2xl font-semibold text-red-900 dark:text-red-400 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Steps to Request Account Deletion
                    </h2>
                    <p className="leading-relaxed mb-4">You can request the deletion of your account using either of the following methods:</p>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">1</div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Via the Mobile App:</p>
                                <p>Go to <strong>Settings</strong> &gt; <strong>Account Settings</strong> &gt; <strong>Delete Account</strong>. Follow the on-screen prompts to confirm your request.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">2</div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Via Email:</p>
                                <p>Send an email to <a href="mailto:support@outapp.com" className="text-brand-500 hover:underline font-medium">support@outapp.com</a> from the email address associated with your account. Include "Account Deletion Request" in the subject line.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Types of Data Deleted</h2>
                    <p className="leading-relaxed mb-3">Upon successful processing of your deletion request, the following information will be permanently removed from our active databases:</p>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li><strong>Profile Information:</strong> Your name, username, email address, phone number, and profile picture.</li>
                        <li><strong>Social Connections:</strong> Your friend list, followers, and any social links within the app.</li>
                        <li><strong>Personal Preferences:</strong> Your app settings, notification preferences, and saved locations.</li>
                        <li><strong>Communication History:</strong> Messages and chat history sent through the Out platform.</li>
                        <li><strong>Usage Data:</strong> History of your interactions within the app that are tied to your personal identity.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Types of Data Retained</h2>
                    <p className="leading-relaxed mb-3">We may retain certain data for legal, regulatory, or legitimate business purposes, including:</p>
                    <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                        <li><strong>Financial Records:</strong> Information related to past transactions and payments (retained for tax and accounting purposes).</li>
                        <li><strong>Legal Compliance:</strong> Data we are required to keep by law or to comply with a court order.</li>
                        <li><strong>Security & Fraud:</strong> Limited data to help identify and prevent fraud or security threats.</li>
                        <li><strong>Aggregated Data:</strong> Non-personally identifiable, anonymized data used for analytics and improving our services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Retention Period</h2>
                    <p className="leading-relaxed">
                        Once you submit a deletion request, your account will be deactivated immediately. The permanent deletion process typically takes up to <strong>30 days</strong> to complete across all our systems and backups. During this 30-day period, you may be able to cancel the request by contacting our support team.
                    </p>
                </section>

                <section className="border-t border-gray-100 dark:border-gray-700 pt-8 mt-12">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Contact Support</h2>
                    <p className="leading-relaxed">
                        If you have any questions regarding our account deletion process or your data privacy, please contact our Data Protection Officer at <a href="mailto:privacy@outapp.com" className="text-brand-500 hover:underline font-medium">privacy@outapp.com</a>.
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

export default function DeleteAccount() {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
        return (
            <SidebarProvider>
                <DeleteAccountContent />
            </SidebarProvider>
        );
    }
    return <DeleteAccountContent />;
}
