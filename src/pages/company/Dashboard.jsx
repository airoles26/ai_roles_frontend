import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, BarChart3, BriefcaseBusiness, Building2,
  CalendarDays, CheckCircle2, ChevronRight, CircleAlert, Clock3,
  CreditCard, Eye, FileText, LoaderCircle, MapPin, Plus, RefreshCw,
  Sparkles, Users, Zap,
} from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
const number = (v) => new Intl.NumberFormat().format(Number(v) || 0);
const date = (v) => {
  if (!v) return "Date unavailable";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(d);
};
const relativeDate = (v) => {
  if (!v) return "Recently";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "Recently";
  const mins = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  if (mins < 10080) return `${Math.floor(mins / 1440)}d ago`;
  return date(v);
};
function getUser() {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.user || parsed;
  } catch { return null; }
}
function Status({ value }) {
  const name = String(value || "Unknown");
  const normalized = name.toLowerCase();
  const styles = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    published: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    draft: "bg-slate-100 text-slate-600 ring-slate-200",
    submitted: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    new: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    reviewing: "bg-amber-50 text-amber-700 ring-amber-100",
    shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    interview: "bg-violet-50 text-violet-700 ring-violet-100",
    hired: "bg-teal-50 text-teal-700 ring-teal-100",
    rejected: "bg-red-50 text-red-700 ring-red-100",
  };
  return <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${styles[normalized] || "bg-slate-100 text-slate-600 ring-slate-200"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{normalized === "submitted" ? "New" : name}</span>;
}
function PanelHeading({ title, subtitle, action, href }) {
  return <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
    <div><h2 className="text-base font-extrabold tracking-tight text-[#18124A] sm:text-lg">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{subtitle}</p></div>
    {action && <Link to={href} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5145E5] transition hover:text-[#18124A]">{action}<ArrowUpRight size={15} /></Link>}
  </div>;
}
function StatCard({ label, value, detail, icon: Icon, tone }) {
  const tones = {
    indigo: "bg-indigo-50 text-[#5145E5]", teal: "bg-teal-50 text-teal-600",
    violet: "bg-violet-50 text-violet-600", amber: "bg-amber-50 text-amber-600",
  };
  return <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/[0.05] sm:p-6">
    <div className="flex items-start justify-between gap-3"><p className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</p><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon size={20} /></span></div>
    <p className="mt-3 text-3xl font-black tracking-tight text-[#18124A] sm:text-4xl">{number(value)}</p>
    <p className="mt-2 text-xs text-slate-500">{detail}</p>
  </div>;
}
function EmptyState({ icon: Icon, title, text, action, href }) {
  return <div className="flex flex-col items-center px-5 py-12 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5145E5]/[0.07] text-[#5145E5]"><Icon size={24} /></div><h3 className="mt-4 text-sm font-bold text-[#18124A]">{title}</h3><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{text}</p>{action && <Link to={href} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4338CA]">{action}<ArrowRight size={14} /></Link>}</div>;
}
function JobRow({ job }) {
  return <div className="grid gap-4 px-5 py-4 transition hover:bg-[#F8F9FF] sm:grid-cols-[minmax(0,1.7fr)_minmax(70px,.6fr)_minmax(65px,.5fr)_auto] sm:items-center sm:px-6">
    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold text-[#18124A]">{job.title || "Untitled job"}</h3><Status value={job.status} /></div><div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 size={13} />{job.type || "Type unspecified"}</span><span className="inline-flex items-center gap-1"><MapPin size={13} />{job.location || "Location unspecified"}</span></div><p className="mt-2 text-[11px] text-slate-400">{String(job.status || "").toLowerCase() === "draft" ? "Not published" : job.posted_at ? `Posted ${date(job.posted_at)}` : "Posting date unavailable"}</p></div>
    <div className="flex items-center justify-between sm:block"><span className="text-xs text-slate-400 sm:hidden">Applications</span><p className="text-sm font-extrabold text-[#18124A]">{number(job.applications)}</p></div>
    <div className="flex items-center justify-between sm:block"><span className="text-xs text-slate-400 sm:hidden">Views</span><p className="text-sm font-extrabold text-[#18124A]">{number(job.views)}</p></div>
    <Link to={`/company/jobs/${job.id}`} className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-indigo-100 px-3 py-2 text-xs font-bold text-[#5145E5] transition hover:bg-indigo-50">Manage<ChevronRight size={14} /></Link>
  </div>;
}
const quickActions = [
  { title: "Post a new job", subtitle: "Reach more qualified candidates", path: "/company/jobs/new", icon: Plus },
  { title: "Review applicants", subtitle: "Find your strongest matches", path: "/company/applicants", icon: Users },
  { title: "Company profile", subtitle: "Keep your employer brand updated", path: "/company/company-profile", icon: Building2 },
];
export default function CompanyDashboard() {
  const [user] = useState(getUser);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadDashboard = useCallback(async (signal) => {
    setLoading(true); setError("");
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (!token) { setError("Your session has expired. Please sign in again."); setLoading(false); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/employer/dashboard/`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, signal });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(response.status === 401 ? "Your session has expired. Please sign in again." : data.message || data.detail || "Unable to load your dashboard.");
      if (!signal?.aborted) setDashboard(data);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "Unable to connect to the server.");
    } finally { if (!signal?.aborted) setLoading(false); }
  }, []);
  useEffect(() => { const controller = new AbortController(); loadDashboard(controller.signal); return () => controller.abort(); }, [loadDashboard]);

  const displayName = user?.full_name || user?.username || "Employer";
  const firstName = displayName.trim().split(/\s+/)[0];
  const company = dashboard?.company || user?.company || null;
  const companyName = company?.name || user?.company_name || "Your Company";
  const stats = dashboard?.stats || {};
  const jobs = Array.isArray(dashboard?.jobs) ? dashboard.jobs : [];
  const applicants = Array.isArray(dashboard?.applicants) ? dashboard.applicants : [];
  const subscription = dashboard?.subscription;
  const planName = typeof subscription?.plan === "string" ? subscription.plan : subscription?.plan?.name || "No active plan";
  const profileFields = company ? [company.name, company.website, company.description, company.location, company.country] : [];
  const profileCompleted = profileFields.filter((v) => typeof v === "string" && v.trim()).length;
  const profilePercent = company ? Math.round((profileCompleted / profileFields.length) * 100) : 0;

  if (loading && !dashboard) return <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50"><LoaderCircle size={30} className="animate-spin text-[#5145E5]" /></div><p className="text-sm font-medium text-slate-500">Loading your hiring workspace...</p></div>;
  if (error && !dashboard) return <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><CircleAlert size={26} /></div><h2 className="mt-5 text-xl font-extrabold text-[#18124A]">Unable to load dashboard</h2><p className="mt-2 text-sm leading-6 text-slate-500">{error}</p><div className="mt-6 flex justify-center gap-3"><button onClick={() => loadDashboard()} className="rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white hover:bg-[#4338CA]">Try again</button>{error.toLowerCase().includes("sign in") && <Link to="/signin" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#18124A]">Sign in</Link>}</div></div>;

  return <div className="mx-auto max-w-[1600px] space-y-6 pb-8 sm:space-y-7">
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button onClick={() => loadDashboard()} className="font-bold underline">Retry</button></div>}

    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18124A] via-[#30247E] to-[#5145E5] px-6 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[38px] border-white/[0.06]" /><div className="pointer-events-none absolute bottom-[-100px] right-32 h-56 w-56 rounded-full bg-[#14E0C8]/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A9FFF0]"><Sparkles size={13} />Employer workspace</span><h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">Welcome back, {firstName} <span aria-hidden="true">👋</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Here's what's happening at <span className="font-bold text-white">{companyName}</span>. Manage your openings, connect with candidates, and grow your team.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => loadDashboard()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} />Refresh</button><Link to="/company/jobs/new" className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-5 py-3 text-sm font-extrabold text-[#18124A] transition hover:bg-[#73F4E4]"><Plus size={17} />Post a Job<ArrowUpRight size={16} /></Link></div></div>
    </section>

    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active Jobs" value={stats.active_jobs} detail="Currently open positions" icon={BriefcaseBusiness} tone="indigo" /><StatCard label="Total Applications" value={stats.total_applications} detail="Applications received" icon={FileText} tone="teal" /><StatCard label="Job Views" value={stats.job_views} detail="Views across your listings" icon={Eye} tone="violet" /><StatCard label="Shortlisted" value={stats.shortlisted} detail={`${number(stats.awaiting_review)} awaiting review`} icon={CheckCircle2} tone="amber" /></section>

    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-white p-5 sm:flex-row sm:items-center sm:p-6"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#5145E5] shadow-sm ring-1 ring-indigo-100"><Building2 size={23} /></div><div><h2 className="text-sm font-extrabold text-[#18124A] sm:text-base">{companyName === "Your Company" ? "Complete your company profile" : `Make ${companyName} stand out`}</h2><p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">A complete employer profile helps candidates understand your company and the opportunities you offer.</p>{company && <div className="mt-3 flex items-center gap-3"><div className="h-2 w-36 overflow-hidden rounded-full bg-indigo-100"><div className="h-full rounded-full bg-[#5145E5] transition-all" style={{ width: `${profilePercent}%` }} /></div><span className="text-xs font-bold text-[#5145E5]">{profilePercent}% of basic details</span></div>}</div></div><Link to="/company/company-profile" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs font-bold text-[#5145E5] transition hover:bg-indigo-50 sm:self-center">Edit profile<ArrowUpRight size={15} /></Link></section>

    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.9fr)]"><div className="min-w-0 space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><PanelHeading title="Your job postings" subtitle="Track your open roles and job performance" action="View all jobs" href="/company/jobs" /><div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(70px,.6fr)_minmax(65px,.5fr)_auto] gap-4 border-b border-slate-100 bg-[#F8F9FF] px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid"><span>Position</span><span>Applications</span><span>Views</span><span>Action</span></div><div className="divide-y divide-slate-100">{jobs.length ? jobs.map((job) => <JobRow key={job.id} job={job} />) : <EmptyState icon={BriefcaseBusiness} title="No job postings yet" text="Create your first listing to start attracting candidates." action="Post your first job" href="/company/jobs/new" />}</div></section>
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><PanelHeading title="Recent applicants" subtitle="Candidates who recently applied to your jobs" action="View applicants" href="/company/applicants" /><div className="divide-y divide-slate-100">{applicants.length ? applicants.map((applicant, i) => { const name = applicant.name || "Candidate"; const initials = name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join(""); const palette = ["bg-indigo-100 text-indigo-700", "bg-teal-100 text-teal-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700"]; return <div key={applicant.id ?? i} className="flex items-center gap-3 px-5 py-4 transition hover:bg-[#F8F9FF] sm:px-6"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${palette[i % palette.length]}`}>{initials || "C"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#18124A]">{name}</p><p className="mt-1 truncate text-xs text-slate-500">{applicant.role || "Applicant"}</p><p className="mt-1 text-[11px] text-slate-400">{relativeDate(applicant.applied_at)}</p></div><div className="flex shrink-0 flex-col items-end gap-2"><Status value={applicant.status} /><Link to="/company/applicants" className="text-xs font-bold text-[#5145E5] hover:underline">Review →</Link></div></div>; }) : <EmptyState icon={Users} title="No applicants yet" text="When candidates apply to your jobs, their applications will appear here." />}</div></section>
    </div><div className="min-w-0 space-y-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-extrabold text-[#18124A]">Hiring performance</h2><p className="mt-1 text-xs leading-5 text-slate-500">Your current application overview</p></div><div className="rounded-xl bg-indigo-50 p-2.5 text-[#5145E5]"><BarChart3 size={20} /></div></div><div className="mt-7"><p className="text-4xl font-black tracking-tight text-[#18124A]">{number(stats.total_applications)}</p><p className="mt-1 text-xs text-slate-500">Total applications received</p></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#F8F9FF] p-4"><p className="text-xs text-slate-500">Awaiting review</p><p className="mt-2 text-2xl font-extrabold text-[#18124A]">{number(stats.awaiting_review)}</p></div><div className="rounded-xl bg-teal-50 p-4"><p className="text-xs text-teal-700">Shortlisted</p><p className="mt-2 text-2xl font-extrabold text-teal-700">{number(stats.shortlisted)}</p></div></div><Link to="/company/applicants" className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-[#5145E5]">Review applications<ArrowUpRight size={15} /></Link></section>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#18124A] via-[#30247E] to-[#5145E5] p-6 text-white"><div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border-[25px] border-white/[0.06]" /><div className="relative"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Zap size={21} className="text-[#14E0C8]" /></div><p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#A9FFF0]">Hiring insight</p><h2 className="mt-2 text-xl font-extrabold leading-7">Great hires start with great job descriptions.</h2><p className="mt-3 text-sm leading-6 text-indigo-100">Clearly explain responsibilities, skills, and benefits to help candidates decide whether to apply.</p><Link to="/company/jobs/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-[#18124A] hover:bg-[#E8E6FF]">Create a job listing<ArrowUpRight size={15} /></Link></div></section>
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><PanelHeading title="Quick actions" subtitle="Frequently used workspace tools" /><div className="space-y-2 p-4 pt-1 sm:p-5 sm:pt-1">{quickActions.map(({ title, subtitle, path, icon: Icon }) => <Link key={path} to={path} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-100 hover:bg-indigo-50/40"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#5145E5]"><Icon size={18} /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-[#18124A]">{title}</p><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div><ChevronRight size={17} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#5145E5]" /></Link>)}</div></section>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><CreditCard size={18} className="text-[#5145E5]" /><h2 className="text-sm font-extrabold text-[#18124A]">Your subscription</h2></div><span className="max-w-[140px] truncate rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-[#5145E5]">{planName}</span></div><p className="mt-3 text-xs leading-6 text-slate-500">{subscription ? `Your ${planName} plan is ${subscription.status || "configured"}.` : "No active subscription was found for your company."}</p><Link to="/company/subscription" className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-[#5145E5]">Manage subscription<ChevronRight size={15} /></Link></section>
    </div></div>
  </div>;
}