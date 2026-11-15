import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api/api";

const STATUS = [
  ["submitted", "Submitted", "bg-slate-500"],
  ["reviewing", "Reviewing", "bg-blue-500"],
  ["shortlisted", "Shortlisted", "bg-violet-500"],
  ["interview", "Interview", "bg-amber-500"],
  ["hired", "Hired", "bg-emerald-500"],
  ["rejected", "Rejected", "bg-rose-500"],
  ["withdrawn", "Withdrawn", "bg-slate-300"],
];
const number = (n) => Number(n || 0).toLocaleString();
const errorText = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.detail ||
  "Unable to load employer analytics.";

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function TrendChart({ rows }) {
  const max = Math.max(1, ...rows.map((row) => row.applications));
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Application trends</h2>
        <p className="text-sm text-slate-500">Applications received over the last six calendar months</p>
      </div>
      <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-200 pb-2 sm:gap-4">
        {rows.map((row) => (
          <div key={row.month} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-semibold text-slate-700">{number(row.applications)}</span>
            <div className="flex h-[80%] w-full max-w-16 items-end rounded-lg bg-indigo-50">
              <div
                className="w-full rounded-t-lg bg-indigo-600 transition-all"
                style={{ height: `${row.applications ? Math.max(5, (row.applications / max) * 100) : 0}%` }}
                title={`${row.month}: ${row.applications} applications`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between gap-2">
        {rows.map((row) => (
          <span key={row.month} className="min-w-0 flex-1 text-center text-[10px] text-slate-500 sm:text-xs">
            {row.month}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/employer/analytics/", { signal });
      if (!signal?.aborted) setData(response.data);
    } catch (err) {
      if (!signal?.aborted && err.code !== "ERR_CANCELED") setError(errorText(err));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const jobs = useMemo(() => {
    const all = data?.job_performance || [];
    const q = search.trim().toLowerCase();
    return q ? all.filter((job) => job.title.toLowerCase().includes(q)) : all;
  }, [data, search]);

  const summary = data?.summary || {};
  const pipeline = data?.pipeline || {};
  const pipelineTotal = Object.values(pipeline).reduce((sum, n) => sum + Number(n || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Employer dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="mt-2 text-sm text-slate-500">Understand your hiring activity and job performance.</p>
          </div>
          <button type="button" onClick={() => load()} disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50">
            {loading ? "Loading..." : "Refresh data"}
          </button>
        </header>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
        {loading && !data ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-500">Loading analytics...</div>
        ) : !data ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-500">No analytics available.</div>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6" aria-label="Hiring overview">
              <StatCard title="Total jobs" value={number(summary.total_jobs)} description="Employer-posted listings" />
              <StatCard title="Active jobs" value={number(summary.active_jobs)} description="Currently active" />
              <StatCard title="Job views" value={number(summary.total_views)} description="Recorded job page views" />
              <StatCard title="Applications" value={number(summary.total_applications)} description="All-time submissions" />
              <StatCard title="Hired" value={number(summary.total_hired)} description="Current hired status" />
              <StatCard title="Application rate" value={`${summary.application_rate || 0}%`} description="Applications ÷ views" />
            </section>

            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <TrendChart rows={data.monthly_trend || []} />
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold">Hiring pipeline</h2>
                <p className="mb-6 text-sm text-slate-500">Current application statuses</p>
                <div className="space-y-4">
                  {STATUS.map(([key, label, color]) => {
                    const count = pipeline[key] || 0;
                    return (
                      <div key={key}>
                        <div className="mb-1 flex justify-between text-sm"><span>{label}</span><strong>{number(count)}</strong></div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${pipelineTotal ? (count / pipelineTotal) * 100 : 0}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">Job performance</h2>
                  <p className="text-sm text-slate-500">Views, applications, and hires by job posting</p>
                </div>
                <input aria-label="Search job titles" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search job titles..." className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-5 py-4">Job</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Views</th><th className="px-5 py-4 text-right">Applications</th><th className="px-5 py-4 text-right">Hired</th><th className="px-5 py-4 text-right">Rate</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No jobs found.</td></tr>
                    ) : jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-semibold">{job.title}</td>
                        <td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${job.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{job.is_active ? "Active" : "Inactive"}</span></td>
                        <td className="px-5 py-4 text-right">{number(job.views)}</td>
                        <td className="px-5 py-4 text-right">{number(job.applications)}</td>
                        <td className="px-5 py-4 text-right">{number(job.hired)}</td>
                        <td className="px-5 py-4 text-right">{job.conversion_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <p className="text-xs text-slate-500">Application rate is applications divided by recorded job views. It is not a unique-visitor conversion rate. Historical views are not available from the current model.</p>
          </>
        )}
      </div>
    </main>
  );
}