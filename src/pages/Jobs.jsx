import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
  Zap,
} from "lucide-react";

import Navbar, { DISPLAY_FONT } from "../components/Navbar";
import JobCard, { timeAgo } from "../components/JobCard";
import CopilotBanner from "../components/CopilotBanner";
import api from "../api/api";
import { startCheckout } from "../components/checkout/Checkout";

/* ------------------------------------------------------------------ */
/* Config: values must match your Django filters                        */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 20;
const ME_ENDPOINT = "/auth/me/";      // returns { subscription_tier, has_profile } or 401
const STATS_ENDPOINT = "/jobs/stats/"; // optional: { active_count, last_synced_at }
const ACTIVE_TIERS = ["trial", "monthly_active"];

const WORK_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];
const EXPERIENCE = [
  { value: "entry", label: "Entry level" },
  { value: "mid_senior", label: "Mid-senior" },
  { value: "principal", label: "Principal / executive" },
];
const ATS_SOURCES = [
  { value: "greenhouse", label: "Greenhouse" },
  { value: "lever", label: "Lever" },
  { value: "workday", label: "Workday" },
  { value: "ashby", label: "Ashby" },
  { value: "smartrecruiters", label: "SmartRecruiters" },
];
const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];
const SALARY = { min: 50000, max: 250000, step: 10000 };

const LIST_KEYS = ["work_type", "experience", "source_ats"];
const FILTER_KEYS = [
  "search", "location", "min_match", "work_type", "experience", "salary_min",
  "source_ats", "auto_apply", "category", "company", "skill", "employment_type",
];

