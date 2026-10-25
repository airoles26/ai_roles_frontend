import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  MapPin,
  Share2,
  Sparkles,
  Tag,
  Wifi,
  AlertCircle,
  RefreshCw,
} from "lucide-react";


import api from "../api/api";

const BRAND = {
  navy: "#071A3D",
  teal: "#1699A4",
  tealDark: "#147C91",
  gold: "#E6A064",
  background: "#F7FAFC",
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not specified";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRelativeDate(date) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  const difference = Date.now() - parsed.getTime();
  const days = Math.floor(difference / 86400000);

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";

  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);

  if (months === 1) return "1 month ago";

  if (months < 12) {
    return `${months} months ago`;
  }

  return formatDate(date);
}

function formatSalary(job) {
  const hasMin =
    job?.salary_min !== null &&
    job?.salary_min !== undefined &&
    job?.salary_min !== "";

  const hasMax =
    job?.salary_max !== null &&
    job?.salary_max !== undefined &&
    job?.salary_max !== "";

  if (!hasMin && !hasMax) {
    return null;
  }

  const currency = job.currency || "USD";

  const formatNumber = (value) =>
    Number(value).toLocaleString("en-US");

  if (hasMin && hasMax) {
    return `${currency} ${formatNumber(
      job.salary_min
    )} - ${formatNumber(job.salary_max)}`;
  }

  if (hasMin) {
    return `${currency} ${formatNumber(job.salary_min)}+`;
  }

  return `Up to ${currency} ${formatNumber(
    job.salary_max
  )}`;
}

