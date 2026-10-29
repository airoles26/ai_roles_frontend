
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
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  MapPin,
  Building2,
} from "lucide-react";

import quantahireLogo from "../assets/logo.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.100.12:8000/api/v1"
).replace(/\/$/, "");

const initialForm = {
  full_name: "",
  username: "",
  email: "",
  phone_number: "",
  role: "job_seeker",
  company_name: "",
  company_website: "",
  company_description: "",
  company_location: "",
  company_country: "",
  password: "",
  password_confirm: "",
};

const ACCOUNT_TYPES = [
  {
    value: "job_seeker",
    title: "Job seeker",
    description: "Find your next opportunity",
    icon: UserRound,
  },
  {
    value: "employer",
    title: "Employer",
    description: "Discover and hire talent",
    icon: BriefcaseBusiness,
  },
];

const BENEFITS = [
  "Discover opportunities tailored to your skills",
  "Optimize your career journey with AI tools",
  "Connect candidates with ambitious employers",
];

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
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

  
const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setFieldErrors({});

  // ---------------------------------------
  // 1. Validate passwords
  // ---------------------------------------
  if (form.password !== form.password_confirm) {
    setFieldErrors({
      password_confirm: "Your passwords do not match.",
    });
    return;
  }

  if (form.password.length < 8) {
    setFieldErrors({
      password:
        "Your password must contain at least 8 characters.",
    });
    return;
  }

  setLoading(true);

  // ---------------------------------------
  // 2. Prepare signup payload
  // ---------------------------------------
  const payload = {
    full_name: form.full_name.trim(),
    username: form.username.trim(),
    email: form.email.trim().toLowerCase(),
    phone_number: form.phone_number.trim(),
    role: form.role,
    password: form.password,
    password_confirm: form.password_confirm,

    ...(form.role === "employer" && {
      company_name: form.company_name.trim(),
      company_website: form.company_website.trim(),
      company_description: form.company_description.trim(),
      company_location: form.company_location.trim(),
      company_country: form.company_country.trim(),
    }),
  };

  try {
    // ---------------------------------------
    // 3. Submit signup request
    // ---------------------------------------
    const response = await fetch(
      `${API_BASE_URL}/auth/signup/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // ---------------------------------------
    // 4. Handle validation errors
    // ---------------------------------------
    if (!response.ok) {
      const errors = data.errors || {};

      setFieldErrors(
        Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [
            key,
            Array.isArray(value)
              ? value.join(" ")
              : String(value),
          ])
        )
      );

      setError(
        data.message ||
          (!Object.keys(errors).length
            ? "Please check your details and try again."
            : "")
      );

      return;
    }

    // ---------------------------------------
    // 5. Signup successful
    // ---------------------------------------
    if (data.success) {
      console.log("Signup successful:", data);

      // Do not store JWT tokens here.
      // User must verify their email before signing in.

      navigate(
        `/signin`,
      );

      return;
    }

    setError(
      data.message || "Signup failed. Please try again."
    );
  } catch (err) {
    console.error("Signup error:", err);

    setError(
      "Unable to connect to Quantahire. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-200 focus:border-[#5145E5] focus:ring-4 focus:ring-[#5145E5]/10";

  const plainInputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-200 focus:border-[#5145E5] focus:ring-4 focus:ring-[#5145E5]/10";

  const labelClass =
    "mb-2.5 block text-sm font-semibold text-[#18124A]";

  const fieldError = (name) =>
    fieldErrors[name] ? (
      <p className="mt-1.5 text-xs text-red-600">
        {fieldErrors[name]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#F8F9FF] lg:grid lg:grid-cols-2">
      {/* LEFT BRANDING PANEL */}
      <aside
  className={`relative hidden min-h-screen flex-col overflow-hidden bg-[#18124A] px-12 py-12 text-white lg:flex xl:px-20 ${
    form.role === "employer"
      ? "justify-start gap-8"
      : "justify-between"
  }`}
>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#211766] via-[#34238C] to-[#5145E5]" />

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

        <div
  className={`relative z-10 max-w-xl ${
    form.role === "employer" ? "py-2" : "py-14"
  }`}
>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#6FFFEF]">
            <Sparkles size={15} />
            WELCOME TO QUANTAHIRE
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.13] tracking-tight xl:text-6xl">
            Your next chapter
            <span className="mt-2 block text-white">
              begins with
            </span>
            <span className="mt-2 block bg-gradient-to-r from-[#14E0C8] via-[#7CFBEA] to-white bg-clip-text text-transparent">
              possibilities.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-indigo-100/80 xl:text-lg">
            Join Quantahire to discover relevant career
            opportunities, access intelligent tools, or
            connect your organization with exceptional
            talent.
          </p>

          <div className="mt-10 space-y-5">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#14E0C8]/20 bg-[#14E0C8]/10 text-[#14E0C8]">
                  <CheckCircle2 size={19} />
                </div>

                <span className="text-sm font-medium text-indigo-50/90">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#14E0C8]/15 text-[#14E0C8]">
                <Zap size={22} />
              </div>

              <h3 className="text-sm font-bold text-white">
                For job seekers
              </h3>

              <p className="mt-2 text-xs leading-6 text-indigo-100/75">
                Explore jobs and grow your career with
                intelligent recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#14E0C8]/15 text-[#14E0C8]">
                <BriefcaseBusiness size={22} />
              </div>

              <h3 className="text-sm font-bold text-white">
                For employers
              </h3>

              <p className="mt-2 text-xs leading-6 text-indigo-100/75">
                Post opportunities and connect with
                professionals who fit your needs.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 text-xs text-indigo-200/70">
          <span>
            © {new Date().getFullYear()} Quantahire
          </span>

          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} />
            Secure registration
          </span>
        </div>
      </aside>

      {/* RIGHT SIGNUP FORM */}
      <main className="relative flex min-h-screen items-start justify-center px-5 py-12 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#5145E5]/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#14E0C8]/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-[520px]">
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
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5145E5]/10 bg-[#5145E5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5145E5]">
              <Sparkles size={14} />
              GET STARTED WITH QUANTAHIRE
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#18124A] sm:text-4xl">
              Create your
              <span className="block bg-gradient-to-r from-[#5145E5] to-[#16BFAF] bg-clip-text text-transparent">
                Quantahire account
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Join our platform to discover opportunities
              or find the right talent for your team.
            </p>
          </div>

          {/* General error */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ACCOUNT TYPE */}
            <div>
              <label className={labelClass}>
                I want to join as
              </label>

              <div className="grid grid-cols-2 gap-3">
                {ACCOUNT_TYPES.map((option) => {
                  const Icon = option.icon;
                  const selected = form.role === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setForm((previous) => ({
                          ...previous,
                          role: option.value,
                        }));
                        setFieldErrors({});
                        setError("");
                      }}
                      className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                        selected
                          ? "border-[#5145E5] bg-[#5145E5]/5 ring-2 ring-[#5145E5]/10 shadow-sm"
                          : "border-slate-200 bg-white hover:border-[#5145E5]/40 hover:bg-indigo-50/30"
                      }`}
                    >
                      <div
                        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-[#5145E5] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={21} />
                      </div>

                      <span className="block text-sm font-bold text-[#18124A]">
                        {option.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {fieldError("role")}
            </div>

            {/* FULL NAME */}
            <div>
              <label htmlFor="full_name" className={labelClass}>
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

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

            {/* USERNAME */}
            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

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

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

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

            {/* PHONE NUMBER */}
            <div>
              <label htmlFor="phone_number" className={labelClass}>
                Phone number{" "}
                <span className="font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <Phone
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

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

            {/* EMPLOYER COMPANY INFORMATION */}
            {form.role === "employer" && (
              <div className="space-y-5 rounded-2xl border border-[#5145E5]/15 bg-[#5145E5]/[0.035] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5145E5]/10 text-[#5145E5]">
                    <Building2 size={21} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#18124A]">
                      Company information
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Tell us about the organization
                      you're hiring for.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company_name"
                    className={labelClass}
                  >
                    Company name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Building2
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                    />

                    <input
                      id="company_name"
                      name="company_name"
                      value={form.company_name}
                      onChange={updateField}
                      className={inputClass}
                      placeholder="e.g. Quantahire Technologies"
                      autoComplete="organization"
                      required
                      maxLength={255}
                    />
                  </div>

                  {fieldError("company_name")}
                </div>

                <div>
                  <label
                    htmlFor="company_website"
                    className={labelClass}
                  >
                    Company website{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <Globe
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                    />

                    <input
                      id="company_website"
                      name="company_website"
                      type="url"
                      value={form.company_website}
                      onChange={updateField}
                      className={inputClass}
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  {fieldError("company_website")}
                </div>

                <div>
                  <label
                    htmlFor="company_description"
                    className={labelClass}
                  >
                    About the company{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="company_description"
                    name="company_description"
                    value={form.company_description}
                    onChange={updateField}
                    rows={3}
                    className={plainInputClass}
                    placeholder="Briefly describe your organization..."
                  />

                  {fieldError("company_description")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="company_location"
                      className={labelClass}
                    >
                      Company location
                    </label>

                    <div className="relative">
                      <MapPin
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                      />

                      <input
                        id="company_location"
                        name="company_location"
                        value={form.company_location}
                        onChange={updateField}
                        className={inputClass}
                        placeholder="e.g. Nairobi"
                      />
                    </div>

                    {fieldError("company_location")}
                  </div>

                  <div>
                    <label
                      htmlFor="company_country"
                      className={labelClass}
                    >
                      Country
                    </label>

                    <input
                      id="company_country"
                      name="company_country"
                      value={form.company_country}
                      onChange={updateField}
                      className={plainInputClass}
                      placeholder="e.g. Kenya"
                    />

                    {fieldError("company_country")}
                  </div>
                </div>
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

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
                  onChange={updateField}
                  className={`${inputClass} pr-12`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  minLength={8}
                  required
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

              <p className="mt-1.5 text-xs text-slate-400">
                Use at least 8 characters and avoid
                common passwords.
              </p>

              {fieldError("password")}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="password_confirm"
                className={labelClass}
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5145E5]/60"
                />

                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password_confirm}
                  onChange={updateField}
                  className={`${inputClass} pr-12`}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-[#5145E5]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {fieldError("password_confirm")}
            </div>

            {/* TERMS */}
            <p className="text-xs leading-6 text-slate-500">
              By creating an account, you agree to
              Quantahire's{" "}
              <Link
                to="/terms"
                className="font-semibold text-[#5145E5] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-semibold text-[#5145E5] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* SUBMIT */}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* SIGN IN LINK */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-bold text-[#5145E5] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} Quantahire.
            All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
