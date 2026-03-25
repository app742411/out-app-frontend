import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import VendorListComp from "../../components/Users/VendorListComp";

export default function Vendors() {
    return (
        <>
            <PageMeta title="Registered Service Providers" />
            <PageBreadcrumb pageTitle="All Service Providers" />
            <div className="w-full">
                <VendorListComp />
            </div>
        </>
    );
}
