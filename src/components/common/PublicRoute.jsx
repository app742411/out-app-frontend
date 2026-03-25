import { Navigate, Outlet } from "react-router";

export default function PublicRoute() {
    const isAuthenticated = localStorage.getItem("token"); // Assuming token implies logged in

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
