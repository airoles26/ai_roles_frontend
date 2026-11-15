
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Zap,
  CheckCircle2,
  Clock3,
  XCircle,
  Settings2,
  Search,
  MapPin,
  BriefcaseBusiness,
  LoaderCircle,
  AlertCircle,
  Crown,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import { autoApplyApi } from "../../api/api";

const PURPLE = "#5145E5";

const statusStyles = {
  submitted: "bg-emerald-50 text-emerald-700",
  awaiting_approval: "bg-amber-50 text-amber-700",
  queued: "bg-indigo-50 text-indigo-700",
  processing: "bg-blue-50 text-blue-700",
  failed: "bg-red-50 text-red-700",
  needs_action: "bg-orange-50 text-orange-700",
  draft: "bg-slate-100 text-slate-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || statusStyles.draft
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#5145E5]">
        <Icon size={20} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#18124A]">
        {value}
      </h3>
    </div>
  );
}

export default function AutoApply() {
  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);

  const [tab, setTab] = useState("jobs");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");

      const [dashboardRes, jobsRes, historyRes] =
        await Promise.all([
          autoApplyApi.dashboard(),
          autoApplyApi.jobs(),
          autoApplyApi.history(),
        ]);

      setDashboard(dashboardRes.data);
      setJobs(jobsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load Auto Apply data."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
  const hasPending = history.some((task) =>
    ["queued", "processing"].includes(task.status)
  );

  if (!hasPending) return;

  const interval = setInterval(() => {
    loadData();
  }, 5000);

  return () => clearInterval(interval);
}, [history, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = async () => {
    await loadData();
  };

  const updateSettings = async (changes) => {
    if (!dashboard) return;

    setSaving(true);
    setError("");

    try {
      const { data } =
        await autoApplyApi.updateSettings(changes);

      setDashboard((prev) => ({
        ...prev,
        settings: data,
      }));

      setNotice("Preferences saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  const createApplication = async (jobId) => {
    setBusyId(jobId);
    setError("");
    setNotice("");

    try {
      const { data } = await autoApplyApi.create(jobId);

      setNotice(data.message);
      await refresh();

      setTab("history");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create application."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleTaskAction = async (taskId, action) => {
    setBusyId(taskId);
    setError("");
    setNotice("");

    try {
      const response =
        action === "approve"
          ? await autoApplyApi.approve(taskId)
          : await autoApplyApi.cancel(taskId);

      setNotice(response.data.message);
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update application."
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle
          className="animate-spin text-[#5145E5]"
          size={34}
        />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto mb-3 text-red-500" />
        <p className="text-slate-600">
          {error || "Unable to load Auto Apply."}
        </p>
        <button
          onClick={refresh}
          className="mt-4 rounded-xl bg-[#5145E5] px-5 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const { subscription, settings, stats } = dashboard;
  const hasAccess = subscription.active;

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const canApply =
    hasAccess &&
    settings.enabled &&
    subscription.remaining_credits > 0 &&
    stats.today_remaining > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FF] px-4 py-7 text-[#18124A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-3 text-[#5145E5]">
                <Bot size={24} />
              </div>

              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Auto Apply
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Manage your automated job applications.
            </p>
          </div>

          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {notice && (
          <div role="status" className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} className="shrink-0" />
            {notice}
          </div>
        )}

        {/* Subscription */}
        <div className="rounded-2xl bg-gradient-to-r from-[#18124A] to-[#5145E5] p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Crown size={19} className="text-amber-300" />
                <span className="text-sm font-semibold text-indigo-100">
                  YOUR SUBSCRIPTION
                </span>
              </div>

              <h2 className="text-2xl font-extrabold">
                {hasAccess
                  ? subscription.plan === "trial"
                    ? "7-Day Access"
                    : "Monthly Pro"
                  : "No Active Subscription"}
              </h2>

              <p className="mt-2 text-sm text-indigo-100">
                {hasAccess
                  ? `Valid until ${new Date(
                      subscription.expires_at
                    ).toLocaleDateString()}`
                  : "Subscribe to unlock Auto Apply."}
              </p>
            </div>

            {hasAccess ? (
              <div className="rounded-2xl bg-white/15 px-6 py-4">
                <p className="text-xs text-indigo-100">
                  Remaining credits
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Zap size={24} className="text-amber-300" />
                  <span className="text-3xl font-extrabold">
                    {subscription.remaining_credits}
                  </span>
                </div>
              </div>
            ) : (
              <Link
                to="/pricing"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#5145E5] hover:bg-indigo-50"
              >
                View Plans
              </Link>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Zap}
            label="Credits remaining"
            value={subscription.remaining_credits}
          />
          <StatCard
            icon={CheckCircle2}
            label="Submitted"
            value={stats.submitted}
          />
          <StatCard
            icon={Clock3}
            label="Pending"
            value={stats.pending}
          />
          <StatCard
            icon={Bot}
            label="Daily slots left"
            value={stats.today_remaining}
          />
        </div>

        {/* Settings */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Settings2 size={20} className="text-[#5145E5]" />
            <h2 className="text-lg font-bold">
              Automation Preferences
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                key: "enabled",
                title: "Enable Auto Apply",
                description: "Allow new automated application requests.",
              },
              {
                key: "require_approval",
                title: "Require Approval",
                description: "Review applications before submission.",
              },
              {
                key: "remote_only",
                title: "Remote Jobs Only",
                description: "Show only remote jobs for Auto Apply.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
              >
                <div>
                  <p className="text-sm font-bold">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  disabled={saving}
                  onChange={(e) =>
                    updateSettings({
                      [item.key]: e.target.checked,
                    })
                  }
                  className="h-5 w-5 accent-[#5145E5]"
                />
              </label>
            ))}

            <div className="rounded-xl border border-slate-100 p-4">
              <label className="mb-2 block text-sm font-bold">
                Daily Application Limit
              </label>
              <select
                value={settings.daily_limit}
                disabled={saving}
                onChange={(e) =>
                  updateSettings({
                    daily_limit: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[#5145E5]"
              >
                {[1, 2, 3, 5, 10, 15, 20, 50, 100].map(
                  (n) => (
                    <option key={n} value={n}>
                      {n} applications per day
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="rounded-xl border border-slate-100 p-4 md:col-span-2">
              <div className="mb-3 flex justify-between">
                <label className="text-sm font-bold">
                  Minimum Match Score
                </label>
                <span className="font-bold text-[#5145E5]">
                  {settings.minimum_match_score}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.minimum_match_score}
                disabled={saving}
                onChange={(e) =>
                  setDashboard((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      minimum_match_score: Number(e.target.value),
                    },
                  }))
                }
                onPointerUp={() =>
                  updateSettings({
                    minimum_match_score:
                      settings.minimum_match_score,
                  })
                }
                onKeyUp={() =>
                  updateSettings({
                    minimum_match_score:
                      settings.minimum_match_score,
                  })
                }
                className="w-full accent-[#5145E5]"
              />

              <p className="mt-2 text-xs text-slate-500">
                Match-score filtering becomes active when
                connected to the matching engine.
              </p>
            </div>
          </div>
        </section>

        {/* Jobs and history */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
            {[
              ["jobs", "Available Jobs"],
              ["history", "Application History"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  tab === value
                    ? "bg-[#5145E5] text-white"
                    : "text-slate-500 hover:bg-indigo-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "jobs" ? (
            <div className="p-5">
              <div className="relative mb-5">
                <Search
                  size={18}
                  className="absolute left-4 top-3.5 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs or companies..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#5145E5]"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="rounded-xl bg-indigo-50 p-3 text-[#5145E5]">
                        <BriefcaseBusiness size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location || "Not specified"}
                      </span>

                      {job.remote && (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                          Remote
                        </span>
                      )}

                      {job.employment_type && (
                        <span className="rounded-full bg-slate-100 px-2 py-1">
                          {job.employment_type.replaceAll("_", " ")}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          createApplication(job.id)
                        }
                        disabled={
                          !canApply || busyId === job.id
                        }
                        className="flex items-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#4034C8] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busyId === job.id ? (
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Bot size={16} />
                        )}
                        Auto Apply
                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                      >
                        <ExternalLink size={15} />
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <p className="py-12 text-center text-sm text-slate-500">
                  No available jobs found.
                </p>
              )}

              {!canApply && (
                <p className="mt-5 text-sm text-amber-700">
                  {!hasAccess
                    ? "An active subscription is required."
                    : !settings.enabled
                    ? "Enable Auto Apply to request applications."
                    : subscription.remaining_credits === 0
                    ? "Your Auto Apply credits are exhausted."
                    : "Your daily application limit has been reached."}
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div>
                    <h3 className="font-bold">
                      {task.job_title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.company}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(
                        task.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={task.status} />

                    {task.status ===
                      "awaiting_approval" && (
                      <button
                        onClick={() =>
                          handleTaskAction(
                            task.id,
                            "approve"
                          )
                        }
                        disabled={busyId === task.id}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}

                    {[
                      "draft",
                      "awaiting_approval",
                      "queued",
                    ].includes(task.status) && (
                      <button
                        onClick={() =>
                          handleTaskAction(
                            task.id,
                            "cancel"
                          )
                        }
                        disabled={busyId === task.id}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {task.error_message && (
                    <p className="w-full text-xs text-red-600">
                      {task.error_message}
                    </p>
                  )}
                </div>
              ))}

              {history.length === 0 && (
                <p className="py-14 text-center text-sm text-slate-500">
                  No Auto Apply requests yet.
                </p>
              )}
            </div>
          )}
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <ShieldCheck
            size={20}
            className="shrink-0 text-[#5145E5]"
          />
          <p className="text-xs leading-6 text-slate-600">
            Auto Apply requests are queued for processing.
            Applications are not considered submitted until
            the destination confirms receipt.
          </p>
        </div>
      </div>
    </div>
  );
}
