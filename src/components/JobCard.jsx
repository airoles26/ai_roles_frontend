import {
  MapPin,
  Clock3,
  Building2,
  ArrowUpRight,
  Banknote,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(date) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - parsed.getTime();
  const days = Math.floor(diff / 86400000);

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  return parsed.toLocaleDateString();
}

function salary(job) {
  if (
    job.salary_min == null ||
    job.salary_min === ""
  ) {
    if (job.salary_max == null || job.salary_max === "") {
      return null;
    }
  }

  const currency = job.currency || "USD";

  const format = (value) => Number(value).toLocaleString();

  const hasMin =
    job.salary_min != null && job.salary_min !== "";
  const hasMax =
    job.salary_max != null && job.salary_max !== "";

  if (hasMin && hasMax) {
    return `${currency} ${format(job.salary_min)} - ${format(
      job.salary_max
    )}`;
  }

  if (hasMin) {
    return `${currency} ${format(job.salary_min)}+`;
  }

  if (hasMax) {
    return `Up to ${currency} ${format(job.salary_max)}`;
  }

  return null;
}

export default function JobCard({ job }) {
  const salaryText = salary(job);

  return (
    <Link
      to={`/jobs/${job.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#5145E5]/30 hover:shadow-xl hover:shadow-[#5145E5]/[0.08] sm:p-6"
    >
      {/* Subtle brand accent */}
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#5145E5] via-[#4385F5] to-[#109589] transition-transform duration-300 group-hover:scale-x-100" />

      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-colors group-hover:border-[#5145E5]/20 group-hover:bg-[#5145E5]/5 sm:h-14 sm:w-14">
          {job.company?.logo_url ? (
            <img
              src={job.company.logo_url}
              alt={`${job.company.name || "Company"} logo`}
              loading="lazy"
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <Building2
              size={22}
              className="text-[#5145E5]"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Job Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-1 truncate text-sm font-semibold text-[#109589]">
                {job.company?.name || "Company"}
              </p>

              <h3 className="text-base font-extrabold leading-snug text-slate-950 transition-colors group-hover:text-[#5145E5] sm:text-lg">
                {job.title}
              </h3>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-[#5145E5]/10 group-hover:text-[#5145E5]">
              <ArrowUpRight
                size={18}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </div>

          {/* Location, Date and Salary */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2.5 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin
                size={15}
                className="shrink-0 text-[#5145E5]"
              />
              <span>
                {job.remote
                  ? "Remote"
                  : job.location || "Location flexible"}
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3
                size={15}
                className="shrink-0 text-[#4385F5]"
              />
              {formatDate(job.posted_at)}
            </span>

            {salaryText && (
              <span className="flex items-center gap-1.5">
                <Banknote
                  size={15}
                  className="shrink-0 text-[#109589]"
                />
                <span className="font-medium text-slate-600">
                  {salaryText}
                </span>
              </span>
            )}
          </div>

          {/* Category and Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.category?.name && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5145E5]/10 bg-[#5145E5]/[0.07] px-3 py-1 text-xs font-bold text-[#5145E5]">
                <Sparkles size={12} />
                {job.category.name}
              </span>
            )}

            {job.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill.id || skill.slug || skill.name}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:border-[#109589]/15"
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* Bottom accent */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-medium text-slate-400">
              Explore opportunity
            </span>

            <span className="bg-gradient-to-r from-[#5145E5] to-[#109589] bg-clip-text text-xs font-bold text-transparent">
              View details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}