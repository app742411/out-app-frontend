import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import RecentBookings from "../../components/dashboard/RecentBookings";
import RevenueLineChart from "../../components/Reports/RevenueLineChart";
import PropertyBarChart from "../../components/Reports/PropertyBarChart";
import BookingStatusChart from "../../components/Reports/BookingStatusChart";
import OccupancyStats from "../../components/dashboard/OccupancyStats";
import ArrivalsDepartures from "../../components/dashboard/ArrivalsDepartures";
import RecentServices from "../../components/ecommerce/RecentServices";
import { getAdminDashboard1 } from "../../api/authApi";
import { useUser } from "../../context/UserContext";

import QuickActions from "../../components/dashboard/QuickActions";

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboard1();
        if (res?.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error("Home: Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
      </div>
    );
  }
  return (
    <>
      <PageMeta
        title="Out Admin | Dashboard"
        description="Out Admin Dashboard for Property & Booking Management"
      />

      <div className="space-y-6">
        {/* Welcome Greeting Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
            Welcome back, {user?.firstName || "Admin"}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's what is happening with your platform today.
          </p>
        </div>

        {/* Top KPIs */}
        <DashboardMetrics data={dashboardData} />

        {/* Quick Actions Row */}
        <QuickActions isVertical={false} />

        <div className="grid grid-cols-12 gap-6">
          {/* Revenue Overview & Occupancy */}
          <div className="col-span-12 xl:col-span-8">
            <RevenueLineChart data={dashboardData} />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <OccupancyStats data={dashboardData} />
          </div>

          {/* Bookings & Daily Movement */}
          <div className="col-span-12 xl:col-span-4">
            <ArrivalsDepartures data={dashboardData} />
          </div>
          <div className="col-span-12 xl:col-span-8">
            <RecentBookings data={dashboardData} />
          </div>

          {/* Performance & Distributions */}
          <div className="col-span-12 xl:col-span-7">
            <PropertyBarChart data={dashboardData} />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <BookingStatusChart data={dashboardData} />
          </div>

          <div className="col-span-12">
            <RecentServices data={dashboardData} />
          </div>
        </div>
      </div>
    </>
  );
}