function formatEmploymentType(value) {
  if (!value) {
    return "Not specified";
  }

  const labels = {
    full_time: "Full-time",
    part_time: "Part-time",
    contract: "Contract",
    internship: "Internship",
    temporary: "Temporary",
    freelance: "Freelance",
    apprenticeship: "Apprenticeship",
    volunteer: "Volunteer",
  };

  return (
    labels[value] ||
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function getCompanyName(job) {
  return job?.company?.name || "Company not specified";
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function JobDetails() {
  const { slug } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD JOB
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadJob = async () => {
      if (!slug) {
        setError("The job link is invalid or incomplete.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setJob(null);

        const response = await api.get(`/jobs/${slug}/`);

        if (!cancelled) {
          setJob(response.data);
        }
      } catch (err) {
        console.error("Failed loading job:", err);

        if (!cancelled) {
          if (err.response?.status === 404) {
            setError(
              "This job could not be found or may no longer be active."
            );
          } else {
            setError(
              "We couldn't load this job. Please check your connection and try again."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJob();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /*
  |--------------------------------------------------------------------------
  | SHARE
  |--------------------------------------------------------------------------
  */

  const handleShare = async () => {
    const shareData = {
      title: job?.title
        ? `${job.title} at ${getCompanyName(job)} | Quantahire`
        : "Job opportunity | Quantahire",

      text: job?.title
        ? `Discover this ${job.title} opportunity at ${getCompanyName(
            job
          )} on Quantahire.`
        : "Discover job opportunities on Quantahire.",

      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          window.location.href
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);

        return;
      }

      // Fallback for browsers without the Clipboard API.
      window.prompt(
        "Copy this link to share the job:",
        window.location.href
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Could not share job:", err);
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC]">

        <main>
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 h-5 w-36 animate-pulse rounded bg-slate-200" />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
              <div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="flex gap-5">
                    <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-100" />

                    <div className="flex-1">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                      <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8">
                  <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />

                  <div className="mt-6 space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="h-4 animate-pulse rounded bg-slate-100"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
            </div>
          </div>
        </main>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F7FAFC]">

        <main className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={27} />
            </div>

            <h1
              className="mt-5 text-2xl font-black"
              style={{ color: BRAND.navy }}
            >
              Job unavailable
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error || "This job could not be found."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-90"
                style={{ backgroundColor: BRAND.teal }}
              >
                <ArrowLeft size={16} />
                Browse jobs
              </Link>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          </div>
        </main>

  
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | JOB DATA
  |--------------------------------------------------------------------------
  */

  const salary = formatSalary(job);

  const location = job.remote
    ? job.location
      ? `Remote · ${job.location}`
      : "Remote"
    : job.location || job.country || "Location not specified";

  const applyUrl = job.apply_url || job.source_url;

  const companySlug = job.company?.slug;

  return (
    <div className="min-h-screen bg-[#F7FAFC]">

      <main>
        {/* TOP AREA */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
            <Link
              to="/jobs"
              className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#1699A4]"
            >
              <ArrowLeft size={16} />
              Back to jobs
            </Link>

            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-start">
              <div className="flex min-w-0 gap-4 sm:gap-5">
                {/* COMPANY LOGO */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:h-20 sm:w-20">
                  {job.company?.logo_url ? (
                    <img
                      src={job.company.logo_url}
                      alt={`${getCompanyName(job)} logo`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Building2
                      size={28}
                      className="text-[#1699A4]"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {job.company?.name &&
                      (companySlug ? (
                        <Link
                          to={`/companies/${companySlug}`}
                          className="font-extrabold text-[#147C91] transition hover:text-[#071A3D]"
                        >
                          {job.company.name}
                        </Link>
                      ) : (
                        <span className="font-extrabold text-[#147C91]">
                          {job.company.name}
                        </span>
                      ))}

                    {job.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E6A064]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#9A5B22]">
                        <Sparkles size={11} />
                        Featured
                      </span>
                    )}
                  </div>

                  <h1
                    className="break-words text-2xl font-black leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl"
                    style={{ color: BRAND.navy }}
                  >
                    {job.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {location}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness size={16} />
                      {formatEmploymentType(job.employment_type)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={16} />
                      Posted {formatRelativeDate(job.posted_at)}
                    </span>

                    {salary && (
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Banknote size={16} />
                        {salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* DESKTOP AND MOBILE ACTIONS */}
              <div className="flex shrink-0 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  {copied ? (
                    <>
                      <CheckCircle2
                        size={17}
                        className="text-emerald-500"
                      />
                      Link copied
                    </>
                  ) : (
                    <>
                      <Share2 size={17} />
                      Share job
                    </>
                  )}
                </button>

                {applyUrl && (
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#1699A4]/20 transition hover:-translate-y-0.5 hover:opacity-90"
                    style={{ backgroundColor: BRAND.teal }}
                  >
                    Apply now
                    <ArrowUpRight size={17} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
            {/* LEFT */}
            <div className="min-w-0 space-y-6">
              {/* QUICK DETAILS */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  icon={MapPin}
                  label="Location"
                  value={location}
                />

                <InfoCard
                  icon={BriefcaseBusiness}
                  label="Job type"
                  value={formatEmploymentType(job.employment_type)}
                />

                <InfoCard
                  icon={Wifi}
                  label="Work arrangement"
                  value={job.remote ? "Remote" : "On-site / Hybrid"}
                />

                <InfoCard
                  icon={Banknote}
                  label="Salary"
                  value={salary || "Not disclosed"}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2
                  className="text-xl font-black"
                  style={{ color: BRAND.navy }}
                >
                  About this opportunity
                </h2>

                <div className="mt-6">
                  <JobDescription description={job.description} />
                </div>
              </div>

              {/* SKILLS */}
              {job.skills?.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-center gap-2">
                    <Tag
                      size={19}
                      className="text-[#1699A4]"
                    />

                    <h2
                      className="text-xl font-black"
                      style={{ color: BRAND.navy }}
                    >
                      Skills and qualifications
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Explore the skills and technologies associated with
                    this opportunity.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Link
                        key={skill.id || skill.slug || skill.name || index}
                        to={
                          skill.slug
                            ? `/jobs?skill=${encodeURIComponent(
                                skill.slug
                              )}`
                            : "/jobs"
                        }
                        className="rounded-full border border-[#1699A4]/20 bg-[#1699A4]/5 px-4 py-2 text-sm font-bold text-[#147C91] transition hover:border-[#1699A4] hover:bg-[#1699A4] hover:text-white"
                      >
                        {skill.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* APPLICATION CTA */}
              {applyUrl && (
                <div
                  className="relative overflow-hidden rounded-3xl p-7 text-white sm:p-8"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#1699A4]/20 blur-3xl" />

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Sparkles
                        size={21}
                        className="text-[#E6A064]"
                      />
                    </div>

                    <h2 className="mt-5 text-2xl font-black">
                      Ready to take the next step?
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                      Visit the employer's application page to review the
                      complete requirements and submit your application.
                    </p>

                    <a
                      href={applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1699A4] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#147C91]"
                    >
                      Apply for this job
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}

              {!applyUrl && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex gap-3">
                    <AlertCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                      <h3 className="font-extrabold text-amber-900">
                        Application link unavailable
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        An application link has not been provided for this
                        listing. Review the job details and check the
                        employer's website for further information.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside>
              <div className="space-y-5 lg:sticky lg:top-24">
                {/* COMPANY */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#1699A4]">
                    About the employer
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {job.company?.logo_url ? (
                        <img
                          src={job.company.logo_url}
                          alt={`${getCompanyName(job)} logo`}
                          className="h-full w-full object-contain p-1.5"
                        />
                      ) : (
                        <Building2
                          size={21}
                          className="text-[#1699A4]"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="break-words font-black"
                        style={{ color: BRAND.navy }}
                      >
                        {getCompanyName(job)}
                      </h3>

                      {job.company?.active_jobs_count !== undefined && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {job.company.active_jobs_count} active jobs
                        </p>
                      )}
                    </div>
                  </div>

                  {job.company?.description && (
                    <p className="mt-4 line-clamp-5 text-sm leading-6 text-slate-500">
                      {job.company.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2">
                    {companySlug && (
                      <Link
                        to={`/jobs?company=${encodeURIComponent(
                          companySlug
                        )}`}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#1699A4]/40 hover:bg-[#1699A4]/5"
                      >
                        View company jobs
                        <ArrowUpRight size={16} />
                      </Link>
                    )}

                    {job.company?.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        Company website
                        <Globe2 size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* JOB INFO */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3
                    className="font-black"
                    style={{ color: BRAND.navy }}
                  >
                    Job overview
                  </h3>

                  <div className="mt-5 space-y-5">
                    <SidebarDetail
                      icon={CalendarDays}
                      label="Date posted"
                      value={formatDate(job.posted_at)}
                    />

                    {job.category?.name && (
                      <SidebarDetail
                        icon={BriefcaseBusiness}
                        label="Category"
                        value={job.category.name}
                      />
                    )}

                    <SidebarDetail
                      icon={MapPin}
                      label="Location"
                      value={location}
                    />

                    <SidebarDetail
                      icon={BriefcaseBusiness}
                      label="Employment type"
                      value={formatEmploymentType(job.employment_type)}
                    />

                    {job.source && (
                      <SidebarDetail
                        icon={Globe2}
                        label="Listing source"
                        value={
                          job.source.charAt(0).toUpperCase() +
                          job.source.slice(1)
                        }
                      />
                    )}
                  </div>
                </div>

                {/* APPLICATION NOTE */}
                <div className="rounded-3xl border border-[#1699A4]/20 bg-[#1699A4]/5 p-5">
                  <div className="flex gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-[#1699A4]"
                    />

                    <div>
                      <h4
                        className="text-sm font-extrabold"
                        style={{ color: BRAND.navy }}
                      >
                        Apply through the employer
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Quantahire helps you discover job opportunities.
                        When an external application link is available,
                        applications are completed through the employer's
                        hiring page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| INFO CARD
|--------------------------------------------------------------------------
*/

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1699A4]/10 text-[#1699A4]">
          <Icon size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-extrabold text-[#071A3D]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SIDEBAR DETAIL
|--------------------------------------------------------------------------
*/

function SidebarDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#1699A4]">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| DESCRIPTION
|--------------------------------------------------------------------------
*/

function JobDescription({ description }) {
  if (!description) {
    return (
      <p className="text-sm leading-7 text-slate-500">
        No detailed description is available for this job yet.
      </p>
    );
  }

  /*
   * Job descriptions are generally plain text.
   * Split paragraphs where possible to improve readability.
   */

  const paragraphs = description
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return (
      <div className="space-y-5 whitespace-pre-line text-[15px] leading-7 text-slate-600">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="whitespace-pre-line text-[15px] leading-8 text-slate-600">
      {description}
    </div>
  );
}