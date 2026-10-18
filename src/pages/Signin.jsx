
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  LoaderCircle,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://ai-roles-backend.onrender.com/api/v1"
).replace(/\/$/, "");

export default function Signin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "Invalid username or password. Please try again."
        );
        return;
      }

      // Fetch the authenticated user's details.
      const profileResponse = await fetch(
        `${API_BASE_URL}/auth/me/`,
        {
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        }
      );

      if (!profileResponse.ok) {
        setError(
          "You signed in, but your profile could not be loaded. Please check that the /auth/me/ endpoint exists."
        );
        return;
      }

      const user = await profileResponse.json();

      // Keep the token storage consistent with the signup page.
      // localStorage persists across browser sessions; sessionStorage
      // clears when the browser tab session ends.
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("access", data.access);
      storage.setItem("refresh", data.refresh);
      storage.setItem("user", JSON.stringify(user));

      // Remove any stale credentials from the other storage.
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      otherStorage.removeItem("access");
      otherStorage.removeItem("refresh");
      otherStorage.removeItem("user");

      if (user.role === "employer") {
        navigate("/company/dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/admin-dashboard", { replace: true });
      } else {
        navigate("/jobs", { replace: true });
      }
    } catch {
      setError(
        "Unable to connect to Quantahire. Check your internet connection and make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1699A4] focus:ring-4 focus:ring-[#1699A4]/10";

  return (
    <div className="min-h-screen bg-[#F7FAFC] lg:grid lg:grid-cols-2">
      {/* Left branding panel */}
      <aside className="relative hidden overflow-hidden bg-[#071A3D] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-16 top-36 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#1699A4]/20 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1699A4]">
            <BriefcaseBusiness size={23} />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Quanta<span className="text-[#1699A4]">hire</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-xl py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-teal-200">
            <ShieldCheck size={17} />
            Welcome back to Quantahire
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight xl:text-6xl">
            Your next opportunity
            <span className="mt-2 block text-[#1699A4]">
              is waiting for you.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Sign in to discover opportunities, manage your applications,
            connect with employers, or find the right people for your team.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Discover opportunities that match your skills",
              "Manage applications from one place",
              "Connect with talent and grow your organization",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1699A4]/20 text-[#1699A4]">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          © {new Date().getFullYear()} Quantahire. All rights reserved.
        </p>
      </aside>

      {/* Sign in form */}
      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A3D] text-white">
              <BriefcaseBusiness size={21} />
            </div>
            <span className="text-xl font-bold text-[#071A3D]">
              Quanta<span className="text-[#1699A4]">hire</span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1699A4]">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#071A3D] sm:text-4xl">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your credentials to continue to Quantahire.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Username or email
              </label>

              <div className="relative">
                <UserRound
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Use the username you registered with.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#147C91] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#1699A4]"
              />
              <span className="text-sm text-slate-600">
                Keep me signed in
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#071A3D]/10 transition hover:bg-[#102b59] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={19} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">
              NEW TO QUANTAHIRE?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            to="/signup"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-[#071A3D] transition hover:border-[#1699A4] hover:bg-[#1699A4]/5"
          >
            Create an account
            <ArrowRight size={17} />
          </Link>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            By signing in, you agree to Quantahire's terms and privacy policy.
          </p>

          <p className="mt-8 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Quantahire
          </p>
        </div>
      </main>
    </div>
  );
}
