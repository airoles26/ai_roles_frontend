
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://ai-roles-backend.onrender.com/api/v1"
).replace(/\/$/, "");

const initialForm = {
  full_name: "",
  username: "",
  email: "",
  phone_number: "",
  role: "job_seeker",
  password: "",
  password_confirm: "",
};

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  const getErrorMessage = (data) => {
    if (typeof data === "string") return data;

    if (data?.detail) return data.detail;

    if (data?.non_field_errors) {
      return data.non_field_errors.join(" ");
    }

    return "Please check your details and try again.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.password_confirm) {
      setFieldErrors({
        password_confirm: "Your passwords do not match.",
      });
      return;
    }

    if (form.password.length < 8) {
      setFieldErrors({
        password: "Your password must contain at least 8 characters.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(" ") : String(value),
            ])
          )
        );

        setError(getErrorMessage(data));
        return;
      }

      // Store the JWT credentials returned by Django.
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Send each account type to the appropriate starting page.
      if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/jobs");
      }
    } catch {
      setError(
        "Unable to connect to Quantahire. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1699A4] focus:ring-4 focus:ring-[#1699A4]/10";

  const fieldError = (name) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-xs text-red-600">
        {fieldErrors[name]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#F7FAFC] lg:grid lg:grid-cols-2">
      {/* Branding panel */}
      <aside className="relative hidden overflow-hidden bg-[#071A3D] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full border border-white/10" />
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
            <CheckCircle2 size={16} />
            Your next opportunity starts here
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight xl:text-6xl">
            Build your future.
            <span className="mt-2 block text-[#1699A4]">
              Find your next opportunity.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Join a global community of professionals and employers.
            Discover opportunities, connect with talent, and take the
            next step in your career.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <BriefcaseBusiness className="mb-3 text-[#1699A4]" size={24} />
              <h3 className="font-semibold">Explore opportunities</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Discover jobs that match your ambitions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <UserRound className="mb-3 text-[#1699A4]" size={24} />
              <h3 className="font-semibold">Connect with talent</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Help your organization find the right people.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          © {new Date().getFullYear()} Quantahire. All rights reserved.
        </p>
      </aside>

      {/* Signup form */}
      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-lg">
          <Link
            to="/"
            className="mb-9 flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A3D] text-white">
              <BriefcaseBusiness size={21} />
            </div>
            <span className="text-xl font-bold text-[#071A3D]">
              Quanta<span className="text-[#1699A4]">hire</span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1699A4]">
              Get started for free
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#071A3D] sm:text-4xl">
              Create your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Join Quantahire and take your next career or hiring step.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "job_seeker",
                    title: "Job seeker",
                    description: "Find your next job",
                    icon: UserRound,
                  },
                  {
                    value: "employer",
                    title: "Employer",
                    description: "Hire great talent",
                    icon: BriefcaseBusiness,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  const selected = form.role === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          role: option.value,
                        }))
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-[#1699A4] bg-[#1699A4]/5 ring-2 ring-[#1699A4]/10"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <Icon
                        size={22}
                        className={
                          selected ? "text-[#1699A4]" : "text-slate-500"
                        }
                      />
                      <span className="mt-3 block text-sm font-bold text-[#071A3D]">
                        {option.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
              {fieldError("role")}
            </div>

            <div>
              <label htmlFor="full_name" className="mb-2 block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>
              {fieldError("full_name")}
            </div>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                />
              </div>
              {fieldError("username")}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              {fieldError("email")}
            </div>

            <div>
              <label htmlFor="phone_number" className="mb-2 block text-sm font-semibold text-slate-700">
                Phone number <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="+254 7XX XXX XXX"
                  autoComplete="tel"
                />
              </div>
              {fieldError("phone_number")}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField}
                  className={`${inputClass} pr-12`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Use at least 8 characters and avoid common passwords.
              </p>
              {fieldError("password")}
            </div>

            <div>
              <label htmlFor="password_confirm" className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.password_confirm}
                  onChange={updateField}
                  className={`${inputClass} pr-12`}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {fieldError("password_confirm")}
            </div>

            <p className="text-xs leading-5 text-slate-500">
              By creating an account, you agree to Quantahire's{" "}
              <Link to="/terms" className="font-semibold text-[#147C91] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-semibold text-[#147C91] hover:underline">
                Privacy Policy
              </Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#071A3D]/10 transition hover:bg-[#102b59] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={19} />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-bold text-[#147C91] hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Quantahire
          </p>
        </div>
      </main>
    </div>
  );
}
