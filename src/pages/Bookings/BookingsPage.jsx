import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BookingListComp from "../../components/Bookings/BookingListComp";

export default function BookingsPage({ defaultStatus = "all", title = "All Bookings" }) {
    return (
        <>
            <PageMeta title={`${title} | Out Admin`} />
            <PageBreadcrumb pageTitle={title} />
            <div className="w-full">
                <BookingListComp defaultStatus={defaultStatus} />
            </div>
        </>
    );
}
