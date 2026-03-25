import React, { useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AddRestroomAmenitiesComp from "../../components/Restroom_Amenities/AddRestroomAmenitiesComp";
import RestroomAmenitiesListComp from "../../components/Restroom_Amenities/RestroomAmenitiesListComp";

export default function RestroomAmenitiesPage() {
    const listRef = useRef();

    const refreshAmenities = () => {
        listRef.current?.refreshList();
    };

    return (
        <>
            <PageMeta title="Restroom Amenities Management" />
            <PageBreadcrumb pageTitle="Restroom Amenities" />

            <div className="flex w-full flex-col lg:flex-row gap-6">
                {/* LEFT: Add Amenity */}
                <div className="w-full lg:w-1/3">
                    <AddRestroomAmenitiesComp onAmenityAdded={refreshAmenities} />
                </div>

                {/* RIGHT: Amenities List */}
                <div className="w-full lg:w-2/3">
                    <RestroomAmenitiesListComp ref={listRef} />
                </div>
            </div>
        </>
    );
}
