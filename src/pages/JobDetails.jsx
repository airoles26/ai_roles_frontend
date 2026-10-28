import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2,
  CalendarDays, CheckCircle2, Clock3, ExternalLink, Globe2, MapPin,
  Share2, Sparkles, Tag, Wifi, AlertCircle, RefreshCw, Wallet,
  ShieldCheck, ChevronRight,
} from "lucide-react";
import api from "../api/api";

const BRAND = { primary: "#5145E5", dark: "#18124A", teal: "#14E0C8" };

function formatDate(value) {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not specified" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function relativeDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return formatDate(value);
}
function formatSalary(job) {
  const min = job?.salary_min;
  const max = job?.salary_max;
  if ((min == null || min === "") && (max == null || max === "")) return "Not disclosed";
  const currency = job?.currency || "";
  const fmt = (n) => Number(n).toLocaleString("en-US");
  if (min != null && min !== "" && max != null && max !== "") return `${currency} ${fmt(min)} – ${fmt(max)}`.trim();
  if (min != null && min !== "") return `${currency} ${fmt(min)}+`.trim();
  return `Up to ${currency} ${fmt(max)}`.trim();
}
function employmentLabel(value) {
  const names = { full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship", temporary: "Temporary", freelance: "Freelance" };
  return names[value] || (value ? value.replaceAll("_", " ").replace(/\b\w/g, (s) => s.toUpperCase()) : "Not specified");
}
function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E8E7F6] bg-white p-4 sm:p-5 shadow-sm shadow-indigo-950/[0.025]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#5145E5]/[0.08] text-[#5145E5]"><Icon size={19} /></div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[#18124A]">{value}</p>
    </div>
  );
}
function SidebarLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F1FF] text-[#5145E5]"><Icon size={17} /></span>
      <div className="min-w-0"><p className="text-xs text-slate-500">{label}</p><p className="mt-0.5 break-words text-sm font-semibold text-[#18124A]">{value}</p></div>
    </div>
  );
}
function Description({ value }) {
  if (!value) return <p className="text-slate-500">No detailed description is available for this job yet.</p>;
  return <div className="space-y-4 whitespace-pre-line break-words text-[15px] leading-8 text-slate-600">{String(value).split(/\n\s*\n/).filter(Boolean).map((part, index) => <p key={index}>{part.trim()}</p>)}</div>;
}
function LoadingState() {
  return <div className="min-h-screen bg-[#F8F9FE]"><div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8"><div className="mb-7 h-4 w-32 rounded bg-indigo-100"/><div className="h-64 rounded-[28px] bg-indigo-100"/><div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_330px]"><div className="space-y-5"><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-32 rounded-2xl bg-indigo-50"/>)}</div><div className="h-96 rounded-3xl bg-indigo-50"/></div><div className="h-80 rounded-3xl bg-indigo-50"/></div></div></div>;
}

