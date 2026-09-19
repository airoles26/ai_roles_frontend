import {
  MapPin,
  Clock3,
  Building2,
  ArrowUpRight,
  Banknote,
} from "lucide-react";

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
  if (!job.salary_min && !job.salary_max) {
    return null;
  }

  const currency = job.currency || "USD";

  const format = (value) =>
    Number(value).toLocaleString();

  if (job.salary_min && job.salary_max) {
    return `${currency} ${format(job.salary_min)} - ${format(
      job.salary_max
    )}`;
  }

  if (job.salary_min) {
    return `${currency} ${format(job.salary_min)}+`;
  }

  return `Up to ${currency} ${format(job.salary_max)}`;
}

export default function JobCard({ job }) {
  const salaryText = salary(job);

  return (
    <a
      href={`/jobs/${job.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {job.company?.logo_url ? (
            <img
              src={job.company.logo_url}
              alt={job.company.name}
              className="h-full w-full object-contain p-1.5"
            />
          ) : (
            <Building2
              size={21}
              className="text-slate-500"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-semibold text-indigo-600">
                {job.company?.name || "Company"}
              </p>

              <h3 className="text-base font-extrabold leading-snug text-slate-950 transition group-hover:text-indigo-600 sm:text-lg">
                {job.title}
              </h3>
            </div>

            <div className="rounded-lg bg-slate-50 p-2 text-slate-400 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {job.remote
                ? "Remote"
                : job.location || "Location flexible"}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={15} />
              {formatDate(job.posted_at)}
            </span>

            {salaryText && (
              <span className="flex items-center gap-1.5">
                <Banknote size={15} />
                {salaryText}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.category?.name && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {job.category.name}
              </span>
            )}

            {job.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill.id || skill.slug}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}