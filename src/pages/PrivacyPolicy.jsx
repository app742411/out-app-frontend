import React from 'react';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingFooter from '../components/LandingPage/LandingFooter';

export default function PrivacyPolicy() {
    return (
        <div className="font-sans text-gray-900 bg-white relative overflow-hidden min-h-screen flex flex-col">
            <LandingHeader />

            <main className="flex-grow pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                    <p className="text-gray-500 mb-8 max-w-2xl">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-brand max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Out App ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. The Data We Collect</h2>
                            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes billing address, email address and telephone numbers.</li>
                                <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
                            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-2">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
                                used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data
                                to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
                            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                            <p className="mt-2 font-medium">Email: privacy@outapp.com</p>
                        </section>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
