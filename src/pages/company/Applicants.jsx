import { useCallback, useEffect, useState } from "react";
import api from "../../api/api";

const STATUS_OPTIONS = ["submitted", "reviewing", "shortlisted", "interview", "hired", "rejected", "withdrawn"];
const LABELS = { submitted: "Submitted", reviewing: "Reviewing", shortlisted: "Shortlisted", interview: "Interview", hired: "Hired", rejected: "Rejected", withdrawn: "Withdrawn" };
const STATUS_STYLES = {
  submitted: "bg-slate-100 text-slate-700", reviewing: "bg-blue-100 text-blue-700",
  shortlisted: "bg-violet-100 text-violet-700", interview: "bg-amber-100 text-amber-800",
  hired: "bg-emerald-100 text-emerald-700", rejected: "bg-rose-100 text-rose-700",
  withdrawn: "bg-gray-100 text-gray-600",
};
const EDITABLE_STATUSES = ["reviewing", "shortlisted", "interview", "hired", "rejected"];
const fmtDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
const errorMessage = (error) => error?.response?.data?.message || error?.response?.data?.detail || error?.response?.data?.error || "Something went wrong. Please try again.";

export default function Applicants() {
  const [items, setItems] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, jobId, status]);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/employer/applications/", {
        params: {
          page,
          page_size: 20,
          search: debouncedSearch || undefined,
          job: jobId || undefined,
          status: status || undefined,
        },
        signal,
      });
      if (signal?.aborted) return;
      setItems(data.results || []);
      setTotal(data.count ?? 0);
      setTotalPages(data.total_pages ?? 1);
      setSummary(data.summary || {});
    } catch (err) {
      if (!signal?.aborted && err.code !== "ERR_CANCELED") setError(errorMessage(err));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, debouncedSearch, jobId, status, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    const controller = new AbortController();
    api.get("/employer/application-jobs/", { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setJobs(data.results || []); })
      .catch((err) => { if (err.code !== "ERR_CANCELED") console.error("Could not load employer jobs", err); });
    return () => controller.abort();
  }, []);

  const openDetails = async (application) => {
    setSelected(application);
    setDetailError("");
    setNotice("");
    setDetailsLoading(true);
    try {
      const { data } = await api.get(`/employer/applications/${application.id}/`);
      setSelected((current) => current?.id === application.id ? data.application : current);
    } catch (err) {
      setDetailError(errorMessage(err));
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateStatus = async (id, nextStatus) => {
    if (!EDITABLE_STATUSES.includes(nextStatus)) return;
    setSaving(true);
    setDetailError("");
    setNotice("");
    try {
      const { data } = await api.patch(`/employer/applications/${id}/status/`, { status: nextStatus });
      const updated = data.application;
      setSelected((current) => current?.id === id ? updated : current);
      setItems((current) => current.map((item) => item.id === id ? { ...item, status: updated.status, status_display: updated.status_display, updated_at: updated.updated_at } : item));
      setNotice("Application status updated successfully.");
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setDetailError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Employer dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Applicants</h1>
            <p className="mt-2 text-sm text-slate-500">Review candidates and manage your hiring pipeline.</p>
          </div>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100">Refresh</button>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Application overview">
          {[
            ["Total applications", summary.total ?? 0],
            ["Under review", summary.reviewing ?? 0],
            ["Shortlisted", summary.shortlisted ?? 0],
            ["Interviews", summary.interview ?? 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <input aria-label="Search applicants" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or job..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
            <select aria-label="Filter by job" value={jobId} onChange={(e) => setJobId(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
              <option value="">All jobs</option>
              {jobs.map((job) => <option key={job.id} value={job.id}>{job.title} ({job.applicants_count})</option>)}
            </select>
            <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((value) => <option key={value} value={value}>{LABELS[value]}</option>)}
            </select>
          </div>
        </section>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4">Candidate</th><th className="px-5 py-4">Applied for</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">Loading applications...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No applications match your filters.</td></tr>
                ) : items.map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4"><div className="font-semibold">{application.applicant?.full_name || "Unnamed candidate"}</div><div className="text-xs text-slate-500">{application.applicant?.email}</div></td>
                    <td className="px-5 py-4">{application.job?.title}</td>
                    <td className="px-5 py-4 text-slate-600">{fmtDate(application.applied_at)}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[application.status] || STATUS_STYLES.submitted}`}>{LABELS[application.status] || application.status}</span></td>
                    <td className="px-5 py-4"><button type="button" onClick={() => openDetails(application)} className="font-semibold text-indigo-600 hover:underline">View details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm">
            <span className="text-slate-500">Page {page} of {totalPages} · {total} matching applications</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button>
              <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <aside role="dialog" aria-modal="true" aria-label="Applicant details" className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Application details</p>
                <h2 className="mt-2 text-2xl font-bold">{selected.applicant?.full_name || "Candidate"}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.job?.title}</p>
              </div>
              <button type="button" aria-label="Close details" onClick={() => setSelected(null)} className="rounded-lg border px-3 py-1 text-xl">×</button>
            </div>

            {detailsLoading && <p className="mt-6 text-sm text-slate-500">Loading candidate details...</p>}
            {detailError && <div role="alert" className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{detailError}</div>}
            <div className="mt-8 space-y-6 text-sm">
              <div>
                <h3 className="mb-2 font-semibold">Contact</h3>
                {selected.applicant?.email && <a href={`mailto:${selected.applicant.email}`} className="block text-indigo-600 hover:underline">{selected.applicant.email}</a>}
                {selected.applicant?.phone_number && <p className="mt-2">{selected.applicant.phone_number}</p>}
                {selected.applicant?.location && <p className="mt-2 text-slate-600">{selected.applicant.location}</p>}
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Professional background</h3>
                <p>{selected.applicant?.professional_title || "Not provided"}</p>
                <p className="mt-1 text-slate-600">{selected.applicant?.years_of_experience ?? 0} years of experience</p>
                {selected.applicant?.education && <p className="mt-1 text-slate-600">Education: {selected.applicant.education}</p>}
                {Array.isArray(selected.applicant?.skills) && selected.applicant.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">{selected.applicant.skills.map((skill, index) => <span key={`${String(skill)}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs">{typeof skill === "string" ? skill : skill?.name || "Skill"}</span>)}</div>
                )}
              </div>
              {selected.applicant?.resume_url && <a href={selected.applicant.resume_url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">View resume</a>}
              {selected.cover_letter && <div><h3 className="mb-2 font-semibold">Cover letter</h3><p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 leading-6 text-slate-700">{selected.cover_letter}</p></div>}
              {selected.applicant?.linkedin_url && <a className="block text-indigo-600 hover:underline" href={selected.applicant.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn profile</a>}
              {selected.applicant?.portfolio_url && <a className="block text-indigo-600 hover:underline" href={selected.applicant.portfolio_url} target="_blank" rel="noopener noreferrer">Portfolio</a>}
              <div>
                <label htmlFor="application-status" className="mb-2 block font-semibold">Application status</label>
                <select id="application-status" disabled={saving || detailsLoading || selected.status === "withdrawn"} value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 disabled:opacity-60">
                  {selected.status === "submitted" && <option value="submitted">Submitted</option>}
                  {EDITABLE_STATUSES.map((value) => <option key={value} value={value}>{LABELS[value]}</option>)}
                  {selected.status === "withdrawn" && <option value="withdrawn">Withdrawn</option>}
                </select>
                {selected.status === "withdrawn" && <p className="mt-2 text-xs text-slate-500">Withdrawn applications cannot be updated.</p>}
              </div>
              <p className="text-xs text-slate-500">Applied {fmtDate(selected.applied_at)}</p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}