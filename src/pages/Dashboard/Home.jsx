import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import RecentBookings from "../../components/dashboard/RecentBookings";
import RevenueLineChart from "../../components/Reports/RevenueLineChart";
import PropertyBarChart from "../../components/Reports/PropertyBarChart";
import BookingStatusChart from "../../components/Reports/BookingStatusChart";
import OccupancyStats from "../../components/dashboard/OccupancyStats";
import ArrivalsDepartures from "../../components/dashboard/ArrivalsDepartures";
import RecentServices from "../../components/ecommerce/RecentServices";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Out Admin | Dashboard"
        description="Out Admin Dashboard for Property & Booking Management"
      />
      
      <div className="space-y-6">
        {/* Top KPIs */}
        <DashboardMetrics />

        <div className="grid grid-cols-12 gap-6">
          {/* Revenue Overview & Occupancy */}
          <div className="col-span-12 xl:col-span-8">
            <RevenueLineChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <OccupancyStats />
          </div>

          {/* Bookings & Daily Movement */}
          <div className="col-span-12 xl:col-span-8">
             <RecentBookings />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <ArrivalsDepartures />
          </div>

          {/* Performance & Distributions */}
          <div className="col-span-12 xl:col-span-7">
            <PropertyBarChart />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <BookingStatusChart />
          </div>
          
          <div className="col-span-12">
            <RecentServices />
          </div>
        </div>
      </div>
    </>
  );
}
