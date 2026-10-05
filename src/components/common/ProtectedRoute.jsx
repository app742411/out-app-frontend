import { Navigate, Outlet } from "react-router";
import { Helmet } from "react-helmet-async";

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("token"); // or your auth condition

  return isAuthenticated ? (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Outlet />
    </>
  ) : (
    <Navigate to="/signin" replace />
  );
}
