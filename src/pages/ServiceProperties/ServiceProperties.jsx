import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ServicePropertiesList from "../../components/ServiceProperties/ServicePropertiesList";

export default function ServiceProperties() {
    return (
        <>
            <PageMeta title="Service Properties" />
            <PageBreadcrumb pageTitle="Service Properties" />

            <div className="w-full">
                <ServicePropertiesList />
            </div>
        </>
    );
}
