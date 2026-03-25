
import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ServicePropertyDetailsComp from "../../components/ServiceProperties/ServicePropertyDetailsComp";

export default function ServicePropertyDetails() {
    return (
        <>
            <PageMeta title="Property Details" />
            <PageBreadcrumb pageTitle="Property Details" />

            <div className="w-full">
                <ServicePropertyDetailsComp />
            </div>
        </>
    );
}
