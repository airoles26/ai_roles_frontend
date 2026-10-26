
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://ai-roles-backend.onrender.com/api/v1"
).replace(/\/$/, "");

export default function LinkedInCallback() {
  const navigate = useNavigate();
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(
      window.location.search
    );

    const code = params.get("code");
    const authError = params.get("error");

    // Remove temporary code from browser history.
    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );

    if (authError || !code) {
      setError(
        authError === "account_link_required"
          ? "An account with this email already exists. Sign in normally to link LinkedIn."
          : "LinkedIn authentication failed. Please try again."
      );
      return;
    }

    const finishSignin = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/linkedin/exchange/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "LinkedIn sign-in failed."
          );
        }

        const access = data.tokens?.access;
        const refresh = data.tokens?.refresh;

        if (!access || !refresh) {
          throw new Error("Missing authentication tokens.");
        }

        const profileResponse = await fetch(
          `${API_BASE_URL}/auth/me/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Unable to load user profile.");
        }

        const profile = await profileResponse.json();
        const user = profile.user || profile;

        const remember =
          sessionStorage.getItem(
            "linkedin_remember_me"
          ) !== "false";

        const storage = remember
          ? localStorage
          : sessionStorage;

        const otherStorage = remember
          ? sessionStorage
          : localStorage;

        storage.setItem("access", access);
        storage.setItem("refresh", refresh);
        storage.setItem("user", JSON.stringify(user));

        ["access", "refresh", "user"].forEach(
          (key) => otherStorage.removeItem(key)
        );

        sessionStorage.removeItem(
          "linkedin_remember_me"
        );

        const destination =
          user.is_superuser || user.role === "admin"
            ? "/admin/admin-dashboard"
            : user.role === "employer"
            ? "/company/dashboard"
            : "/worker/dashboard";

        navigate(destination, { replace: true });

      } catch (err) {
        setError(
          err.message || "Unable to sign in with LinkedIn."
        );
      }
    };

    finishSignin();
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FF] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        {error ? (
          <>
            <h1 className="text-xl font-extrabold text-[#18124A]">
              Sign-in unsuccessful
            </h1>
            <p role="alert" className="mt-4 text-sm leading-7 text-red-600">
              {error}
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="mt-6 rounded-xl bg-[#5145E5] px-6 py-3 text-sm font-bold text-white"
            >
              Back to sign in
            </button>
          </>
        ) : (
          <>
            <LoaderCircle
              size={36}
              className="mx-auto animate-spin text-[#5145E5]"
            />
            <h1 className="mt-5 text-xl font-extrabold text-[#18124A]">
              Connecting your LinkedIn account
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Please wait while we securely sign you in.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
