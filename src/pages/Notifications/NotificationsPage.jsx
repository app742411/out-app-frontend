import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import NotificationList from "../../components/Notifications/NotificationList";

export default function NotificationsPage() {
    return (
        <>
            <PageMeta
                title="Notifications | Out Admin"
                description="View and manage all system notifications including bookings, properties, and support."
            />
            <PageBreadcrumb pageTitle="Notifications" />

            <div className="w-full mx-auto">
                <NotificationList />
            </div>
        </>
    );
}
