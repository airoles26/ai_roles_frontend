
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
  CheckCircle2,
} from "lucide-react";

import quantahireLogo from "../assets/logo.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://ai-roles-backend.onrender.com/api/v1"
).replace(/\/$/, "");

const FEATURES = [
  "Discover jobs matched to your skills",
  "Optimize your resume with AI",
  "Track applications in one workspace",
];

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
    // --------------------------------------
    // 1. Sign in
    // --------------------------------------
    const response = await fetch(
      `${API_BASE_URL}/auth/signin/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.username.trim().toLowerCase(),
          password: form.password,
        }),
      }
    );

    const data = await response.json();

    // --------------------------------------
    // 2. Handle authentication errors
    // --------------------------------------
    if (!response.ok) {
      if (data.email_verification_required) {
        setError(
          "Your email is not verified. Please check your inbox for the verification link."
        );
      } else {
        setError(
          data.message ||
          data.detail ||
          "Invalid email or password. Please try again."
        );
      }
      return;
    }

    // --------------------------------------
    // 3. Extract JWT tokens
    // --------------------------------------
    const accessToken =
      data.access_token ||
      data.tokens?.access ||
      data.access;

    const refreshToken =
      data.refresh_token ||
      data.tokens?.refresh ||
      data.refresh;

    if (!accessToken || !refreshToken) {
      setError(
        "Login succeeded, but authentication tokens were not returned."
      );
      return;
    }

    // --------------------------------------
    // 4. Fetch authenticated user profile
    // --------------------------------------
    const profileResponse = await fetch(
      `${API_BASE_URL}/auth/me/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!profileResponse.ok) {
      setError(
        "Signed in, but your profile could not be loaded."
      );
      return;
    }

    const profileData = await profileResponse.json();

    // Supports both flat and nested profile responses
    const user = profileData.user || profileData;

    // --------------------------------------
    // 5. Save authentication information
    // --------------------------------------
    const storage = rememberMe
      ? localStorage
      : sessionStorage;

    const otherStorage = rememberMe
      ? sessionStorage
      : localStorage;

    storage.setItem("access", accessToken);
    storage.setItem("refresh", refreshToken);
    storage.setItem("user", JSON.stringify(user));

    otherStorage.removeItem("access");
    otherStorage.removeItem("refresh");
    otherStorage.removeItem("user");

    // --------------------------------------
    // 6. Redirect based on user role
    // --------------------------------------
    if (user.role === "employer") {
      navigate("/company/dashboard", {
        replace: true,
      });
    } else if (
      user.role === "admin" ||
      user.is_superuser
    ) {
      navigate("/admin/admin-dashboard", {
        replace: true,
      });
    } else {
      navigate("/worker/dashboard", {
        replace: true,
      });
    }
  } catch (error) {
    console.error("Signin error:", error);

    setError(
      "Unable to connect to Quantahire. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-200 focus:border-[#5145E5] focus:ring-4 focus:ring-[#5145E5]/10";

  return (
    <div className="min-h-screen bg-[#F8F9FF] lg:grid lg:grid-cols-2">
      {/* LEFT BRANDING PANEL */}
      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#18124A] px-12 py-12 text-white lg:flex xl:px-20">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#211766] via-[#34238C] to-[#5145E5]" />

        {/* Decorative glowing elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#14E0C8]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[450px] w-[450px] rounded-full bg-[#8B7BFF]/30 blur-[110px]" />

        <div className="pointer-events-none absolute right-12 top-40 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-20 top-48 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-28 top-56 h-40 w-40 rounded-full border border-white/10" />

        {/* Logo */}
        <Link
          to="/"
          aria-label="Quantahire home"
          className="relative z-10 inline-flex w-fit items-center rounded-xl bg-white px-4 py-2 shadow-xl shadow-black/10"
        >
          <img
            src={quantahireLogo}
            alt="Quantahire"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Main branding content */}
        <div className="relative z-10 max-w-xl py-14">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#6FFFEF]">
            <Sparkles size={15} />
            POWERED BY INTELLIGENT MATCHING
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.13] tracking-tight xl:text-6xl">
            Your future
            <span className="mt-2 block text-white">
              starts with
            </span>
            <span className="mt-2 block bg-gradient-to-r from-[#14E0C8] via-[#7CFBEA] to-white bg-clip-text text-transparent">
              the right match.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-indigo-100/80 xl:text-lg">
            Welcome back to Quantahire. Discover
            opportunities, unlock AI-powered career
            tools, and take your next big step.
          </p>

          <div className="mt-10 space-y-5">
            {FEATURES.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#14E0C8]/20 bg-[#14E0C8]/10 text-[#14E0C8]">
                  <CheckCircle2 size={19} />
                </div>

                <span className="text-sm font-medium text-indigo-50/90">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Product feature card */}
          <div className="mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14E0C8]/15 text-[#14E0C8]">
                <Zap size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Quantum Talent Copilot
                </p>
                <p className="mt-1 text-xs text-indigo-100/70">
                  Your AI-powered career assistant
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-indigo-100/80">
              Find relevant opportunities, tailor your
              resume, and manage your job search
              from one intelligent platform.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-indigo-200/70">
          <span>
            © {new Date().getFullYear()} Quantahire
          </span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} />
            Secure sign in
          </span>
        </div>
      </aside>

      {/* RIGHT SIGN IN SECTION */}
      <main className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-10 lg:px-12">
        {/* Background glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#5145E5]/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#14E0C8]/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-[440px]">
          {/* Mobile logo */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center lg:hidden"
          >
            <img
              src={quantahireLogo}
              alt="Quantahire"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Heading */}
          <div className="mb-9">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5145E5]/10 bg-[#5145E5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5145E5]">
              <Sparkles size={14} />
              WELCOME BACK
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#18124A] sm:text-4xl">
              Sign in to your
              <span className="block bg-gradient-to-r from-[#5145E5] to-[#16BFAF] bg-clip-text text-transparent">
                Quantahire account
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Enter your credentials to access your
              workspace and continue your journey.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2.5 block text-sm font-semibold text-[#18124A]"
              >
                Email Address
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  autoFocus
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#18124A]"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#5145E5] transition hover:text-[#34238C] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-[#5145E5]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5 py-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#5145E5]"
              />

              <span className="text-sm text-slate-600">
                Keep me signed in
              </span>
            </label>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5145E5] to-[#695CF0] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#5145E5]/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#4338CA] hover:to-[#5145E5] hover:shadow-xl hover:shadow-[#5145E5]/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5145E5]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Quantahire
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">
              NEW TO QUANTAHIRE?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Signup button */}
          <Link
            to="/signup"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[#5145E5]/20 bg-white px-5 py-4 text-sm font-bold text-[#5145E5] transition-all hover:border-[#5145E5] hover:bg-[#5145E5]/5"
          >
            Create a free account
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Terms */}
          <p className="mt-8 text-center text-xs leading-6 text-slate-400">
            By signing in, you agree to Quantahire's{" "}
            <Link
              to="/terms"
              className="font-medium text-[#5145E5] hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-[#5145E5] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Mobile copyright */}
          <p className="mt-10 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Quantahire.
            All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
