import { Link } from "react-router-dom";
import { BadgeCheck, Bot, MapPin } from "lucide-react";

import { DISPLAY_FONT } from "./Navbar";

/*
 * Expected job fields (all optional except title and id/slug):
 *   title, slug, id
 *   company: { name, logo } | company_name, company_logo
 *   location, work_type: "remote" | "hybrid" | "onsite"
 *   salary_min, salary_max, salary_currency
 *   source_ats: "greenhouse" | "lever" | "workday" | "ashby" | "smartrecruiters" | "direct"
 *   last_verified_at (ISO date)
 *   skills: ["Python", ...] or [{ name }]
 *   match_score (0-100, only for signed-in users with a profile)
 *   auto_apply_eligible (boolean)
 */

const WORK_TYPE_LABELS = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };
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
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (Number.isNaN(minutes) || minutes < 0) return null;
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatSalary(min, max, currency = "USD") {
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(n));
  if (min && max) return `${fmt(min)} to ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return null;
}

function MatchRing({ score }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const strong = score >= 80;
  return (
    <div className="flex items-center gap-2.5" title="How well this role fits your profile">
      <svg width="50" height="50" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r={r} fill="none" stroke="#E2E8F0" strokeWidth="5" />
        <circle
          cx="25" cy="25" r={r} fill="none"
          stroke={strong ? "#109589" : "#5145E5"} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          transform="rotate(-90 25 25)"
        />
        <text x="25" y="29.5" textAnchor="middle" className="fill-[#10162F] text-[13px] font-bold">
          {Math.round(score)}
        </text>
      </svg>
      <span className="text-xs font-semibold leading-4 text-slate-500">
        % match
      </span>
    </div>
  );
}

export default function JobCard({ job, onAutoApply, autoApplyBusy = false, subscribed = false }) {
  const companyName =
    (typeof job.company === "object" ? job.company?.name : null) || job.company_name ||
    (typeof job.company === "string" ? job.company : "");
  const logo = (typeof job.company === "object" ? job.company?.logo : null) || job.company_logo;
  const workType = WORK_TYPE_LABELS[job.work_type] || (job.remote ? "Remote" : null);
  const place = [job.location, workType && job.location !== workType ? workType : null]
    .filter(Boolean).join(", ") || workType;
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency || "USD");
  const ats = ATS_LABELS[job.source_ats] || job.source_ats;
  const verified = timeAgo(job.last_verified_at);
  const skills = (job.skills || []).map((s) => (typeof s === "string" ? s : s?.name)).filter(Boolean);
  const hasScore = typeof job.match_score === "number";
  const href = `/jobs/${job.slug || job.id}`;

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#5145E5]/40 sm:p-6">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#F8FAFC] text-lg font-bold text-[#5145E5]">
          {logo ? <img src={logo} alt="" className="h-full w-full object-contain" /> : (companyName || job.title).charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div className="min-w-0">
              <h3 className={`${DISPLAY_FONT} text-lg font-bold leading-snug text-[#10162F] sm:text-xl`}>
                {/* Stretched link: the whole card opens the job, buttons stay clickable */}
                <Link to={href} className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:underline">
                  {job.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-600">{companyName}</p>
            </div>
            {hasScore && <MatchRing score={job.match_score} />}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
            {place && (
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-[#109589]" />
                {place}
              </span>
            )}
            {salary && <span className="font-semibold text-[#10162F]">{salary}</span>}
          </div>

          {skills.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {skills.slice(0, 6).map((s) => (
                <li key={s} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {s}
                </li>
              ))}
              {skills.length > 6 && (
                <li className="px-1 py-1 text-xs font-semibold text-slate-400">+{skills.length - 6} more</li>
              )}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              {ats && <span>Apply via {ats}</span>}
              {verified && (
                <span className="flex items-center gap-1 font-semibold text-[#087F78]">
                  <BadgeCheck size={14} />
                  Verified open {verified}
                </span>
              )}
            </p>

            {job.auto_apply_eligible && onAutoApply ? (
              <div className="relative z-10 flex items-center gap-3">
                {!subscribed && <span className="text-xs text-slate-500">$9.99 for 7 days</span>}
                <button
                  type="button"
                  onClick={() => onAutoApply(job)}
                  disabled={autoApplyBusy}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4338CA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  <Bot size={16} />
                  {autoApplyBusy ? "Opening checkout…" : "Auto-apply with Copilot"}
                </button>
              </div>
            ) : (
              <Link
                to={href}
                className="relative z-10 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-[#10162F] transition hover:border-[#5145E5]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
              >
                View job
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}