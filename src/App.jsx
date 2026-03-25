import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import UserProfiles from "./pages/UserProfiles";
import ContactUsPage from "./pages/ContactUs/ContactUsPage";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ForgetPassword from "./pages/AuthPages/ForgetPassword";
import OTPVerification from "./pages/AuthPages/OtpVerification";
import UpdatePassword from "./pages/AuthPages/UpdatePassword";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import GlobalPropertySettings from "./pages/GlobalSettings/GlobalPropertySettings";
import Users from "./pages/Users/Users";
import Vendors from "./pages/Users/Vendor";
import VendorDetailsPage from "./pages/Users/VendorDetailsPage";
import UserPropertiesPage from "./pages/Users/UserPropertiesPage";
import UserDetailsPage from "./pages/Users/UserDetailsPage";
import ChangeOldPasswordPage from "./pages/AuthPages/ChangeOldPasswordPage";
import ServiceProperties from "./pages/ServiceProperties/ServiceProperties";
import ServicePropertyDetails from "./pages/ServiceProperties/ServicePropertyDetails";
import ServicePropertyCalendarPage from "./pages/ServiceProperties/ServicePropertyCalendarPage";
import CouponManage from "./pages/Coupons/CouponManage";
import AppManage from "./pages/AppManage/AppManage";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import SupportListPage from "./pages/Support/SupportListPage";
import BookingsPage from "./pages/Bookings/BookingsPage";
import UpcomingBookingsPage from "./pages/Bookings/UpcomingBookingsPage";
import BookingDetailsPage from "./pages/Bookings/BookingDetailsPage";
import FinanceSettings from "./pages/Finance/FinanceSettings";
import TransactionsPage from "./pages/Finance/TransactionsPage";
import TransactionDetailsPage from "./pages/Finance/TransactionDetailsPage";
import AdminSettings from "./pages/Settings/AdminSettings";
import ReportsPage from "./pages/Reports/ReportsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import EarningsReportPage from "./pages/Finance/EarningsReportPage";
import VendorPayoutsPage from "./pages/Finance/VendorPayoutsPage";
import ServiceSetup from "./pages/ServiceSetup/ServiceSetup";
import ServiceManagement from "./pages/ServiceManagement/ServiceManagement";
import ServiceDetails from "./pages/ServiceManagement/ServiceDetails";
import PackageListPage from "./pages/Packages/PackageListPage";
import PackageDetailsPage from "./pages/Packages/PackageDetailsPage";
import CancellationPoliciesPage from "./pages/Finance/CancellationPoliciesPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>

          {/* Protected Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/change-password" element={<ChangeOldPasswordPage />} />
              <Route path="/property-setup" element={<GlobalPropertySettings />} />
              <Route path="/service-setup" element={<ServiceSetup />} />
              <Route path="/service-management" element={<ServiceManagement />} />
              <Route path="/service-details/:id" element={<ServiceDetails />} />
              <Route path="/users" element={<Users />} />
              <Route path="/user-details/:id" element={<UserDetailsPage />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendor-details/:id" element={<VendorDetailsPage />} />
              <Route path="/user-properties/:id" element={<UserPropertiesPage />} />
              <Route path="/properties" element={<ServiceProperties />} />
              <Route path="/property-details/:id" element={<ServicePropertyDetails />} />
              <Route path="/property-calendar/:id" element={<ServicePropertyCalendarPage />} />
              <Route path="/coupanmange" element={<CouponManage />} />
              <Route path="/packages" element={<PackageListPage />} />
              <Route path="/package-details/:id" element={<PackageDetailsPage />} />
              <Route path="/app-manage" element={<AppManage />} />
              <Route path="/finance-settings" element={<FinanceSettings />} />
              <Route path="/support" element={<SupportListPage />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/booking-details/:id" element={<BookingDetailsPage />} />
              <Route path="/bookings/upcoming" element={<UpcomingBookingsPage />} />
              <Route path="/bookings/completed" element={<ComingSoon />} />
              <Route path="/bookings/cancelled" element={<ComingSoon />} />
              <Route path="/bookings/refunds" element={<ComingSoon />} />
              <Route path="/vendor-payouts" element={<VendorPayoutsPage />} />
              <Route path="/earnings-report" element={<EarningsReportPage />} />
              <Route path="/transaction-logs" element={<TransactionsPage />} />
              <Route path="/cancellation-policies" element={<CancellationPoliciesPage />} />
              <Route path="/transaction-details/:id" element={<TransactionDetailsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Route>
          </Route>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            {/* Public Root Route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/verify-OTP" element={<OTPVerification />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

    </>
  );
}