const readList = (params, key) => (params.get(key) || "").split(",").filter(Boolean);
const results = (data) => (Array.isArray(data) ? data : data?.results || []);
const money = (n) => `$${Math.round(n / 1000)}k`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Jobs() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [stats, setStats] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [options, setOptions] = useState({ categories: [], companies: [], skills: [] });

  const [searchText, setSearchText] = useState(params.get("search") || "");
  const [placeText, setPlaceText] = useState(params.get("location") || "");
  const [salaryDraft, setSalaryDraft] = useState(Number(params.get("salary_min")) || SALARY.min);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  const page = Math.max(1, Number(params.get("page")) || 1);
  const ordering = params.get("ordering") || "-posted_at";
  const signedIn = Boolean(viewer);
  const subscribed = ACTIVE_TIERS.includes(viewer?.subscription_tier);

  // Old links (e.g. the homepage "Remote only" tag) used ?remote=true.
  useEffect(() => {
    if (params.get("remote") === "true") {
      const next = new URLSearchParams(params);
      next.delete("remote");
      if (!readList(next, "work_type").includes("remote")) {
        next.set("work_type", [...readList(next, "work_type"), "remote"].join(","));
      }
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  // Keep text inputs and slider in sync with back/forward navigation.
  useEffect(() => {
    setSearchText(params.get("search") || "");
    setPlaceText(params.get("location") || "");
    setSalaryDraft(Number(params.get("salary_min")) || SALARY.min);
  }, [params]);

  // One-off loads: viewer, inventory stats, filter options. All optional.
  useEffect(() => {
    let cancelled = false;
    api.get(ME_ENDPOINT).then(({ data }) => !cancelled && setViewer(data)).catch(() => {});
    api.get(STATS_ENDPOINT).then(({ data }) => !cancelled && setStats(data)).catch(() => {});
    Promise.all([api.get("/categories/"), api.get("/companies/"), api.get("/skills/")])
      .then(([c, co, s]) => {
        if (!cancelled) setOptions({ categories: results(c.data), companies: results(co.data), skills: results(s.data) });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const apiQuery = useMemo(() => {
    const q = new URLSearchParams();
    FILTER_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) q.set(key, value);
    });
    q.set("ordering", ordering);
    q.set("page", String(page));
    q.set("page_size", String(PAGE_SIZE));
    return q.toString();
  }, [params, ordering, page]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get(`/jobs/?${apiQuery}`)
      .then(({ data }) => {
        if (cancelled) return;
        const list = results(data);
        setJobs(list);
        setCount(typeof data?.count === "number" ? data.count : list.length);
      })
      .catch((err) => {
        if (cancelled) return;
        // DRF returns 404 for a page past the end, e.g. after filters shrink results.
        if (err?.response?.status === 404 && page > 1) {
          updateParams({ page: "" });
          return;
        }
        setError("Jobs didn't load. Check your connection and try again.");
        setJobs([]);
        setCount(0);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiQuery, reloadKey]);

  /* ---------------- URL helpers ---------------- */

  function updateParams(changes) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      const empty = value === "" || value == null || value === false || (Array.isArray(value) && value.length === 0);
      if (empty) next.delete(key);
      else next.set(key, Array.isArray(value) ? value.join(",") : String(value));
    });
    if (!("page" in changes)) next.delete("page"); // any filter change returns to page 1
    setParams(next);
  }

  const toggleInList = (key, value) => {
    const current = readList(params, key);
    updateParams({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };

  const commitSalary = () => updateParams({ salary_min: salaryDraft > SALARY.min ? salaryDraft : "" });

  const clearAll = () => {
    setParams(params.get("ordering") ? { ordering } : {});
    setDrawerOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchText.trim(), location: placeText.trim() });
  };

  const goToPage = (n) => {
    updateParams({ page: n > 1 ? n : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- Checkout / auto-apply ---------------- */

  const activateCopilot = async (busyKey = "banner") => {
    setCheckoutError("");
    setCheckoutBusy(busyKey);
    try {
      await startCheckout("trial", navigate);
    } catch {
      setCheckoutError("The payment page didn't open. Check your connection and try again.");
    } finally {
      setCheckoutBusy(null);
    }
  };

  const handleAutoApply = (job) => {
    if (subscribed) {
      navigate(`/copilot/apply/${job.slug || job.id}`);
    } else {
      activateCopilot(job.id);
    }
  };

  /* ---------------- Derived UI ---------------- */

  const chips = useMemo(() => buildChips(params, options), [params, options]);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const inventory = stats?.active_count ?? null;
  const synced = timeAgo(stats?.last_synced_at);

  const panelProps = {
    params, toggleInList, updateParams, salaryDraft, setSalaryDraft, commitSalary,
    signedIn, options, activeCount: chips.length, onClear: clearAll,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#10162F]">

      <main>
        {/* ---------------- HERO + SEARCH ---------------- */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-6 sm:pt-14 lg:px-8">
            {(inventory || count > 0) && (
              <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-slate-200 bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-semibold text-slate-600 sm:text-sm">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#14E0C8] opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#109589]" />
                  </span>
                  {(inventory ?? count).toLocaleString()} active roles
                </span>
                {synced && <span className="text-slate-400">Last synced {synced}</span>}
              </p>
            )}

            <h1 className={`${DISPLAY_FONT} mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl`}>
              {inventory || count ? `Explore ${(inventory ?? count).toLocaleString()} verified tech roles` : "Explore verified tech roles"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Every listing is re-checked against the employer's ATS each day. Add your CV to see
              your match score on every role, and let QAOA pick your strongest shortlist.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/[0.04] focus-within:border-[#5145E5]/50"
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="flex min-w-0 flex-[1.3] items-center gap-3 px-4 py-3">
                  <Search size={19} className="shrink-0 text-[#5145E5]" />
                  <span className="sr-only">Job title, tech stack or keyword</span>
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Job title, tech stack or keyword (e.g. Python, React)"
                    className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </label>
                <div className="hidden h-8 w-px bg-slate-200 md:block" />
                <label className="flex min-w-0 flex-1 items-center gap-3 border-t border-slate-100 px-4 py-3 md:border-t-0">
                  <MapPin size={19} className="shrink-0 text-[#109589]" />
                  <span className="sr-only">Location or region</span>
                  <input
                    value={placeText}
                    onChange={(e) => setPlaceText(e.target.value)}
                    placeholder="Remote, Nairobi, London, Berlin"
                    className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#5145E5] to-[#109589] px-6 py-3.5 text-sm font-extrabold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2"
                >
                  Search jobs
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ---------------- RESULTS ---------------- */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
            {/* Filters (desktop) */}
            <aside className="hidden lg:block" aria-label="Filters">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
                <FilterPanel {...panelProps} />
              </div>
            </aside>

            {/* Feed */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <p className="text-sm text-slate-600" aria-live="polite">
                  {loading ? "Searching…" : (
                    <>
                      <span className="font-bold text-[#10162F]">{count.toLocaleString()}</span>{" "}
                      {count === 1 ? "job" : "jobs"} found
                    </>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold lg:hidden"
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                    {chips.length > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5145E5] px-1.5 text-[11px] text-white">
                        {chips.length}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <select
                      value={ordering}
                      onChange={(e) => updateParams({ ordering: e.target.value })}
                      aria-label="Sort jobs"
                      className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold outline-none focus:border-[#5145E5]"
                    >
                      {signedIn && <option value="-match_score">Best match</option>}
                      <option value="-posted_at">Newest</option>
                      <option value="-salary_max">Highest salary</option>
                      <option value="salary_min">Lowest salary</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {chips.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <li key={chip.id}>
                      <button
                        type="button"
                        onClick={() => chip.remove(params, updateParams)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#5145E5]/25 bg-[#5145E5]/[0.06] py-1 pl-3 pr-2 text-xs font-bold text-[#4338CA] hover:bg-[#5145E5]/10"
                        aria-label={`Remove filter: ${chip.label}`}
                      >
                        {chip.label}
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                  <li>
                    <button type="button" onClick={clearAll} className="px-2 py-1 text-xs font-bold text-slate-500 hover:text-[#10162F]">
                      Clear all
                    </button>
                  </li>
                </ul>
              )}

              {checkoutError && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{checkoutError}</p>}

              <div className="mt-6">
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm font-semibold text-red-700">{error}</p>
                    <button
                      type="button"
                      onClick={() => setReloadKey((k) => k + 1)}
                      className="mt-3 flex items-center gap-2 text-sm font-bold text-red-700"
                    >
                      <RefreshCw size={15} />
                      Try again
                    </button>
                  </div>
                ) : loading ? (
                  <div className="space-y-4" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white motion-reduce:animate-none" />
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <EmptyState
                    onReset={clearAll}
                    onAlerts={() => activateCopilot("empty")}
                    busy={checkoutBusy === "empty"}
                    subscribed={subscribed}
                  />
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job, i) => (
                      <div key={job.id ?? job.slug}>
                        <JobCard
                          job={job}
                          onAutoApply={handleAutoApply}
                          autoApplyBusy={checkoutBusy === job.id}
                          subscribed={subscribed}
                        />
                        {/* Banner sits in the right column on xl; inline after 3rd job below that */}
                        {i === 2 && (
                          <CopilotBanner
                            className="mt-4 xl:hidden"
                            onActivate={() => activateCopilot("inline")}
                            busy={checkoutBusy === "inline"}
                            subscribed={subscribed}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!loading && !error && count > PAGE_SIZE && (
                <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>
                  <p className="text-sm text-slate-600">
                    Page <span className="font-bold text-[#10162F]">{page.toLocaleString()}</span> of{" "}
                    <span className="font-bold text-[#10162F]">{totalPages.toLocaleString()}</span>
                  </p>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#10162F] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </nav>
              )}
            </div>

            {/* Sticky Copilot banner (xl) */}
            <div className="hidden xl:block">
              <CopilotBanner
                className="sticky top-24"
                onActivate={() => activateCopilot("banner")}
                busy={checkoutBusy === "banner"}
                subscribed={subscribed}
              />
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- MOBILE FILTER DRAWER ---------------- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-[#10162F]/50"
          />
          <div className="absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className={`${DISPLAY_FONT} text-lg font-bold`}>Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel {...panelProps} />
            </div>
            <div className="border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-xl bg-[#5145E5] px-4 py-3 text-sm font-extrabold text-white"
              >
                {loading ? "Updating…" : `Show ${count.toLocaleString()} ${count === 1 ? "job" : "jobs"}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Filter panel (defined outside the page so inputs don't remount)      */
/* ------------------------------------------------------------------ */

function FilterPanel({
  params, toggleInList, updateParams, salaryDraft, setSalaryDraft, commitSalary,
  signedIn, options, activeCount, onClear,
}) {
  const highMatch = params.get("min_match") === "80";
  const autoApply = params.get("auto_apply") === "true";

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <SlidersHorizontal size={17} className="text-[#5145E5]" />
          Refine results
        </h2>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-xs font-bold text-slate-500 hover:text-[#10162F]">
            Clear all
          </button>
        )}
      </div>

      {/* Match precision */}
      <div>
        <button
          type="button"
          role="switch"
          aria-checked={highMatch}
          disabled={!signedIn}
          onClick={() => updateParams({ min_match: highMatch ? "" : "80" })}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition disabled:cursor-not-allowed ${
            highMatch ? "border-[#5145E5] bg-[#5145E5]/[0.06] text-[#4338CA]" : "border-slate-200 bg-white"
          } ${!signedIn ? "opacity-60" : ""}`}
        >
          <Zap size={17} className={highMatch ? "text-[#5145E5]" : "text-slate-400"} />
          <span className="flex-1">Only 80%+ match</span>
          <span className={`relative h-5 w-9 rounded-full transition ${highMatch ? "bg-[#5145E5]" : "bg-slate-300"}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${highMatch ? "left-[18px]" : "left-0.5"}`} />
          </span>
        </button>
        {!signedIn && (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            <Link to="/login" className="font-bold text-[#5145E5] hover:underline">Sign in</Link> and add your CV to see match scores.
          </p>
        )}
      </div>

      <CheckGroup title="Work location" items={WORK_TYPES} selected={readList(params, "work_type")} onToggle={(v) => toggleInList("work_type", v)} />
      <CheckGroup title="Experience level" items={EXPERIENCE} selected={readList(params, "experience")} onToggle={(v) => toggleInList("experience", v)} />

      <fieldset>
        <legend className="text-sm font-bold">Minimum salary (USD)</legend>
        <p className="mt-1 text-sm text-slate-600" aria-live="polite">
          {salaryDraft > SALARY.min
            ? `${money(salaryDraft)}${salaryDraft >= SALARY.max ? "+" : " or more"}`
            : "Any salary"}
        </p>
        <input
          type="range"
          min={SALARY.min}
          max={SALARY.max}
          step={SALARY.step}
          value={salaryDraft}
          onChange={(e) => setSalaryDraft(Number(e.target.value))}
          onPointerUp={commitSalary}
          onKeyUp={commitSalary}
          aria-label="Minimum annual salary"
          className="mt-3 w-full accent-[#5145E5]"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>{money(SALARY.min)}</span>
          <span>{money(SALARY.max)}+</span>
        </div>
      </fieldset>

      <CheckGroup title="Applies via" items={ATS_SOURCES} selected={readList(params, "source_ats")} onToggle={(v) => toggleInList("source_ats", v)} />

      <fieldset>
        <legend className="text-sm font-bold">Automation</legend>
        <CheckRow
          label="1-click auto-apply eligible"
          checked={autoApply}
          onChange={() => updateParams({ auto_apply: autoApply ? "" : "true" })}
        />
      </fieldset>

      {/* Existing filters, tucked away */}
      <details className="group border-t border-slate-200 pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold [&::-webkit-details-marker]:hidden">
          More filters
          <ChevronDown size={16} className="text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-4">
          <SelectFilter label="Category" value={params.get("category") || ""} onChange={(v) => updateParams({ category: v })} items={options.categories} all="All categories" />
          <SelectFilter label="Company" value={params.get("company") || ""} onChange={(v) => updateParams({ company: v })} items={options.companies} all="All companies" />
          <SelectFilter label="Skill" value={params.get("skill") || ""} onChange={(v) => updateParams({ skill: v })} items={options.skills} all="All skills" />
          <SelectFilter
            label="Employment type"
            value={params.get("employment_type") || ""}
            onChange={(v) => updateParams({ employment_type: v })}
            items={EMPLOYMENT_TYPES.map((t) => ({ slug: t.value, name: t.label }))}
            all="All employment types"
          />
        </div>
      </details>
    </div>
  );
}

function CheckGroup({ title, items, selected, onToggle }) {
  return (
    <fieldset>
      <legend className="text-sm font-bold">{title}</legend>
      <div className="mt-2 space-y-0.5">
        {items.map((item) => (
          <CheckRow key={item.value} label={item.label} checked={selected.includes(item.value)} onChange={() => onToggle(item.value)} />
        ))}
      </div>
    </fieldset>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-sm text-slate-700 hover:text-[#10162F]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#5145E5] peer-focus-visible:ring-offset-1 ${
          checked ? "border-[#5145E5] bg-[#5145E5] text-white" : "border-slate-300 bg-white"
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

function SelectFilter({ label, value, onChange, items, all }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div className="relative mt-1.5">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-semibold outline-none focus:border-[#5145E5]"
        >
          <option value="">{all}</option>
          {items.map((item) => (
            <option key={item.id ?? item.slug} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function EmptyState({ onReset, onAlerts, busy, subscribed }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5145E5]/10 text-[#5145E5]">
        <SearchX size={26} />
      </div>
      <h2 className={`${DISPLAY_FONT} mt-5 text-xl font-bold`}>No jobs match these filters</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Try a wider location or different keywords.
        {subscribed
          ? " Your Copilot will email you when matching roles arrive."
          : " Or start the Copilot trial and we'll email you when matching roles arrive."}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white hover:bg-[#4338CA]"
        >
          Reset filters and view all jobs
        </button>
        {!subscribed && (
          <button
            type="button"
            onClick={onAlerts}
            disabled={busy}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold hover:border-[#5145E5]/50 disabled:opacity-60"
          >
            {busy ? "Opening checkout…" : "Get job alerts, $9.99 for 7 days"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Active filter chips                                                  */
/* ------------------------------------------------------------------ */

function buildChips(params, options) {
  const chips = [];
  const labelFrom = (list, value) => list.find((i) => i.value === value)?.label || value;
  const nameFrom = (list, slug) => list.find((i) => i.slug === slug)?.name || slug;
  const simple = (key, label) => {
    if (params.get(key)) chips.push({ id: key, label, remove: (_p, update) => update({ [key]: "" }) });
  };

  simple("search", `"${params.get("search")}"`);
  simple("location", params.get("location"));
  simple("min_match", "80%+ match");
  if (params.get("salary_min")) simple("salary_min", `${money(Number(params.get("salary_min")))}+ salary`);
  simple("auto_apply", "Auto-apply eligible");

  const listSources = { work_type: WORK_TYPES, experience: EXPERIENCE, source_ats: ATS_SOURCES };
  LIST_KEYS.forEach((key) => {
    readList(params, key).forEach((value) => {
      chips.push({
        id: `${key}:${value}`,
        label: labelFrom(listSources[key], value),
        remove: (p, update) => update({ [key]: readList(p, key).filter((v) => v !== value) }),
      });
    });
  });

  if (params.get("category")) simple("category", nameFrom(options.categories, params.get("category")));
  if (params.get("company")) simple("company", nameFrom(options.companies, params.get("company")));
  if (params.get("skill")) simple("skill", nameFrom(options.skills, params.get("skill")));
  if (params.get("employment_type")) {
    simple("employment_type", EMPLOYMENT_TYPES.find((t) => t.value === params.get("employment_type"))?.label);
  }
  return chips;
}