import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BriefcaseBusiness, CalendarDays, ChevronLeft, ChevronRight,
  Clock3, FileText, Filter, LoaderCircle, MapPin, RefreshCw, Search,
  Send, ShieldCheck, XCircle, CheckCircle2, ExternalLink,
} from "lucide-react";

import api from "../../api/api";

const STATUS = {
  submitted: { label: "Submitted", className: "bg-blue-50 text-blue-700 ring-blue-200", icon: Send },
  reviewing: { label: "Under review", className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock3 },
  shortlisted: { label: "Shortlisted", className: "bg-violet-50 text-violet-700 ring-violet-200", icon: ShieldCheck },
  interview: { label: "Interview", className: "bg-cyan-50 text-cyan-700 ring-cyan-200", icon: CalendarDays },
  hired: { label: "Hired", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700 ring-rose-200", icon: XCircle },
  withdrawn: { label: "Withdrawn", className: "bg-slate-100 text-slate-600 ring-slate-200", icon: XCircle },
};
const FILTERS = [{ value: "", label: "All applications" }, ...Object.entries(STATUS).map(([value, item]) => ({ value, label: item.label }))];
const canWithdraw = (status) => !["withdrawn", "hired", "rejected"].includes(status);
const formatDate = (date) => date ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "—";

function StatusPill({ value }) {
  const item = STATUS[value] || { label: value || "Unknown", className: "bg-slate-100 text-slate-600 ring-slate-200", icon: Clock3 };
  const Icon = item.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${item.className}`}><Icon size={13} />{item.label}</span>;
}

function ApplicationCard({ item, onWithdraw, busy }) {
  const job = item.job || {};
  const company = typeof job.company === "object" ? job.company : { name: job.company };
  const companyName = company?.name || "Company";
  const logo = company?.logo_url || job.company_logo;
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start gap-3 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-indigo-50 text-lg font-extrabold text-[#5145E5]">
          {logo ? <img src={logo} alt="" className="h-full w-full object-contain p-1" /> : companyName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/jobs/${job.slug || job.id}`} className="text-base font-bold text-[#18124A] hover:text-[#5145E5] sm:text-lg">{job.title || "Untitled job"}</Link>
              <p className="mt-0.5 text-sm font-medium text-slate-600">{companyName}</p>
            </div>
            <StatusPill value={item.status} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 sm:text-sm">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{job.remote ? "Remote" : job.location || "Location not specified"}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />Applied {formatDate(item.applied_at)}</span>
            <span className="inline-flex items-center gap-1.5"><RefreshCw size={14} />Updated {formatDate(item.updated_at)}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <Link to={`/jobs/${job.slug || job.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#5145E5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#4338CA]">View job <ArrowRight size={14} /></Link>
            {item.resume_url && <a href={item.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><FileText size={14} />Resume <ExternalLink size={12} /></a>}
            {canWithdraw(item.status) && <button type="button" disabled={busy} onClick={() => onWithdraw(item)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">{busy ? <LoaderCircle size={14} className="animate-spin" /> : <XCircle size={14} />}Withdraw</button>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, by_status: {} });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [reload, setReload] = useState(0);

  const fetchApplications = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/worker/applications/", {
        params: { ...(statusFilter ? { status: statusFilter } : {}), ...(search ? { search } : {}), ordering, page },
        signal,
      });
      if (signal.aborted) return;
      setItems(data.results || []);
      setStats(data.stats || { total: data.count || 0, by_status: {} });
      setCount(data.count || 0);
      setPages(Math.max(1, data.total_pages || 1));
    } catch (err) {
      if (signal.aborted || err.code === "ERR_CANCELED") return;
      setError(err.response?.data?.detail || "Could not load your applications. Please try again.");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [statusFilter, search, ordering, page]);

  useEffect(() => {
    const controller = new AbortController();
    fetchApplications(controller.signal);
    return () => controller.abort();
  }, [fetchApplications, reload]);

  const submitSearch = (event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); };
  const changeFilter = (value) => { setStatusFilter(value); setPage(1); };

  const confirmWithdrawal = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    setError("");
    setMessage("");
    try {
      await api.post(`/worker/applications/${withdrawTarget.id}/withdraw/`);
      setMessage("Your application was withdrawn successfully.");
      setWithdrawTarget(null);
      setReload((n) => n + 1);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to withdraw this application.");
      setWithdrawTarget(null);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10 text-[#18124A]">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5145E5]">Career workspace</p>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">My Applications</h1>
          <p className="mt-1 text-sm text-slate-500">Track your applications and manage your next career move.</p>
        </div>
        <Link to="/jobs" className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#4338CA]"><Search size={17} />Explore jobs</Link>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total applications", value: stats.total, icon: BriefcaseBusiness },
          { label: "Under review", value: stats.by_status?.reviewing || 0, icon: Clock3 },
          { label: "Shortlisted", value: stats.by_status?.shortlisted || 0, icon: ShieldCheck },
          { label: "Interviews", value: stats.by_status?.interview || 0, icon: CalendarDays },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#5145E5]"><Icon size={19} /></div>
            <p className="text-2xl font-extrabold tabular-nums sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          </div>
        ))}
      </div>

      {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{message}</div>}
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <form onSubmit={submitSearch} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-[#5145E5]">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input aria-label="Search applications" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by job title, company or location" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" />
            <button type="submit" className="text-xs font-bold text-[#5145E5]">Search</button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select aria-label="Filter by status" value={statusFilter} onChange={(e) => changeFilter(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#5145E5] sm:flex-none">
              {FILTERS.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
            </select>
            <select aria-label="Sort applications" value={ordering} onChange={(e) => { setOrdering(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#5145E5]">
              <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="updated">Recently updated</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3"><h2 className="text-base font-bold">Applications <span className="ml-1 text-sm font-normal text-slate-500">({count})</span></h2><button type="button" onClick={() => setReload((n) => n + 1)} disabled={loading} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5145E5] disabled:opacity-50"><RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh</button></div>

      {loading ? <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500"><LoaderCircle size={22} className="animate-spin text-[#5145E5]" />Loading applications...</div> : items.length ? (
        <div className="space-y-3">{items.map((item) => <ApplicationCard key={item.id} item={item} onWithdraw={setWithdrawTarget} busy={withdrawing} />)}</div>
      ) : !error ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><BriefcaseBusiness size={36} className="mx-auto text-indigo-300" /><h3 className="mt-4 text-lg font-bold">No applications found</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{statusFilter || search ? "Try a different search or status filter." : "Start exploring jobs and apply to opportunities that fit your skills."}</p><Link to="/jobs" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-sm font-bold text-white">Browse jobs <ArrowRight size={16} /></Link></div>
      ) : null}

      {pages > 1 && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><p className="text-xs text-slate-500">Page {page} of {pages}</p><div className="flex gap-2"><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40"><ChevronLeft size={15} />Previous</button><button type="button" disabled={page >= pages || loading} onClick={() => setPage((p) => p + 1)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-40">Next <ChevronRight size={15} /></button></div></div>}

      {withdrawTarget && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !withdrawing) setWithdrawTarget(null); }}><div role="dialog" aria-modal="true" aria-labelledby="withdraw-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><XCircle size={24} /></div><h3 id="withdraw-title" className="mt-4 text-lg font-bold">Withdraw this application?</h3><p className="mt-2 text-sm leading-6 text-slate-600">You are about to withdraw your application for <strong>{withdrawTarget.job?.title}</strong>. You may not be able to apply again to the same role.</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={withdrawing} onClick={() => setWithdrawTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button type="button" disabled={withdrawing} onClick={confirmWithdrawal} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">{withdrawing && <LoaderCircle size={16} className="animate-spin" />}Withdraw</button></div></div></div>}
    </div>
  );
}