
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Sparkles,
  Wallet,
  Wifi,
  Building2,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import { DISPLAY_FONT } from "./Navbar";

const WORK_TYPE_LABELS = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const ATS_LABELS = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  workday: "Workday",
  ashby: "Ashby",
  smartrecruiters: "SmartRecruiters",
  direct: "Direct post",
};

export function timeAgo(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const minutes = Math.floor(
    (Date.now() - date.getTime()) / 60000
  );

  if (minutes < 0) return null;
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatSalary(min, max, currency = "USD") {
  const hasMin =
    min !== null && min !== undefined && min !== "";

  const hasMax =
    max !== null && max !== undefined && max !== "";

  const format = (value) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Number(value));
    } catch {
      return `${currency} ${Number(value).toLocaleString()}`;
    }
  };

  if (hasMin && hasMax) {
    return `${format(min)} – ${format(max)}`;
  }

  if (hasMin) return `From ${format(min)}`;
  if (hasMax) return `Up to ${format(max)}`;

  return null;
}

function MatchRing({ score }) {
  const normalized = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  );

  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const progress =
    (normalized / 100) * circumference;

  const strong = normalized >= 80;

  return (
    <div
      className="flex items-center gap-2"
      title="AI match score based on your profile"
    >
      <div className="relative h-[60px] w-[60px] shrink-0">
        <svg
          viewBox="0 0 60 60"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="#EEF0F7"
            strokeWidth="5"
          />

          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={strong ? "#0FAF9C" : "#5145E5"}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-[#18124A]">
            {Math.round(normalized)}
          </span>
        </div>
      </div>

      <div className="hidden sm:block">
        <p className="text-xs font-bold text-[#18124A]">
          AI Match
        </p>

        <p
          className={`mt-0.5 text-[11px] font-semibold ${
            strong
              ? "text-[#0FAF9C]"
              : "text-[#5145E5]"
          }`}
        >
          {normalized >= 80
            ? "Strong match"
            : normalized >= 60
              ? "Good match"
              : "Match score"}
        </p>
      </div>
    </div>
  );
}

function WorkTypeBadge({ type }) {
  if (!type) return null;

  const Icon =
    type.toLowerCase() === "remote"
      ? Wifi
      : Building2;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#5145E5]/10 bg-[#5145E5]/[0.06] px-2.5 py-1.5 text-xs font-semibold text-[#5145E5]">
      <Icon size={13} />
      {WORK_TYPE_LABELS[type.toLowerCase()] || type}
    </span>
  );
}

export default function JobCard({
  job,
  onAutoApply,
  autoApplyBusy = false,
  subscribed = false,
}) {
  if (!job) return null;

  const companyName =
    (typeof job.company === "object"
      ? job.company?.name
      : null) ||
    job.company_name ||
    (typeof job.company === "string"
      ? job.company
      : "") ||
    "Confidential Company";

  const logo =
    (typeof job.company === "object"
      ? job.company?.logo_url ||
        job.company?.logo
      : null) ||
    job.company_logo ||
    null;

  const workType =
    job.work_type ||
    (job.remote ? "remote" : null);

  const salary = formatSalary(
    job.salary_min,
    job.salary_max,
    job.salary_currency || job.currency || "USD"
  );

  const ats =
    ATS_LABELS[job.source_ats] ||
    job.source_ats;

  const verified = timeAgo(job.last_verified_at);

  const posted = timeAgo(
    job.posted_at || job.created_at
  );

  const skills = Array.isArray(job.skills)
    ? job.skills
        .map((skill) =>
          typeof skill === "string"
            ? skill
            : skill?.name
        )
        .filter(Boolean)
    : [];

  const matchScore = Number(job.match_score);

  const hasScore =
    job.match_score !== null &&
    job.match_score !== undefined &&
    job.match_score !== "" &&
    Number.isFinite(matchScore);

  const href = `/find-jobs/${job.slug || job.id}`;

  const canAutoApply =
    job.auto_apply_eligible &&
    typeof onAutoApply === "function";

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/[0.025] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5145E5]/30 hover:shadow-xl hover:shadow-[#5145E5]/[0.07] sm:p-6">
      {/* Accent on hover */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#5145E5] via-[#796DF2] to-[#14E0C8] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Company logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#5145E5]/10 bg-[#F8F9FF] text-xl font-extrabold text-[#5145E5] sm:h-14 sm:w-14">
          {logo ? (
            <img
              src={logo}
              alt={`${companyName} logo`}
              loading="lazy"
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            companyName.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className={`${DISPLAY_FONT} text-lg font-extrabold leading-snug tracking-tight text-[#18124A] transition-colors group-hover:text-[#5145E5] sm:text-xl`}
              >
                <Link
                  to={href}
                  className="after:absolute after:inset-0 after:rounded-[22px] focus:outline-none focus-visible:underline"
                >
                  {job.title}
                </Link>
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-600">
                  {companyName}
                </span>

                {job.company?.verified && (
                  <BadgeCheck
                    size={15}
                    className="text-[#0FAF9C]"
                    aria-label="Verified company"
                  />
                )}
              </div>
            </div>

            {hasScore && (
              <div className="relative z-10">
                <MatchRing score={matchScore} />
              </div>
            )}
          </div>

          {/* Location and work type */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                <MapPin
                  size={14}
                  className="text-slate-400"
                />
                {job.location}
              </span>
            )}

            <WorkTypeBadge type={workType} />

            {job.employment_type && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium capitalize text-slate-600">
                <BriefcaseBusiness size={13} />
                {job.employment_type.replace(/_/g, " ")}
              </span>
            )}
          </div>

          {/* Salary */}
          {salary && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Wallet size={16} />
              </div>

              <div>
                <p className="text-sm font-extrabold text-[#18124A]">
                  {salary}
                </p>
                <p className="text-[10px] text-slate-400">
                  Salary range
                </p>
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-lg border border-slate-100 bg-[#F8F9FF] px-2.5 py-1.5 text-[11px] font-semibold text-slate-600"
                >
                  {skill}
                </span>
              ))}

              {skills.length > 5 && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          {ats && (
            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness size={13} />
              {ats}
            </span>
          )}

          {verified && (
            <span className="flex items-center gap-1.5 font-semibold text-[#0FAF9C]">
              <CheckCircle2 size={14} />
              Verified {verified}
            </span>
          )}

          {posted && (
            <span className="flex items-center gap-1.5">
              <Clock3 size={13} />
              Posted {posted}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canAutoApply ? (
            <>
              <Link
                to={href}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-[#18124A] transition hover:border-[#5145E5]/30 hover:text-[#5145E5]"
              >
                Details
                <ArrowUpRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => onAutoApply(job)}
                disabled={autoApplyBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {autoApplyBusy ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Bot size={15} />
                )}

                {autoApplyBusy
                  ? "Please wait..."
                  : "Auto-apply"}
                <Sparkles size={13} />
              </button>
            </>
          ) : (
            <Link
              to={href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/15 transition hover:bg-[#4338CA]"
            >
              View Job
              <ArrowUpRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
