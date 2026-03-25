import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BookingListComp from "../../components/Bookings/BookingListComp";

export default function BookingsPage() {
    return (
        <>
            <PageMeta title="All Bookings | Out Admin" />
            <PageBreadcrumb pageTitle="All Bookings" />
            <div className="w-full">
                <BookingListComp />
            </div>
        </>
    );
}
