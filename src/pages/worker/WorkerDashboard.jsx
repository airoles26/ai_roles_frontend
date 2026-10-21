import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, BriefcaseBusiness, CheckCircle2, Clock3, FileText, LoaderCircle, MapPin, RefreshCw, Sparkles, Target, TrendingUp, UserRound, Zap } from 'lucide-react';
import api from '../../api/api';

const dateText = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const statusLabels = { submitted: 'Submitted', reviewing: 'Under review', shortlisted: 'Shortlisted', interview: 'Interview', rejected: 'Rejected', hired: 'Hired', withdrawn: 'Withdrawn' };
const statusColors = { submitted: 'bg-slate-100 text-slate-600', reviewing: 'bg-indigo-50 text-indigo-700', shortlisted: 'bg-teal-50 text-teal-700', interview: 'bg-amber-50 text-amber-700', rejected: 'bg-red-50 text-red-700', hired: 'bg-green-50 text-green-700', withdrawn: 'bg-slate-100 text-slate-500' };

function StatCard({ icon: Icon, label, value, hint }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="rounded-xl bg-indigo-50 p-2.5 text-[#5145E5]"><Icon size={19}/></span></div>
    <div className="mt-3 text-3xl font-extrabold text-[#18124A]">{value ?? 0}</div><p className="mt-1 text-xs text-slate-400">{hint}</p>
  </div>;
}
function JobRow({ job, extra }) {
  return <div className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-b-0">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 font-bold text-[#5145E5]">{job.company?.logo_url ? <img src={job.company.logo_url} alt="" className="h-full w-full object-contain p-1"/> : (job.company?.name || 'J').charAt(0)}</div>
    <div className="min-w-0 flex-1"><Link to={`/jobs/${job.slug || job.id}`} className="block truncate text-sm font-bold text-[#18124A] hover:text-[#5145E5]">{job.title}</Link><p className="mt-1 truncate text-xs text-slate-500">{job.company?.name} {job.location ? `• ${job.location}` : ''}</p></div>
    <div className="shrink-0 text-right">{extra || <ArrowRight size={16} className="text-slate-400"/>}</div>
  </div>;
}

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { const response = await api.get('/worker/dashboard/'); setData(response.data); }
    catch (err) { if (err.response?.status === 401) setError('Your session expired. Please sign in again.'); else if (err.response?.status === 403) setError('This dashboard is for job seekers only.'); else setError(err.response?.data?.detail || 'Unable to load your dashboard.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading && !data) return <div className="flex min-h-[65vh] items-center justify-center gap-3 text-[#5145E5]"><LoaderCircle className="animate-spin"/> Loading your dashboard...</div>;
  if (error && !data) return <div className="mx-auto max-w-xl px-5 py-24 text-center"><h2 className="text-xl font-bold text-[#18124A]">Dashboard unavailable</h2><p className="mt-3 text-slate-500">{error}</p><button onClick={error.includes('sign in') ? () => navigate('/signin') : load} className="mt-5 rounded-xl bg-[#5145E5] px-5 py-3 font-bold text-white">{error.includes('sign in') ? 'Sign in' : 'Try again'}</button></div>;
  const user = data?.user || {}; const stats = data?.stats || {}; const profile = data?.profile || {};
  return <main className="min-h-screen bg-[#F8F9FF] px-4 py-7 text-[#18124A] sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#5145E5]">Job seeker workspace</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back, {(user.full_name || user.username || 'there').split(' ')[0]} 👋</h1><p className="mt-2 text-sm text-slate-500">Track your applications and discover your next opportunity.</p></div><button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-indigo-300 disabled:opacity-50"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/> Refresh</button></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={BriefcaseBusiness} label="Applications" value={stats.total_applications} hint="Jobs you've applied to"/><StatCard icon={Clock3} label="Under review" value={stats.under_review} hint="Employers reviewing"/><StatCard icon={CheckCircle2} label="Shortlisted" value={stats.shortlisted} hint="Moved to shortlist"/><StatCard icon={Bookmark} label="Saved jobs" value={stats.saved_jobs} hint="Opportunities bookmarked"/></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">Recent applications</h2><p className="mt-1 text-xs text-slate-500">Your latest submitted applications</p></div><Link to="/worker/applications" className="text-xs font-bold text-[#5145E5]">View all <ArrowRight size={14} className="inline"/></Link></div><div className="mt-3">{data.recent_applications?.length ? data.recent_applications.map(a => <JobRow key={a.id} job={a.job} extra={<><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusColors[a.status] || statusColors.submitted}`}>{statusLabels[a.status] || a.status}</span><p className="mt-1 text-[10px] text-slate-400">{dateText(a.applied_at)}</p></>}/>) : <p className="py-10 text-center text-sm text-slate-500">No applications yet. <Link to="/jobs" className="font-bold text-[#5145E5]">Browse jobs</Link></p>}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-lg font-extrabold"><Sparkles size={19} className="text-[#5145E5]"/> Suggested opportunities</h2><p className="mt-1 text-xs text-slate-500">Based on your job title or location where available; otherwise recent listings</p></div><Link to="/jobs" className="text-xs font-bold text-[#5145E5]">Explore jobs <ArrowRight size={14} className="inline"/></Link></div><div className="mt-3">{data.recommended_jobs?.length ? data.recommended_jobs.map(job => <JobRow key={job.id} job={job}/>) : <p className="py-10 text-center text-sm text-slate-500">No available jobs to recommend right now.</p>}</div></section></div>
        <div className="space-y-6"><section className="rounded-2xl bg-[#18124A] p-6 text-white"><div className="flex items-center gap-2 text-sm font-bold"><UserRound size={18} className="text-[#14E0C8]"/> Profile strength</div><div className="mt-4 flex items-end justify-between"><span className="text-4xl font-extrabold">{profile.completion_percentage ?? 0}%</span><span className="text-xs text-white/60">Complete</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#14E0C8]" style={{ width: `${profile.completion_percentage || 0}%` }}/></div><p className="mt-3 text-xs leading-5 text-white/70">{profile.missing_fields?.length ? `Add ${profile.missing_fields.slice(0, 3).map(x => x.replaceAll('_', ' ')).join(', ')} to improve your profile.` : 'Your profile details are complete.'}</p><Link to="/worker/profile" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#18124A]">Update profile <ArrowRight size={14}/></Link></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-base font-extrabold">Saved jobs</h2><Bookmark size={18} className="text-[#5145E5]"/></div><div className="mt-2">{data.saved_jobs?.length ? data.saved_jobs.map(job => <JobRow key={job.id} job={job}/>) : <p className="py-8 text-sm text-slate-500">You haven't saved any jobs yet.</p>}</div><Link to="/worker/saved-jobs" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#5145E5]">View saved jobs <ArrowRight size={14}/></Link></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 text-base font-extrabold"><Zap size={18} className="text-[#5145E5]"/> Quantum match activity</h2><p className="mt-1 text-xs text-slate-500">Runs you've started</p><div className="mt-3 space-y-3">{data.recent_quantum_runs?.length ? data.recent_quantum_runs.map(run => <div key={run.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"><div><p className="text-xs font-bold capitalize">{run.problem_type} run</p><p className="mt-1 text-[11px] text-slate-500">{dateText(run.created_at)} · {run.execution}</p></div><span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold capitalize text-indigo-700">{run.status.replaceAll('_', ' ')}</span></div>) : <p className="py-6 text-sm text-slate-500">No matching runs yet.</p>}</div></section>
          <Link to="/jobs" className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#5145E5] to-[#7569EE] p-5 text-white"><div><p className="text-sm font-extrabold">Explore more opportunities</p><p className="mt-1 text-xs text-white/75">Find jobs that fit your next move</p></div><Target size={24}/></Link>
        </div>
      </div>
    </div>
  </main>;
}