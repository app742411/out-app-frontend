import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PersonalUserDetailsComp from "../../components/Users/PersonalUserDetailsComp";
import IndividualUserBooking from "../../components/Users/IndividualUserBooking";

export default function UserDetailsPage() {
    return (
        <>
            <PageMeta title="User Details" />
            <PageBreadcrumb pageTitle="User Details" />
            <div className="w-full">
                <PersonalUserDetailsComp />
                <IndividualUserBooking />
            </div>
        </>
    );
}
