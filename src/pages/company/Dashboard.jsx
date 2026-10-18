import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  Eye,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  MapPin,
  Clock3,
  ChevronRight,
  Building2,
  Sparkles,
  CalendarDays,
  Users,
  Search,
  LoaderCircle, 
  RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";


const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const emptyStats = {
  active_jobs: 0,
  total_applications: 0,
  job_views: 0,
  shortlisted: 0,
  awaiting_review: 0,
};

const formatNumber = (value = 0) =>
  new Intl.NumberFormat().format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatRelativeTime = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000)
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDate(value);
};

const getApplicantInitials = (name = "Candidate") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const applicantColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

const getApplicantStatus = (status = "") => {
  const normalized = status.toLowerCase();

  if (normalized === "submitted") return "New";
  if (normalized === "reviewing") return "Reviewing";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};


function getUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null")
    );
  } catch {
    return null;
  }
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[#071A3D]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
  Active: "bg-emerald-50 text-emerald-700",
  Draft: "bg-slate-100 text-slate-600",
  New: "bg-blue-50 text-blue-700",
  Submitted: "bg-blue-50 text-blue-700",
  Reviewing: "bg-amber-50 text-amber-700",
  Shortlisted: "bg-emerald-50 text-emerald-700",
  Interview: "bg-violet-50 text-violet-700",
  Hired: "bg-teal-50 text-teal-700",
  Rejected: "bg-red-50 text-red-700",
  Withdrawn: "bg-slate-100 text-slate-600",
};

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function JobRow({ job }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50/70 sm:grid-cols-[minmax(0,1.6fr)_0.7fr_0.6fr_auto] sm:items-center sm:gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-[#071A3D]">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock3 size={13} />
            {job.type}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {job.location}
          </span>
        </div>

       <p className="mt-1.5 text-[11px] text-slate-400">
  {job.status === "Draft"
    ? "Not published"
    : job.posted_at
      ? `Posted ${formatDate(job.posted_at)}`
      : "Posting date unavailable"}
</p>
      </div>

      <div>
        <p className="text-lg font-bold text-[#071A3D]">
          {job.applications}
        </p>
        <p className="text-xs text-slate-500">Applications</p>
      </div>

      <div>
        <p className="text-lg font-bold text-[#071A3D]">{job.views}</p>
        <p className="text-xs text-slate-500">Job views</p>
      </div>

      <Link
        to={`/employer/jobs/${job.id}`}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#1699A4] hover:text-[#147C91]"
      >
        Manage
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}


export default function CompanyDashboard() {
  const user = getUser();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    const accessToken =
      localStorage.getItem("access") ||
      sessionStorage.getItem("access");

    if (!accessToken) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/employer/dashboard/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        throw new Error(
          data.message ||
            data.detail ||
            "Unable to load your employer dashboard."
        );
      }

      setDashboard(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const displayName =
    user?.full_name || user?.username || "Employer";

  const firstName = displayName.trim().split(/\s+/)[0];

  const companyName =
    dashboard?.company?.name ||
    user?.company?.name ||
    user?.company_name ||
    "Your Company";

  const stats = [
    {
      label: "Active Jobs",
      value: formatNumber(dashboard?.stats?.active_jobs),
      change: "Currently active",
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Applications",
      value: formatNumber(dashboard?.stats?.total_applications),
      change: "Applications received",
      icon: FileText,
      color: "bg-teal-50 text-teal-700",
    },
    {
      label: "Job Views",
      value: formatNumber(dashboard?.stats?.job_views),
      change: "Views across your jobs",
      icon: Eye,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Shortlisted",
      value: formatNumber(dashboard?.stats?.shortlisted),
      change: `${formatNumber(
        dashboard?.stats?.awaiting_review
      )} awaiting review`,
      icon: CheckCircle2,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  const jobs = dashboard?.jobs || [];
  const applicants = dashboard?.applicants || [];
  const subscription = dashboard?.subscription;


  if (loading && !dashboard) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <LoaderCircle className="animate-spin text-[#1699A4]" size={34} />

      <p className="text-sm font-medium text-slate-500">
        Loading your employer dashboard...
      </p>
    </div>
  );
}

if (error && !dashboard) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <RefreshCw size={22} />
      </div>

      <h2 className="mt-4 text-lg font-bold text-[#071A3D]">
        Unable to load dashboard
      </h2>

      <p className="mt-2 text-sm text-slate-500">{error}</p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={loadDashboard}
          className="rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-bold text-white hover:bg-[#12305C]"
        >
          Try again
        </button>

        {error.toLowerCase().includes("sign in") && (
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#071A3D]"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}


  return (
    <div className="space-y-7">

        {error && (
  <div
    role="alert"
    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
  >
    <span>{error}</span>

    <button
      type="button"
      onClick={loadDashboard}
      className="font-bold underline"
    >
      Retry
    </button>
  </div>
)}
      {/* Welcome */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1699A4]" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#147C91]">
              Employer dashboard
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#071A3D] sm:text-3xl">
            Welcome back, {firstName}!
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Here's what's happening with your hiring. Find great talent and
            build your team with Quantahire.
          </p>
        </div>

        <Link
          to="/employer/jobs/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#071A3D]/10 transition hover:bg-[#12305C]"
        >
          <Plus size={18} />
          Post a new job
        </Link>

        <button
  type="button"
  onClick={loadDashboard}
  disabled={loading}
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#071A3D] transition hover:border-[#1699A4] disabled:opacity-60"
>
  <RefreshCw
    size={16}
    className={loading ? "animate-spin" : ""}
  />
  Refresh
</button>

      </section>

      {/* Company profile banner */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#1699A4] shadow-sm ring-1 ring-teal-100">
            <Building2 size={23} />
          </div>

          <div>
            <h2 className="font-bold text-[#071A3D]">
              {companyName === "Your Company"
                ? "Complete your company profile"
                : `Make ${companyName} stand out`}
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Help candidates discover your company, understand your culture,
              and explore opportunities with your team.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-teal-100">
                <div className="h-full w-[65%] rounded-full bg-[#1699A4]" />
              </div>
              <span className="text-xs font-semibold text-[#147C91]">
                65% complete
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/employer/company-profile"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-[#147C91] transition hover:bg-teal-50 sm:self-center"
        >
          Edit profile
          <ArrowUpRight size={16} />
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#071A3D]">
                  {value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={21} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <TrendingUp size={14} />
              {change}
            </div>
          </div>
        ))}
      </section>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <div className="min-w-0 space-y-6">
          {/* Jobs */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-[#071A3D]">
                  Your job postings
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track performance and manage open positions.
                </p>
              </div>

              <Link
                to="/employer/jobs"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#147C91] hover:text-[#071A3D]"
              >
                View all
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="hidden grid-cols-[minmax(0,1.6fr)_0.7fr_0.6fr_auto] gap-4 border-y border-slate-100 bg-slate-50/70 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid sm:px-6">
              <span>Position</span>
              <span>Applications</span>
              <span>Views</span>
              <span>Actions</span>
            </div>

            {jobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}

            <div className="border-t border-slate-100 p-4 text-center">
              <Link
                to="/employer/jobs"
                className="text-sm font-bold text-[#147C91] hover:underline"
              >
                Manage all job postings
              </Link>
            </div>
          </section>

          {/* Recent applicants */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
            <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-[#071A3D]">
                  Recent applicants
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Candidates who recently applied to your jobs.
                </p>
              </div>

              <Link
                to="/employer/applicants"
                className="shrink-0 text-sm font-bold text-[#147C91] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              
{applicants.map((applicant, index) => {
  const displayStatus = getApplicantStatus(applicant.status);

  return (
    <div
      key={applicant.id}
      className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:px-6"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          applicantColors[index % applicantColors.length]
        }`}
      >
        {getApplicantInitials(applicant.name)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-[#071A3D]">
          {applicant.name}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500">
          {applicant.role}
        </p>

        <p className="mt-1.5 text-[11px] text-slate-400">
          {formatRelativeTime(applicant.applied_at)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <StatusBadge status={displayStatus} />

        <Link
          to="/employer/applicants"
          className="text-xs font-semibold text-[#147C91] hover:underline"
        >
          Review
        </Link>
      </div>
    </div>
  );
})}

{applicants.length === 0 && (
  <div className="px-5 py-10 text-center sm:px-6">
    <Users className="mx-auto text-slate-300" size={30} />

    <p className="mt-3 text-sm font-semibold text-[#071A3D]">
      No applicants yet
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Applications will appear here when candidates apply to your jobs.
    </p>
  </div>
)}

            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Performance */}
         <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="font-bold text-[#071A3D]">
        Hiring performance
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Overview of applications received for your jobs
      </p>
    </div>

    <div className="rounded-xl bg-[#1699A4]/10 p-2 text-[#147C91]">
      <TrendingUp size={18} />
    </div>
  </div>

  <div className="mt-7">
    <p className="text-3xl font-extrabold text-[#071A3D]">
      {loading && !dashboard
        ? "..."
        : formatNumber(dashboard?.stats?.total_applications ?? 0)}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Total applications received
    </p>
  </div>

  <div className="mt-6 rounded-xl bg-slate-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-[#071A3D]">
          Application activity
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Across all your company jobs
        </p>
      </div>

      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
        All time
      </span>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs text-slate-500">
          Awaiting review
        </p>
        <p className="mt-2 text-xl font-bold text-[#071A3D]">
          {formatNumber(dashboard?.stats?.awaiting_review ?? 0)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs text-slate-500">
          Shortlisted
        </p>
        <p className="mt-2 text-xl font-bold text-[#147C91]">
          {formatNumber(dashboard?.stats?.shortlisted ?? 0)}
        </p>
      </div>
    </div>

    {!loading && (dashboard?.stats?.total_applications ?? 0) === 0 && (
  <p className="mt-4 text-center text-xs leading-5 text-slate-500">
    No applications yet. Your hiring statistics will appear here when candidates apply.
  </p>
)}
  </div>

  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
    <span className="text-xs text-slate-500">
      Based on your job application records
    </span>

    <Link
      to="/employer/applicants"
      className="inline-flex items-center gap-1 text-xs font-bold text-[#147C91] transition hover:text-[#071A3D]"
    >
      View applicants
      <ArrowUpRight size={14} />
    </Link>
  </div>
</section>

          {/* Hiring tip */}
          <section className="rounded-2xl bg-gradient-to-br from-[#071A3D] via-[#0B2B52] to-[#147C91] p-6 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={22} className="text-teal-300" />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
              Hiring tip
            </p>

            <h2 className="mt-2 text-xl font-bold leading-7">
              Great teams start with great job descriptions.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Clearly describe responsibilities, required skills, and benefits
              to attract suitable candidates.
            </p>

            <Link
              to="/employer/jobs/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#071A3D] transition hover:bg-teal-50"
            >
              Create a job listing
              <ArrowUpRight size={16} />
            </Link>
          </section>

          {/* Quick actions */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              title="Quick actions"
              subtitle="Common tasks for your workspace"
            />

            <div className="space-y-2">
              {[
                {
                  title: "Post a new job",
                  description: "Reach qualified candidates",
                  icon: Plus,
                  path: "/employer/jobs/new",
                  color: "bg-teal-50 text-[#147C91]",
                },
                {
                  title: "Review applicants",
                  description: "Shortlist your top candidates",
                  icon: Users,
                  path: "/employer/applicants",
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  title: "Company profile",
                  description: "Update company information",
                  icon: Building2,
                  path: "/employer/company-profile",
                  color: "bg-violet-50 text-violet-700",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (

                    
                  <Link
                    key={item.title}
                    to={item.path}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-teal-100 hover:bg-teal-50/30"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#071A3D]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight size={17} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Subscription */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-[#071A3D]">Your plan</h2>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#147C91]">
  {subscription?.plan || "No active plan"}
</span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
  {subscription
    ? `Your ${subscription.plan} plan is ${subscription.status}.`
    : "No active subscription was found for your company."}
</p>

            <Link
              to="/employer/subscription"
              className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-[#147C91] hover:text-[#071A3D]"
            >
              View subscription details
              <ChevronRight size={15} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}