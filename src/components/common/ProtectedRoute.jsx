import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("token"); // or your auth condition

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}
