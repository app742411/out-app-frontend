import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BookingDetailsComp from "../../components/Bookings/BookingDetailsComp";

export default function BookingDetailsPage() {
    return (
        <>
            <PageMeta title="Booking Details | Out Admin" />
            <PageBreadcrumb pageTitle="Booking Details" />
            <div className="w-full">
                <BookingDetailsComp />
            </div>
        </>
    );
}
