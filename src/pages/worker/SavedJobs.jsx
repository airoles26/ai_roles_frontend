
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Search,
  MapPin,
  Building2,
  ArrowUpRight,
  Trash2,
  Loader2,
  BriefcaseBusiness,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock3,
  SlidersHorizontal,
} from "lucide-react";
import Swal from "sweetalert2";

import { savedJobsApi } from "../../api/api";

const PAGE_SIZE = 9;

function formatDate(value) {
  if (!value) return "Recently saved";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently saved";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSalary(job) {
  const min = Number(job.salary_min);
  const max = Number(job.salary_max);

  if (!job.salary_min && !job.salary_max) {
    return null;
  }

  const currency = job.currency || "USD";
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  });

  if (job.salary_min && job.salary_max) {
    return `${currency} ${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (job.salary_min) {
    return `From ${currency} ${formatter.format(min)}`;
  }

  return `Up to ${currency} ${formatter.format(max)}`;
}

function JobCard({ job, onRemove, removing }) {
  const salary = formatSalary(job);

  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#5145E5]/30 hover:shadow-xl hover:shadow-indigo-100/40 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0EEFF] text-[#5145E5]">
          <Building2 size={25} />
        </div>

        <button
          type="button"
          disabled={removing}
          onClick={() => onRemove(job)}
          title="Remove saved job"
          aria-label={`Remove ${job.title} from saved jobs`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          {removing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-[#5145E5]">
          {job.company_name || "Company"}
        </p>

        <Link
          to={`/jobs/${job.job_id}`}
          className="line-clamp-2 text-lg font-bold leading-snug text-[#18124A] transition hover:text-[#5145E5]"
        >
          {job.title}
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.remote && (
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            Remote
          </span>
        )}

        {job.category && (
          <span className="max-w-full truncate rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {job.category}
          </span>
        )}

        {!job.is_active && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            No longer active
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0" />
          <span className="line-clamp-1">
            {job.location || "Location not specified"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 size={16} className="shrink-0" />
          <span>Saved {formatDate(job.created_at)}</span>
        </div>

        {salary && (
          <div className="text-sm font-semibold text-[#18124A]">
            {salary}
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-4 h-px bg-slate-100" />

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.job_id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#5145E5]/20 px-4 py-3 text-sm font-semibold text-[#5145E5] transition hover:bg-indigo-50"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>

          {job.is_active && job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4034C8]"
            >
              Apply Now
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SavedJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const loadJobs = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await savedJobsApi.getSavedJobs({
        page,
        page_size: PAGE_SIZE,
        search: debouncedSearch,
        sort,
      });

      if (signal.cancelled) return;

      const data = response.data;

      setJobs(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : []
      );

      setCount(
        Array.isArray(data)
          ? data.length
          : Number(data.count || 0)
      );
    } catch (err) {
      if (signal.cancelled) return;

      if (err.response?.status === 401) {
        navigate("/signin", { replace: true });
        return;
      }

      setError(
        err.response?.data?.detail ||
          "Unable to load saved jobs. Please try again."
      );
    } finally {
      if (!signal.cancelled) {
        setLoading(false);
      }
    }
  }, [page, debouncedSearch, sort, navigate]);

  useEffect(() => {
    const signal = { cancelled: false };

    loadJobs(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [loadJobs, reloadKey]);

  const handleRemove = async (job) => {
    const confirmation = await Swal.fire({
      title: "Remove saved job?",
      text: `Remove "${job.title}" from your saved jobs?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#5145E5",
    });

    if (!confirmation.isConfirmed) return;

    setRemovingId(job.job_id);

    try {
      await savedJobsApi.removeSavedJob(job.job_id);

      setJobs((current) =>
        current.filter(
          (item) => item.job_id !== job.job_id
        )
      );

      setCount((current) => Math.max(0, current - 1));

      // If the final item on a page was removed,
      // navigate to the previous page.
      if (jobs.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setReloadKey((current) => current + 1);
      }

      Swal.fire({
        icon: "success",
        title: "Job removed",
        text: "The job was removed from your saved list.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Unable to remove job",
        text:
          err.response?.data?.message ||
          "Please try again.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(count / PAGE_SIZE)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#18124A] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#5145E5]/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-20 h-36 w-36 rounded-full bg-[#14E0C8]/15 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-indigo-100">
              <Bookmark size={15} />
              Your Career Collection
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Saved Jobs
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
              Keep your favorite opportunities in one place.
              Explore, compare, and apply when you're ready.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold">
                <Bookmark size={16} />
                {count} matching saved jobs
              </span>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-4 py-2.5 text-sm font-bold text-[#18124A] transition hover:bg-teal-300"
              >
                Explore Jobs
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* Search and filters */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title, company, location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-[#18124A] outline-none transition focus:border-[#5145E5] focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div className="relative md:w-52">
              <SlidersHorizontal
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-[#5145E5]"
              >
                <option value="newest">Recently Saved</option>
                <option value="oldest">Oldest Saved</option>
                <option value="title">Job Title A–Z</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setReloadKey((v) => v + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </section>

        {/* Section heading */}
        <div className="mb-5 mt-9 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#18124A]">
              Your Opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Jobs you've bookmarked for later.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white">
            <Loader2
              size={34}
              className="animate-spin text-[#5145E5]"
            />
            <p className="text-sm text-slate-500">
              Loading your saved jobs...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-white px-6 py-14 text-center">
            <AlertCircle size={35} className="text-red-500" />
            <p className="text-sm text-slate-600">{error}</p>
            <button
              onClick={() => setReloadKey((v) => v + 1)}
              className="rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && jobs.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
              <BriefcaseBusiness
                size={35}
                className="text-[#5145E5]"
              />
            </div>

            <h3 className="text-xl font-extrabold text-[#18124A]">
              {debouncedSearch
                ? "No matching saved jobs"
                : "No saved jobs yet"}
            </h3>

            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
              {debouncedSearch
                ? "Try searching for a different title, company, or location."
                : "Found an interesting opportunity? Save it and return to it whenever you're ready."}
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4034C8]"
            >
              Browse Available Jobs
              <ArrowUpRight size={17} />
            </Link>
          </div>
        )}

        {/* Job cards */}
        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onRemove={handleRemove}
                  removing={removingId === job.job_id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4034C8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
