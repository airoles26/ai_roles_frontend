import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowRight, Atom, CalendarDays, CheckCircle2, ChevronDown,
  CircleAlert, Clock3, Cpu, LoaderCircle, Play, RefreshCw, SearchX,
  Sparkles, X, BriefcaseBusiness, TrendingUp,
} from "lucide-react";
import api from "../../api/api";

const BASE = "/worker/quantum-matches/";
const ACTIVE = new Set(["pending", "training", "queued_ibm"]);
const STATUS = {
  pending: { label: "Queued", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  training: { label: "Processing", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  queued_ibm: { label: "Queued on IBM", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  failed: { label: "Failed", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
};
const executionName = { local: "Local QAOA simulator", noisy: "Noise simulator", ibm: "IBM Quantum hardware" };
const dateString = (v) => v ? new Date(v).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
const messageOf = (e, fallback) => {
  const d = e?.response?.data;
  return typeof d?.detail === "string" ? d.detail : typeof d?.message === "string" ? d.message : fallback;
};
const getRuns = (payload) => Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : [];
const getResult = (run) => run?.result && typeof run.result === "object" ? run.result : {};
const getJobList = (run) => {
  const r = getResult(run);
  const value = r.qaoa_jobs ?? r.recommended_jobs ?? r.selected_jobs ?? [];
  return Array.isArray(value) ? value : [];
};
const jobTitle = (job) => typeof job === "string" ? job : job?.title ?? job?.name ?? job?.job_title ?? "Recommended job";
const jobId = (job) => job && typeof job === "object" ? (job.id ?? job.job_id ?? job.uuid) : null;
const jobScore = (job) => {
  if (!job || typeof job !== "object") return null;
  const raw = job.compatibility?.score ?? job.compatibility_score ?? job.score;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
};

function Metric({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#E9E9F5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="rounded-xl bg-[#F1F0FF] p-2 text-[#5145E5]"><Icon size={18} /></span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-[#18124A]">{value}</div>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

function JsonViewer({ label, data }) {
  const [open, setOpen] = useState(false);
  if (!data || (typeof data === "object" && !Object.keys(data).length)) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#18124A] hover:bg-slate-50">
        {label}<ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>
      {open && <pre className="max-h-80 overflow-auto border-t border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-emerald-200">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

function RecommendationCards({ run }) {
  const jobs = getJobList(run);
  const r = getResult(run);
  if (!jobs.length) return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No job recommendations were saved for this run.</p>;
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-bold text-[#18124A]"><BriefcaseBusiness size={17} /> Recommended jobs ({jobs.length})</h4>
      {jobs.map((job, i) => {
        const id = jobId(job);
        const score = jobScore(job);
        return (
          <div key={id ?? i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E9E9F5] bg-[#FAFAFF] p-4">
            <div className="min-w-0">
              <p className="font-bold text-[#18124A]">{jobTitle(job)}</p>
              {job && typeof job === "object" && <p className="mt-1 text-xs text-slate-500">{typeof job.company === "string" ? job.company : job.company?.name ?? job.company_name ?? "Job recommendation"}</p>}
            </div>
            <div className="flex items-center gap-3">
              {score !== null && <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{score.toFixed(1)}% match</span>}
              {id && <Link to={`/jobs/${id}`} className="text-sm font-bold text-[#5145E5] hover:underline">View job →</Link>}
            </div>
          </div>
        );
      })}
      {(r.qaoa_score != null || r.classical_score != null) && (
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-indigo-50 p-4 text-sm">
          <div><p className="text-xs text-slate-500">QAOA score</p><p className="font-bold text-[#18124A]">{r.qaoa_score ?? "—"}</p></div>
          <div><p className="text-xs text-slate-500">Classical benchmark</p><p className="font-bold text-[#18124A]">{r.classical_score ?? "—"}</p></div>
        </div>
      )}
    </div>
  );
}

export default function QuantumMatches() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [starting, setStarting] = useState(false);
  const [selectCount, setSelectCount] = useState(3);
  const [candidateLimit, setCandidateLimit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const detailRequest = useRef(0);
  const mounted = useRef(true);
  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data } = await api.get(BASE);
      if (!mounted.current) return;
      setRuns(getRuns(data));
      setError("");
    } catch (e) {
      if (mounted.current) setError(messageOf(e, "Unable to load quantum matching history."));
    } finally {
      if (mounted.current) { setLoading(false); setRefreshing(false); }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [load]);

  const activeRuns = runs.some((run) => ACTIVE.has(run.status));
  useEffect(() => {
    if (!activeRuns) return;
    const timer = setInterval(() => load({ silent: true }), 5000);
    return () => clearInterval(timer);
  }, [activeRuns, load]);

  const openDetail = useCallback(async (id, { silent = false } = {}) => {
    const requestId = ++detailRequest.current;
    if (!silent) {
      setSelected({ id });
      setDetailLoading(true);
      setDetailError("");
    }
    try {
      const { data } = await api.get(`${BASE}runs/${id}/`);
      if (mounted.current && detailRequest.current === requestId) setSelected(data);
    } catch (e) {
      if (mounted.current && detailRequest.current === requestId) setDetailError(messageOf(e, "Unable to load run details."));
    } finally {
      if (mounted.current && detailRequest.current === requestId) setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selected?.id || !ACTIVE.has(selected.status)) return;
    const timer = setInterval(() => openDetail(selected.id, { silent: true }), 5000);
    return () => clearInterval(timer);
  }, [selected?.id, selected?.status, openDetail]);

  const startMatch = async (e) => {
    e.preventDefault();
    if (starting || activeRuns) return;
    setStarting(true);
    setNotice("");
    setError("");
    try {
      const { data } = await api.post(`${BASE}start/`, {
        select_count: Number(selectCount),
        candidate_limit: Number(candidateLimit),
        execution: "local",
      });
      setNotice(data.message || "Matching task queued successfully.");
      if (data.run) setRuns((current) => [data.run, ...current.filter((r) => r.id !== data.run.id)]);
      await load({ silent: true });
      if (data.run?.id) openDetail(data.run.id);
    } catch (e2) {
      const d = e2?.response?.data;
      if (e2?.response?.status === 409 && d?.run) {
        setNotice("You already have a matching run in progress.");
        await load({ silent: true });
        openDetail(d.run.id);
      } else setError(messageOf(e2, "Could not start matching. Check that Redis and Celery are running."));
    } finally { setStarting(false); }
  };

  const stats = useMemo(() => ({
    total: runs.length,
    completed: runs.filter((r) => r.status === "completed").length,
    inProgress: runs.filter((r) => ACTIVE.has(r.status)).length,
    failed: runs.filter((r) => r.status === "failed").length,
  }), [runs]);
  const filtered = useMemo(() => statusFilter ? runs.filter((r) => r.status === statusFilter) : runs, [runs, statusFilter]);
  const PAGE_SIZE = 8;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5145E5]"><Atom size={15} /> Quantum technology</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18124A] sm:text-3xl">Quantum Matches</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Generate QAOA job recommendations, track background processing and explore completed results.</p>
        </div>
        <button type="button" onClick={() => load({ silent: true })} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4F2] bg-white px-4 py-2.5 text-sm font-semibold text-[#18124A] shadow-sm hover:border-[#5145E5] disabled:opacity-60"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh</button>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18124A] via-[#342782] to-[#5145E5] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[35px] border-white/5" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[#9DFFF0]"><Sparkles size={13} /> QAOA-powered optimisation</span>
            <h2 className="mt-4 text-xl font-bold sm:text-2xl">Find jobs matched to your profile.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Our compatibility engine scores eligible jobs, then runs a local QAOA experiment. Results are compared with a classical benchmark for transparency.</p>
            <Link to="/jobs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#9DFFF0] hover:underline">Explore all jobs <ArrowRight size={16} /></Link>
          </div>
          <form onSubmit={startMatch} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
            <h3 className="mb-4 font-bold">Generate new matches</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-indigo-100">Candidate jobs
                <select value={candidateLimit} onChange={(e) => { const n = Number(e.target.value); setCandidateLimit(n); setSelectCount((c) => Math.min(c, n)); }} className="mt-2 w-full rounded-xl border border-white/20 bg-white px-3 py-2.5 text-sm text-[#18124A] outline-none">
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} jobs</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-indigo-100">Select matches
                <select value={selectCount} onChange={(e) => setSelectCount(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-white/20 bg-white px-3 py-2.5 text-sm text-[#18124A] outline-none">
                  {Array.from({ length: candidateLimit }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} jobs</option>)}
                </select>
              </label>
            </div>
            <p className="mt-3 text-xs text-indigo-100">Execution: Local simulator · Processed by Celery</p>
            <button type="submit" disabled={starting || activeRuns} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14E0C8] px-4 py-3 text-sm font-extrabold text-[#18124A] transition hover:bg-[#7CF8E9] disabled:cursor-not-allowed disabled:opacity-60">
              {starting ? <LoaderCircle size={17} className="animate-spin" /> : activeRuns ? <Clock3 size={17} /> : <Play size={17} />}
              {starting ? "Starting…" : activeRuns ? "Matching in progress" : "Generate matches"}
            </button>
          </form>
        </div>
      </div>

      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><CircleAlert size={18} className="shrink-0" />{error}</div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={Activity} label="Total runs" value={stats.total} hint="Recent matching history" />
        <Metric icon={CheckCircle2} label="Completed" value={stats.completed} hint="Results available" />
        <Metric icon={Clock3} label="In progress" value={stats.inProgress} hint="Automatically refreshed" />
        <Metric icon={CircleAlert} label="Failed" value={stats.failed} hint="Runs needing attention" />
      </div>

      <section className="overflow-hidden rounded-3xl border border-[#E9E9F5] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div><h2 className="text-lg font-bold text-[#18124A]">Matching history</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} run{filtered.length === 1 ? "" : "s"} shown · Refreshes while processing</p></div>
          <label className="flex items-center gap-2 text-sm text-slate-500">Status
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#18124A] outline-none focus:border-[#5145E5]">
              <option value="">All statuses</option>
              {Object.entries(STATUS).map(([value, config]) => <option key={value} value={value}>{config.label}</option>)}
            </select>
          </label>
        </div>
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="animate-spin text-[#5145E5]" size={22} /> Loading matching runs...</div>
        ) : !visible.length ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center"><div className="rounded-2xl bg-[#F1F0FF] p-4 text-[#5145E5]"><SearchX size={30} /></div><h3 className="mt-4 font-bold text-[#18124A]">{statusFilter ? "No runs match this status" : "No quantum runs yet"}</h3><p className="mt-2 max-w-sm text-sm text-slate-500">{statusFilter ? "Choose another status to see more runs." : "Generate your first job shortlist using the form above."}</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visible.map((run) => (
              <div key={run.id} className="flex flex-col gap-4 p-4 transition hover:bg-[#FAFAFF] sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-start gap-3"><div className="shrink-0 rounded-xl bg-[#F1F0FF] p-3 text-[#5145E5]"><Atom size={20} /></div>
                  <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#18124A]">Job shortlist</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${STATUS[run.status]?.cls || "bg-slate-100 text-slate-600 ring-slate-200"}`}>{STATUS[run.status]?.label || run.status}</span></div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Cpu size={13} />{executionName[run.execution] || run.execution}</span><span className="inline-flex items-center gap-1"><CalendarDays size={13} />{dateString(run.created_at)}</span>{run.status === "completed" && <span>{getJobList(run).length} recommendations</span>}</div>
                    <p className="mt-2 font-mono text-[11px] text-slate-400">Run #{run.id}</p>
                  </div>
                </div>
                <button type="button" onClick={() => openDetail(run.id)} className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#DDDDF1] px-4 py-2 text-sm font-bold text-[#5145E5] hover:bg-[#F1F0FF] sm:self-center">View details <ArrowRight size={15} /></button>
              </div>
            ))}
          </div>
        )}
        {!loading && pages > 1 && <div className="flex items-center justify-between border-t border-slate-100 p-4 sm:p-5"><span className="text-xs text-slate-500">Page {page} of {pages}</span><div className="flex gap-2"><button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40">Previous</button><button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40">Next</button></div></div>}
      </section>

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0C2A]/70 p-3 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) { detailRequest.current += 1; setSelected(null); } }}>
        <div role="dialog" aria-modal="true" aria-label="Quantum run details" className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5"><div><h3 className="text-lg font-extrabold text-[#18124A]">Quantum run details</h3><p className="mt-1 font-mono text-xs text-slate-400">#{selected.id}</p></div><button type="button" onClick={() => { detailRequest.current += 1; setSelected(null); }} aria-label="Close details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>
          <div className="space-y-5 overflow-y-auto p-5">
            {detailLoading ? <div className="flex items-center gap-2 py-12 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={20} /> Loading details...</div> : <>
              {detailError && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{detailError}</div>}
              <div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-500">Status</p><p className="mt-1 font-semibold text-[#18124A]">{STATUS[selected.status]?.label || selected.status || "—"}</p></div><div><p className="text-xs text-slate-500">Execution</p><p className="mt-1 font-semibold text-[#18124A]">{executionName[selected.execution] || selected.execution || "—"}</p></div><div><p className="text-xs text-slate-500">Created</p><p className="mt-1 font-semibold text-[#18124A]">{dateString(selected.created_at)}</p></div><div><p className="text-xs text-slate-500">Updated</p><p className="mt-1 font-semibold text-[#18124A]">{dateString(selected.updated_at)}</p></div></div>
              {ACTIVE.has(selected.status) && <div className="flex items-center gap-2 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700"><LoaderCircle size={18} className="animate-spin" /> Processing your matches. This view updates automatically.</div>}
              {selected.error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{selected.error}</div>}
              {selected.status === "completed" && <RecommendationCards run={selected} />}
              <JsonViewer label="Raw result data" data={selected.result} />
              <JsonViewer label="Request parameters" data={selected.request_params} />
            </>}
          </div>
        </div>
      </div>}
    </div>
  );
}