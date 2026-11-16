
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api/api";

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const [state, setState] = useState({
    loading: true,
    role: null,
    error: "",
  });

  useEffect(() => {
    let active = true;

    const verify = async () => {
      const token =
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");

      if (!token) {
        if (active) {
          setState({ loading: false, role: null, error: "" });
        }
        return;
      }

      try {
        const response = await api.get("/auth/me/");

        if (!active) return;

        const user = response.data.user || response.data;

        setState({
          loading: false,
          role: user.role,
          error: "",
        });
      } catch (error) {
        if (!active) return;

        if ([401, 403].includes(error.response?.status)) {
          localStorage.removeItem("access");
          sessionStorage.removeItem("access");
        } else {
          setState({
            loading: false,
            role: null,
            error: "Unable to verify your session.",
          });
          return;
        }

        setState({
          loading: false,
          role: null,
          error: "",
        });
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B16]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#070B16] px-4 text-white">
        <p>{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-5 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!state.role || state.role === "admin") {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(state.role)) {
    const destination =
      state.role === "employer"
        ? "/employer/dashboard"
        : "/jobseeker/dashboard";

    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
