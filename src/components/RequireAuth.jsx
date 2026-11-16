
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import api from "../api/api";

export default function RequireAuth({
  children,
  allowedRoles = [],
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const shownAlert = useRef(false);

  const [state, setState] = useState({
    loading: true,
    user: null,
    error: "",
  });

  useEffect(() => {
    let active = true;

    const verify = async () => {
      setState({ loading: true, user: null, error: "" });

      const token =
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");

      if (!token) {
        if (active) {
          setState({ loading: false, user: null, error: "" });
        }
        return;
      }

      try {
        const { data } = await api.get("/auth/me/");

        if (active) {
          setState({
            loading: false,
            user: data.user || data,
            error: "",
          });
        }
      } catch (error) {
        if (!active) return;

        if ([401, 403].includes(error.response?.status)) {
          localStorage.removeItem("access");
          sessionStorage.removeItem("access");
          setState({ loading: false, user: null, error: "" });
        } else {
          setState({
            loading: false,
            user: null,
            error: "Unable to verify your session.",
          });
        }
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, []);

  const isAuthenticated = Boolean(state.user);
  const isAllowed =
    !allowedRoles.length ||
    allowedRoles.includes(state.user?.role);

  useEffect(() => {
    if (state.loading || state.error || isAuthenticated) return;
    if (shownAlert.current) return;

    shownAlert.current = true;
    let cancelled = false;

    Swal.fire({
      icon: "info",
      title: "Sign in to continue",
      text: "Create an account or sign in to unlock this feature on Quantahire.",
      showCancelButton: true,
      confirmButtonText: "Sign In",
      cancelButtonText: "Continue Browsing",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#64748B",
      reverseButtons: true,
    }).then((result) => {
      if (cancelled) return;

      if (result.isConfirmed) {
        navigate("/signin", {
          replace: true,
          state: {
            from: location.pathname + location.search,
          },
        });
      } else {
        navigate("/home", { replace: true });
      }
    });

    return () => {
      cancelled = true;
      Swal.close();
    };
  }, [
    state.loading,
    state.error,
    isAuthenticated,
    navigate,
    location.pathname,
    location.search,
  ]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAllowed) {
    const destination =
      state.user.role === "employer"
        ? "/employer/dashboard"
        : state.user.role === "job_seeker"
        ? "/jobseeker/dashboard"
        : "/home";

    return <Navigate to={destination} replace />;
  }

  return children;
}
