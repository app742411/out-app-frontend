import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UpcomingBookingListComp from "../../components/Bookings/UpcomingBookingListComp";

export default function UpcomingBookingsPage() {
    return (
        <>
            <PageMeta title="Upcoming Bookings | Out Admin" />
            <PageBreadcrumb pageTitle="Upcoming Bookings" />
            <div className="w-full">
                <UpcomingBookingListComp />
            </div>
        </>
    );
}
