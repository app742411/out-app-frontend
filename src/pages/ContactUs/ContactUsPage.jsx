import React from "react";
import LandingHeader from "../../components/LandingPage/LandingHeader";
import LandingFooter from "../../components/LandingPage/LandingFooter";
import ContactUsComp from "../../components/ContactUs/ContactUsComp";
import PageMeta from "../../components/common/PageMeta";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen bg-white">
            <PageMeta title="Contact Us | Out" />
            <LandingHeader />
            <main className="pt-20">
                <ContactUsComp />
            </main>
            <LandingFooter />
        </div>
    );
}
