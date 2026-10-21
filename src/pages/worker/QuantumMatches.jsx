import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowLeft, ArrowRight, Atom, CalendarDays, CheckCircle2,
  ChevronDown, CircleAlert, Clock3, Cpu, ExternalLink, Filter,
  LoaderCircle, RefreshCw, SearchX, Server, Sparkles, X,
} from "lucide-react";
import api from "../../api/api";

const STATUS = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  training: { label: "Training", cls: "bg-indigo-50 text-indigo-700 ring-indigo-200" },
  queued_ibm: { label: "Queued on IBM", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  failed: { label: "Failed", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
};
const problemName = { assignment: "Candidate-to-job assignment", shortlist: "Diverse shortlist" };
const executionName = { local: "Local simulator", noisy: "Noise simulator", ibm: "IBM Quantum hardware" };
const dateString = (value) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
const cx = (...items) => items.filter(Boolean).join(" ");

function Metric({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[#E9E9F5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3"><span className="text-sm text-slate-500">{label}</span><span className="rounded-xl bg-[#F1F0FF] p-2 text-[#5145E5]"><Icon size={18} /></span></div>
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
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#18124A] hover:bg-slate-50">
        {label}<ChevronDown size={16} className={cx("transition-transform", open && "rotate-180")} />
      </button>
      {open && <pre className="max-h-80 overflow-auto border-t border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-emerald-200">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default function QuantumMatches() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, training: 0, queued_ibm: 0, failed: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [problemFilter, setProblemFilter] = useState("");
  const [executionFilter, setExecutionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async (signal) => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/worker/quantum-matches/", {
        params: { page, page_size: 8, ...(statusFilter && { status: statusFilter }), ...(problemFilter && { problem_type: problemFilter }), ...(executionFilter && { execution: executionFilter }) },
        signal,
      });
      if (signal.aborted) return;
      setItems(data.results || []);
      setStats(data.stats || {});
      setPages(data.total_pages || 1);
      setCount(data.count || 0);
    } catch (err) {
      if (signal.aborted || err.code === "ERR_CANCELED") return;
      setError(err.response?.data?.detail || "Could not load quantum matching history. Please try again.");
    } finally { if (!signal.aborted) setLoading(false); }
  }, [page, statusFilter, problemFilter, executionFilter]);

  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, [load, refreshKey]);

  const showDetail = async (id) => {
    setSelected({ id }); setDetailError(""); setDetailLoading(true);
    try {
      const { data } = await api.get(`/worker/quantum-matches/${id}/`);
      setSelected(data);
    } catch (err) {
      setDetailError(err.response?.data?.detail || "Unable to load run details.");
    } finally { setDetailLoading(false); }
  };

  const resetFilters = () => { setStatusFilter(""); setProblemFilter(""); setExecutionFilter(""); setPage(1); };
  const activeFilters = Boolean(statusFilter || problemFilter || executionFilter);

  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5145E5]"><Atom size={15} /> Quantum technology</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#18124A] sm:text-3xl">Quantum Matches</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Explore your quantum optimisation run history, execution status and available results.</p>
        </div>
        <button type="button" onClick={() => setRefreshKey(v => v + 1)} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4F2] bg-white px-4 py-2.5 text-sm font-semibold text-[#18124A] shadow-sm transition hover:border-[#5145E5] disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18124A] via-[#342782] to-[#5145E5] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[35px] border-white/5" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-[#9DFFF0]"><Sparkles size={13} /> Quantum-powered optimisation</span>
          <h2 className="mt-4 text-xl font-bold sm:text-2xl">Your matching experiments, in one place.</h2>
          <p className="mt-3 text-sm leading-6 text-indigo-100">Track QAOA runs across local simulators, noisy simulations and IBM Quantum hardware. Results appear only when a run has actually completed.</p>
          <Link to="/jobs" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-4 py-2.5 text-sm font-bold text-[#18124A] transition hover:bg-[#7CF8E9]">Explore jobs <ArrowRight size={16} /></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={Activity} label="Total runs" value={stats.total ?? 0} hint="All optimisation requests" />
        <Metric icon={CheckCircle2} label="Completed" value={stats.completed ?? 0} hint="Results available" />
        <Metric icon={Clock3} label="In progress" value={(stats.pending || 0) + (stats.training || 0) + (stats.queued_ibm || 0)} hint="Pending, training or queued" />
        <Metric icon={CircleAlert} label="Failed" value={stats.failed ?? 0} hint="Runs requiring attention" />
      </div>

      <section className="overflow-hidden rounded-3xl border border-[#E9E9F5] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div><h2 className="text-lg font-bold text-[#18124A]">Matching history</h2><p className="mt-1 text-sm text-slate-500">{count} run{count === 1 ? "" : "s"} matching your filters</p></div>
          {activeFilters && <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5145E5] hover:underline"><X size={14} /> Clear filters</button>}
        </div>
        <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-3 sm:p-5">
          <label className="relative"><span className="mb-1.5 block text-xs font-semibold text-slate-500">Status</span><select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-[#18124A] outline-none focus:border-[#5145E5]"><option value="">All statuses</option>{Object.entries(STATUS).map(([value, config]) => <option key={value} value={value}>{config.label}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute bottom-3 right-3 text-slate-400" /></label>
          <label className="relative"><span className="mb-1.5 block text-xs font-semibold text-slate-500">Problem type</span><select value={problemFilter} onChange={e => { setProblemFilter(e.target.value); setPage(1); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-[#18124A] outline-none focus:border-[#5145E5]"><option value="">All problem types</option>{Object.entries(problemName).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute bottom-3 right-3 text-slate-400" /></label>
          <label className="relative"><span className="mb-1.5 block text-xs font-semibold text-slate-500">Execution</span><select value={executionFilter} onChange={e => { setExecutionFilter(e.target.value); setPage(1); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-[#18124A] outline-none focus:border-[#5145E5]"><option value="">All environments</option>{Object.entries(executionName).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute bottom-3 right-3 text-slate-400" /></label>
        </div>
        {loading ? <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="animate-spin text-[#5145E5]" size={22} /> Loading matching runs...</div> : error ? <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center"><CircleAlert className="text-rose-500" size={30} /><p className="max-w-md text-sm text-slate-600">{error}</p><button onClick={() => setRefreshKey(v => v + 1)} className="text-sm font-bold text-[#5145E5]">Try again</button></div> : !items.length ? <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center"><div className="rounded-2xl bg-[#F1F0FF] p-4 text-[#5145E5]"><SearchX size={30} /></div><h3 className="mt-4 font-bold text-[#18124A]">{activeFilters ? "No matching runs" : "No quantum runs yet"}</h3><p className="mt-2 max-w-sm text-sm text-slate-500">{activeFilters ? "Try adjusting the filters to see more runs." : "Your quantum optimisation history will appear here after matching runs are created by the matching service."}</p>{activeFilters && <button onClick={resetFilters} className="mt-4 text-sm font-semibold text-[#5145E5]">Reset filters</button>}</div> : <div className="divide-y divide-slate-100">{items.map(run => <div key={run.id} className="flex flex-col gap-4 p-4 transition hover:bg-[#FAFAFF] sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex min-w-0 items-start gap-3"><div className="shrink-0 rounded-xl bg-[#F1F0FF] p-3 text-[#5145E5]"><Atom size={20} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#18124A]">{problemName[run.problem_type] || run.problem_type}</h3><span className={cx("rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset", (STATUS[run.status] || {}).cls || "bg-slate-100 text-slate-600 ring-slate-200")}>{STATUS[run.status]?.label || run.status}</span></div><div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Cpu size={13} />{executionName[run.execution] || run.execution}</span><span className="inline-flex items-center gap-1"><CalendarDays size={13} />{dateString(run.created_at)}</span>{run.num_qubits != null && <span>{run.num_qubits} qubits</span>}</div><p className="mt-2 truncate font-mono text-[11px] text-slate-400">Run #{run.id}</p></div></div><button onClick={() => showDetail(run.id)} className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-[#DDDDF1] px-4 py-2 text-sm font-bold text-[#5145E5] hover:bg-[#F1F0FF] sm:self-center">View details <ArrowRight size={15} /></button></div>)}</div>}
        {!loading && !error && pages > 1 && <div className="flex items-center justify-between border-t border-slate-100 p-4 sm:p-5"><span className="text-xs text-slate-500">Page {page} of {pages}</span><div className="flex gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40">Previous</button><button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40">Next</button></div></div>}
      </section>

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0C2A]/70 p-3 sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}><div role="dialog" aria-modal="true" aria-label="Quantum run details" className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5"><div><h3 className="text-lg font-extrabold text-[#18124A]">Quantum run details</h3><p className="mt-1 font-mono text-xs text-slate-400">#{selected.id}</p></div><button onClick={() => setSelected(null)} aria-label="Close details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div><div className="space-y-4 overflow-y-auto p-5">{detailLoading ? <div className="flex items-center gap-2 py-12 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={20} /> Loading details...</div> : detailError ? <p className="text-sm text-rose-600">{detailError}</p> : <><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-500">Status</p><p className="mt-1 font-semibold text-[#18124A]">{STATUS[selected.status]?.label || selected.status}</p></div><div><p className="text-xs text-slate-500">Execution</p><p className="mt-1 font-semibold text-[#18124A]">{executionName[selected.execution] || selected.execution}</p></div><div><p className="text-xs text-slate-500">Created</p><p className="mt-1 font-semibold text-[#18124A]">{dateString(selected.created_at)}</p></div><div><p className="text-xs text-slate-500">Completed</p><p className="mt-1 font-semibold text-[#18124A]">{dateString(selected.completed_at)}</p></div></div>{selected.ibm_backend && <p className="flex items-center gap-2 text-xs text-slate-500"><Server size={14} /> Backend: {selected.ibm_backend}</p>}{selected.error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{selected.error}</div>}{selected.status === "completed" && !selected.has_result && <p className="text-sm text-slate-500">This run has no stored result payload.</p>}<JsonViewer label="Result data" data={selected.result} /><JsonViewer label="Classical / quantum problem data" data={selected.problem} /><JsonViewer label="Request parameters" data={selected.request_params} /><JsonViewer label="QAOA parameters" data={selected.qaoa_params} /></>}</div></div></div>}
    </div>
  );
}