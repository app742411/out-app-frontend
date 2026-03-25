import React from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingFooter from '../components/LandingPage/LandingFooter';

export default function TermsOfService() {
    return (
        <div className="font-sans text-gray-900 bg-white relative overflow-hidden min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                    <p className="text-gray-500 mb-8 max-w-2xl">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-brand max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the Out App platform, you agree to be bound by these Terms of Service.
                                If you do not agree to all the terms and conditions outlined in this agreement, you may not access
                                the website or use any of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                            <p>
                                Out App provides an online platform that connects hosts offering accommodations with guests
                                seeking to book such accommodations. We do not own, manage, or operate any of the properties listed
                                on our platform unless explicitly stated.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
                            <p>When using our platform, you agree to:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Provide accurate, current, and complete information during registration and booking.</li>
                                <li>Maintain the security of your account credentials.</li>
                                <li>Not use the service for any illegal or unauthorized purpose.</li>
                                <li>Respect the property rules and terms set by individual hosts.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Bookings and Payments</h2>
                            <p>
                                All bookings are subject to availability and the specific terms set by the host. Payments are processed
                                securely through our third-party payment providers. Out App is not responsible for any disputes
                                between hosts and guests regarding refunds outside of our stated cancellation policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
                            <p>
                                To the fullest extent permitted by law, Out App shall not be liable for any indirect, incidental,
                                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. We will notify users of any material changes
                                by updating the date at the top of these terms. Continued use of the service constitutes acceptance
                                of the new terms.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