export default function JobDetails() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(""); setJob(null);
      if (!slug) { setError("The job link is invalid or incomplete."); setLoading(false); return; }
      try {
        const response = await api.get(`/jobs/${slug}/`);
        if (!cancelled) setJob(response.data?.job || response.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.status === 404 ? "This job could not be found or is no longer available." : "We couldn't load this opportunity. Please try again.");
      } finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, retry]);

  async function shareJob() {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: `${job.title} | Quantahire`, url }); return; }
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 2000); return; }
      window.prompt("Copy this job link:", url);
    } catch (err) { if (err.name !== "AbortError") console.error("Unable to share job", err); }
  }

  if (loading) return <LoadingState />;
  if (error || !job) return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F9FE] px-4 py-20">
      <div className="w-full max-w-lg rounded-3xl border border-indigo-100 bg-white p-9 text-center shadow-xl shadow-indigo-950/5">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><AlertCircle size={30}/></span>
        <h1 className="mt-5 text-2xl font-extrabold text-[#18124A]">Opportunity unavailable</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">{error || "This job could not be found."}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white hover:bg-[#4237C9]"><ArrowLeft size={17}/> Browse jobs</Link><button onClick={() => setRetry(v => v+1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw size={16}/> Try again</button></div>
      </div>
    </main>
  );

  const company = job.company || {};
  const companyName = company.name || "Company not specified";
  const location = job.remote ? (job.location ? `Remote · ${job.location}` : "Remote") : (job.location || job.country || "Not specified");
  const salary = formatSalary(job);
  const applyUrl = job.apply_url || job.source_url;
  const postedAt = job.posted_at || job.discovered_at;
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <main className="min-h-screen bg-[#F8F9FE] pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
          <Link to="/" className="hover:text-[#5145E5]">Home</Link><ChevronRight size={14}/><Link to="/jobs" className="hover:text-[#5145E5]">Explore jobs</Link><ChevronRight size={14}/><span className="max-w-[220px] truncate text-[#5145E5] sm:max-w-md">{job.title}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[28px] bg-[#18124A] px-5 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-9 sm:py-10 lg:px-12">
          <div className="pointer-events-none absolute -right-16 -top-32 h-80 w-80 rounded-full bg-[#5145E5]/60 blur-[85px]"/><div className="pointer-events-none absolute bottom-[-150px] left-[35%] h-64 w-64 rounded-full bg-[#14E0C8]/15 blur-[80px]"/>
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-5 flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"><Sparkles size={13} className="text-[#14E0C8]"/> Career opportunity</span>{job.is_featured && <span className="rounded-full bg-[#14E0C8] px-3 py-1.5 text-xs font-bold text-[#18124A]">Featured</span>}</div>
              <div className="flex items-start gap-4 sm:gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2 sm:h-20 sm:w-20">{company.logo_url ? <img src={company.logo_url} alt={`${companyName} logo`} className="h-full w-full object-contain"/> : <Building2 className="text-[#5145E5]" size={30}/>}</div><div className="min-w-0"><p className="mb-2 text-sm font-semibold text-[#14E0C8]">{companyName}</p><h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">{job.title}</h1><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-indigo-100"><span className="inline-flex items-center gap-1.5"><MapPin size={16}/>{location}</span><span className="inline-flex items-center gap-1.5"><BriefcaseBusiness size={16}/>{employmentLabel(job.employment_type)}</span><span className="inline-flex items-center gap-1.5"><Clock3 size={16}/>{relativeDate(postedAt)}</span></div></div></div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 lg:flex-col lg:items-stretch"><button onClick={shareJob} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20">{copied ? <CheckCircle2 size={18}/> : <Share2 size={18}/>} {copied ? "Link copied" : "Share job"}</button>{applyUrl && <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14E0C8] px-7 py-3.5 text-sm font-extrabold text-[#18124A] transition hover:bg-[#7CF3E5]">Apply now <ArrowUpRight size={18}/></a>}</div>
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><InfoTile icon={MapPin} label="Location" value={location}/><InfoTile icon={BriefcaseBusiness} label="Employment" value={employmentLabel(job.employment_type)}/><InfoTile icon={Wifi} label="Work mode" value={job.remote ? "Remote" : "Not specified"}/><InfoTile icon={Wallet} label="Salary range" value={salary}/></div>
            <section className="rounded-3xl border border-[#E8E7F6] bg-white p-5 shadow-sm shadow-indigo-950/[0.025] sm:p-8"><div className="mb-6 flex items-center gap-3"><span className="h-8 w-1 rounded-full bg-[#5145E5]"/><div><p className="text-xs font-bold uppercase tracking-widest text-[#5145E5]">Job description</p><h2 className="mt-1 text-xl font-extrabold text-[#18124A] sm:text-2xl">About this opportunity</h2></div></div><Description value={job.description}/></section>
            {skills.length > 0 && <section className="rounded-3xl border border-[#E8E7F6] bg-white p-5 sm:p-8"><div className="mb-5 flex items-center gap-3 text-[#5145E5]"><Tag size={21}/><h2 className="text-xl font-extrabold text-[#18124A]">Skills & technologies</h2></div><div className="flex flex-wrap gap-2">{skills.map((skill, i) => { const name = typeof skill === "string" ? skill : skill?.name; if (!name) return null; return <span key={skill?.id || skill?.slug || i} className="rounded-full border border-[#DCD8FF] bg-[#F5F3FF] px-4 py-2 text-sm font-semibold text-[#5145E5]">{name}</span>; })}</div></section>}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5145E5] to-[#34268C] p-6 text-white sm:p-8"><div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#14E0C8]/20 blur-3xl"/><div className="relative"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Sparkles size={21} className="text-[#14E0C8]"/></div><h2 className="mt-4 text-2xl font-extrabold">Your next career move starts here.</h2><p className="mt-2 max-w-xl text-sm leading-7 text-indigo-100">Explore the opportunity, review the requirements, and take the next step toward your career goals.</p>{applyUrl ? <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3.5 text-sm font-bold text-[#18124A] hover:bg-[#7CF3E5]">Apply for this job <ArrowRight size={18}/></a> : <p className="mt-5 rounded-xl bg-white/10 p-4 text-sm">An application link is not available for this listing. Check the employer's website for further information.</p>}</div></section>
          </div>

          <aside className="min-w-0"><div className="space-y-5 lg:sticky lg:top-24"><section className="rounded-3xl border border-[#E8E7F6] bg-white p-6 shadow-sm shadow-indigo-950/[0.025]"><div className="mb-5 flex items-center gap-2"><Building2 size={19} className="text-[#5145E5]"/><h2 className="text-lg font-extrabold text-[#18124A]">About the company</h2></div><div className="flex items-center gap-3"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-indigo-100 bg-white p-2">{company.logo_url ? <img src={company.logo_url} alt={`${companyName} logo`} className="h-full w-full object-contain"/> : <Building2 className="text-[#5145E5]"/>}</div><div className="min-w-0"><p className="break-words font-extrabold text-[#18124A]">{companyName}</p>{company.location && <p className="mt-1 text-xs text-slate-500">{company.location}</p>}</div></div>{company.description && <p className="mt-4 line-clamp-5 text-sm leading-7 text-slate-600">{company.description}</p>}<div className="mt-5 space-y-2">{company.slug && <Link to={`/jobs/company/${company.slug}`} className="flex items-center justify-between rounded-xl border border-indigo-100 bg-[#F8F7FF] px-4 py-3 text-sm font-bold text-[#5145E5] hover:bg-[#EFEDFF]">View company jobs <ArrowUpRight size={17}/></Link>}{company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Visit company website <ExternalLink size={16}/></a>}</div></section>
            <section className="rounded-3xl border border-[#E8E7F6] bg-white p-6 shadow-sm shadow-indigo-950/[0.025]"><h2 className="text-lg font-extrabold text-[#18124A]">Job overview</h2><div className="mt-3 divide-y divide-slate-100"><SidebarLine icon={CalendarDays} label="Posted" value={formatDate(postedAt)}/>{job.category?.name && <SidebarLine icon={Tag} label="Category" value={job.category.name}/>}<SidebarLine icon={MapPin} label="Location" value={location}/><SidebarLine icon={BriefcaseBusiness} label="Job type" value={employmentLabel(job.employment_type)}/>{(job.application_deadline || job.expires_at) && <SidebarLine icon={Clock3} label="Application deadline" value={formatDate(job.application_deadline || job.expires_at)}/>}</div></section>
            <div className="flex items-start gap-3 rounded-2xl border border-[#C7F7EF] bg-[#ECFFFB] p-5"><ShieldCheck className="mt-0.5 shrink-0 text-[#138F83]" size={20}/><div><p className="text-sm font-bold text-[#18124A]">Apply with confidence</p><p className="mt-1 text-xs leading-6 text-slate-600">External application links take you to the employer's hiring page. Always review the employer and role before sharing personal information.</p></div></div>
          </div></aside>
        </div>
      </div>
    </main>
  );
}