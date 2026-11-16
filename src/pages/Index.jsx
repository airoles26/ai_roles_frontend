
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api/api";

export default function Index() {
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const token =
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");

      // Visitors can browse the public homepage.
      if (!token) {
        if (active) setDestination("/home");
        return;
      }

      try {
        const { data } = await api.get("/auth/me/");
        if (!active) return;

        const user = data.user || data;

        switch (user.role) {
          case "employer":
            setDestination("/employer/dashboard");
            break;

          case "job_seeker":
            setDestination("/jobseeker/dashboard");
            break;

          default:
            setDestination("/home");
        }
      } catch (error) {
        if (!active) return;

        if ([401, 403].includes(error.response?.status)) {
          localStorage.removeItem("access");
          sessionStorage.removeItem("access");
        }

        // Keep the public homepage accessible.
        setDestination("/home");
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  if (destination) {
    return <Navigate to={destination} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070B16] text-white">
      <Loader2 className="h-9 w-9 animate-spin text-blue-500" />
      <h1 className="mt-4 text-2xl font-bold">
        Quanta<span className="text-blue-500">hire</span>
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Loading your experience...
      </p>
    </div>
  );
}
