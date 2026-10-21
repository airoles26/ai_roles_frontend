
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import logo from "../assets/logo.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://192.168.100.12:8000/api/v1"
).replace(/\/$/, "");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/auth/request_reset/`,
        { email: normalizedEmail }
      );

      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          "Too many requests. Please wait before trying again."
        );
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to process your request. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] lg:grid lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-[#18124A] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#5145E5]/40 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#14E0C8]/10 blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img
            src={logo}
            alt="Quantahire"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-bold tracking-tight">
            Quantahire
          </span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10">
            <KeyRound size={36} className="text-[#14E0C8]" />
          </div>

          <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">
            Your next opportunity
            <span className="block text-[#14E0C8]">
              is waiting for you.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-indigo-100/80">
            Securely recover access to your Quantahire account
            and continue exploring career opportunities.
          </p>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
            <ShieldCheck
              size={25}
              className="shrink-0 text-[#14E0C8]"
            />
            <div>
              <p className="font-semibold">Secure account recovery</p>
              <p className="mt-1 text-sm text-indigo-100/70">
                Password-reset links expire automatically and
                can only be used once.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-indigo-200/60">
          © {new Date().getFullYear()} Quantahire.
          Your future, intelligently matched.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="lg:hidden">
            <img
              src={logo}
              alt="Quantahire"
              className="h-11 w-auto"
            />
          </Link>

          <Link
            to="/signin"
            className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-[#5145E5] hover:text-[#18124A]"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          {!submitted ? (
            <>
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5145E5]/10 text-[#5145E5]">
                <KeyRound size={26} />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#18124A] sm:text-4xl">
                Forgot password?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                Enter the email associated with your Quantahire
                account. We'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#18124A]"
                  >
                    Email address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition focus-within:border-[#5145E5] focus-within:ring-4 focus-within:ring-[#5145E5]/10">
                    <Mail
                      size={19}
                      className="shrink-0 text-slate-400"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-[#18124A] outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#5145E5]/20 transition hover:bg-[#4338CA] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5145E5]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                Remember your password?{" "}
                <Link
                  to="/signin"
                  className="font-bold text-[#5145E5] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <div aria-live="polite">
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14E0C8]/15 text-[#087F78]">
                <CheckCircle2 size={32} />
              </div>

              <h2 className="text-3xl font-extrabold text-[#18124A]">
                Check your inbox
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                If a Quantahire account exists for{" "}
                <span className="font-semibold text-[#18124A]">
                  {email.trim().toLowerCase()}
                </span>
                , we've sent a password-reset link.
              </p>

              <div className="mt-7 rounded-2xl border border-[#5145E5]/10 bg-white p-5">
                <div className="flex gap-3">
                  <Mail
                    size={22}
                    className="shrink-0 text-[#5145E5]"
                  />
                  <div>
                    <p className="font-semibold text-[#18124A]">
                      Didn't receive an email?
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Check your spam folder, or try again after
                      a few minutes.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setError("");
                }}
                className="mt-7 w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-[#5145E5] transition hover:border-[#5145E5]/40"
              >
                Try another email
              </button>

              <Link
                to="/signin"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#5145E5]"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
