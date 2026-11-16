
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api/api";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const token =
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");

      if (!token) {
        if (active) {
          setRedirectTo("/signin");
          setLoading(false);
        }
        return;
      }

      try {
        // This endpoint should return the authenticated user.
        const response = await api.get("/auth/me/");

        if (!active) return;

        const user = response.data.user || response.data;
        const role = String(user.role || "").toLowerCase();

        switch (role) {
          case "employer":
            setRedirectTo("/company/dashboard");
            break;

          case "job_seeker":
            setRedirectTo("/worker/dashboard");
            break;

          case "admin":
            // Admin dashboard is a separate project.
            setRedirectTo("/signin");
            break;

          default:
            setError("Your account role is not recognized.");
            break;
        }
      } catch (err) {
        if (!active) return;

        const status = err.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("access");
          sessionStorage.removeItem("access");

          setRedirectTo("/signin");
        } else {
          setError(
            "Unable to verify your session. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070B16] text-white">
        <div className="flex items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-blue-500"
          />

          <h1 className="text-2xl font-bold tracking-tight">
            Quanta<span className="text-blue-500">hire</span>
          </h1>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Verifying your account...
        </p>
      </div>
    );
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070B16] px-4 text-white">
      <h1 className="text-xl font-semibold">
        Authentication Error
      </h1>

      <p className="mt-3 max-w-md text-center text-slate-400">
        {error}
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
