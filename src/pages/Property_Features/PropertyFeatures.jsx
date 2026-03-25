import React, { useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddFeature from "../../components/Property_Features/AddFeature";
import FeatureList from "../../components/Property_Features/FeatureList";

export default function PropertyFeatures() {
    const listRef = useRef();

    const refreshFeatures = () => {
        listRef.current?.refreshList();
    };

    return (
        <>
            <PageMeta title="Property Features Management" />
            <PageBreadcrumb pageTitle="Property Features" />

            <div className="flex w-full flex-col lg:flex-row gap-6">
                {/* LEFT: Add Feature */}
                <div className="w-full lg:w-1/3">
                    <AddFeature onFeatureAdded={refreshFeatures} />
                </div>

                {/* RIGHT: Feature List */}
                <div className="w-full lg:w-2/3">
                    <FeatureList ref={listRef} />
                </div>
            </div>
        </>
    );
}
