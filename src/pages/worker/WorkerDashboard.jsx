
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bookmark, BriefcaseBusiness, CheckCircle2, Clock3,
  LoaderCircle, RefreshCw, Sparkles, Target, UserRound, Zap,
} from 'lucide-react';
import api from '../../api/api';

const dateText = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const statusLabels = { submitted: 'Submitted', reviewing: 'Under review', shortlisted: 'Shortlisted', interview: 'Interview', rejected: 'Rejected', hired: 'Hired', withdrawn: 'Withdrawn' };
const statusColors = { submitted: 'bg-slate-100 text-slate-600', reviewing: 'bg-indigo-50 text-indigo-700', shortlisted: 'bg-teal-50 text-teal-700', interview: 'bg-amber-50 text-amber-700', rejected: 'bg-red-50 text-red-700', hired: 'bg-green-50 text-green-700', withdrawn: 'bg-slate-100 text-slate-500' };

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-xs font-semibold leading-5 text-slate-500 sm:text-sm">{label}</span>
        <span className="shrink-0 rounded-xl bg-indigo-50 p-2 text-[#5145E5] sm:p-2.5"><Icon size={18} /></span>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-[#18124A] sm:mt-3 sm:text-3xl">{value ?? 0}</div>
      <p className="mt-1 text-[11px] leading-4 text-slate-400 sm:text-xs">{hint}</p>
    </div>
  );
}

function JobRow({ job, extra }) {
  if (!job) return null;
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3 border-b border-slate-100 py-4 last:border-b-0 sm:flex-nowrap">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 font-bold text-[#5145E5] sm:h-11 sm:w-11">
        {job.company?.logo_url ? <img src={job.company.logo_url} alt="" className="h-full w-full object-contain p-1" /> : (job.company?.name || 'J').charAt(0)}
      </div>
      <div className="min-w-0 flex-[1_1_calc(100%-4rem)] sm:flex-1">
        <Link to={`/jobs/${job.slug || job.id}`} className="block break-words text-sm font-bold leading-5 text-[#18124A] hover:text-[#5145E5] sm:truncate">{job.title}</Link>
        <p className="mt-1 break-words text-xs leading-5 text-slate-500 sm:truncate">{job.company?.name}{job.location ? ` • ${job.location}` : ''}</p>
      </div>
      <div className="ml-[3.25rem] min-w-0 text-left sm:ml-0 sm:shrink-0 sm:text-right">
        {extra || <ArrowRight size={16} className="text-slate-400" />}
      </div>
    </div>
  );
}

function SectionHeading({ title, subtitle, link, linkText, icon: Icon }) {
  return (
    <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-base font-extrabold leading-6 sm:text-lg">{Icon && <Icon size={19} className="shrink-0 text-[#5145E5]" />}{title}</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
      </div>
      <Link to={link} className="inline-flex shrink-0 items-center gap-1 self-start text-xs font-bold text-[#5145E5] hover:underline">{linkText}<ArrowRight size={14} /></Link>
    </div>
  );
}

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/worker/dashboard/');
      setData(response.data);
    } catch (err) {
      if (err.response?.status === 401) setError('Your session expired. Please sign in again.');
      else if (err.response?.status === 403) setError('This dashboard is for job seekers only.');
      else setError(err.response?.data?.detail || 'Unable to load your dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) return <div className="flex min-h-[65vh] items-center justify-center gap-3 px-4 text-center text-sm text-[#5145E5]"><LoaderCircle className="shrink-0 animate-spin" />Loading your dashboard...</div>;
  if (error && !data) return <div className="mx-auto max-w-xl px-5 py-20 text-center"><h2 className="text-xl font-bold text-[#18124A]">Dashboard unavailable</h2><p className="mt-3 text-slate-500">{error}</p><button onClick={error.includes('sign in') ? () => navigate('/signin') : load} className="mt-5 rounded-xl bg-[#5145E5] px-5 py-3 font-bold text-white">{error.includes('sign in') ? 'Sign in' : 'Try again'}</button></div>;

  const user = data?.user || {};
  const stats = data?.stats || {};
  const profile = data?.profile || {};
  const completion = Math.min(100, Math.max(0, Number(profile.completion_percentage) || 0));

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8F9FF] px-3 py-5 text-[#18124A] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5145E5] sm:text-xs sm:tracking-[.18em]">Job seeker workspace</p>
            <h1 className="mt-2 break-words text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">Welcome back, {(user.full_name || user.username || 'there').split(' ')[0]} 👋</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Track your applications and discover your next opportunity.</p>
          </div>
          <button onClick={load} disabled={loading} className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-indigo-300 disabled:opacity-50 sm:w-auto"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Refresh</button>
        </header>

        {error && data && <div role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error} Showing the last loaded dashboard.</div>}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4 xl:grid-cols-4">
          <StatCard icon={BriefcaseBusiness} label="Applications" value={stats.total_applications} hint="Jobs you've applied to" />
          <StatCard icon={Clock3} label="Under review" value={stats.under_review} hint="Employers reviewing" />
          <StatCard icon={CheckCircle2} label="Shortlisted" value={stats.shortlisted} hint="Moved to shortlist" />
          <StatCard icon={Bookmark} label="Saved jobs" value={stats.saved_jobs} hint="Opportunities bookmarked" />
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 items-start gap-5 sm:mt-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-6">
          <div className="min-w-0 space-y-5 sm:space-y-6">
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <SectionHeading title="Recent applications" subtitle="Your latest submitted applications" link="/worker/applications" linkText="View all" />
              <div className="mt-3">{data?.recent_applications?.length ? data.recent_applications.map(a => <JobRow key={a.id} job={a.job} extra={<><span className={`inline-block max-w-full rounded-full px-2.5 py-1 text-[10px] font-bold ${statusColors[a.status] || statusColors.submitted}`}>{statusLabels[a.status] || a.status}</span><p className="mt-1 text-[10px] text-slate-400">{dateText(a.applied_at)}</p></>} />) : <p className="py-10 text-center text-sm text-slate-500">No applications yet. <Link to="/jobs" className="font-bold text-[#5145E5]">Browse jobs</Link></p>}</div>
            </section>
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <SectionHeading title="Suggested opportunities" subtitle="Based on your job title or location where available; otherwise recent listings" link="/jobs" linkText="Explore jobs" icon={Sparkles} />
              <div className="mt-3">{data?.recommended_jobs?.length ? data.recommended_jobs.map(job => <JobRow key={job.id} job={job} />) : <p className="py-10 text-center text-sm text-slate-500">No available jobs to recommend right now.</p>}</div>
            </section>
          </div>

          <aside className="min-w-0 space-y-5 sm:space-y-6">
            <section className="min-w-0 rounded-2xl bg-[#18124A] p-5 text-white sm:p-6">
              <div className="flex items-center gap-2 text-sm font-bold"><UserRound size={18} className="text-[#14E0C8]" />Profile strength</div>
              <div className="mt-4 flex items-end justify-between gap-2"><span className="text-3xl font-extrabold sm:text-4xl">{completion}%</span><span className="text-xs text-white/60">Complete</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#14E0C8]" style={{ width: `${completion}%` }} /></div>
              <p className="mt-3 break-words text-xs leading-5 text-white/70">{profile.missing_fields?.length ? `Add ${profile.missing_fields.slice(0, 3).map(x => String(x).replaceAll('_', ' ')).join(', ')} to improve your profile.` : 'Your profile details are complete.'}</p>
              <Link to="/worker/profile" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#18124A]">Update profile <ArrowRight size={14} /></Link>
            </section>

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2"><h2 className="text-base font-extrabold">Saved jobs</h2><Bookmark size={18} className="shrink-0 text-[#5145E5]" /></div>
              <div className="mt-2">{data?.saved_jobs?.length ? data.saved_jobs.map(job => <JobRow key={job.id} job={job} />) : <p className="py-8 text-sm text-slate-500">You haven't saved any jobs yet.</p>}</div>
              <Link to="/worker/saved-jobs" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#5145E5]">View saved jobs <ArrowRight size={14} /></Link>
            </section>

            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <h2 className="flex items-center gap-2 text-base font-extrabold"><Zap size={18} className="shrink-0 text-[#5145E5]" />Quantum match activity</h2>
              <p className="mt-1 text-xs text-slate-500">Runs you've started</p>
              <div className="mt-3 space-y-3">{data?.recent_quantum_runs?.length ? data.recent_quantum_runs.map(run => <div key={run.id} className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3"><div className="min-w-0 flex-1"><p className="break-words text-xs font-bold capitalize">{run.problem_type} run</p><p className="mt-1 break-words text-[11px] text-slate-500">{dateText(run.created_at)} · {run.execution}</p></div><span className="max-w-full shrink-0 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold capitalize text-indigo-700">{String(run.status || '').replaceAll('_', ' ')}</span></div>) : <p className="py-6 text-sm text-slate-500">No matching runs yet.</p>}</div>
            </section>

            <Link to="/jobs" className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#5145E5] to-[#7569EE] p-4 text-white sm:p-5"><div className="min-w-0"><p className="text-sm font-extrabold">Explore more opportunities</p><p className="mt-1 text-xs leading-5 text-white/75">Find jobs that fit your next move</p></div><Target size={24} className="shrink-0" /></Link>
          </aside>
        </div>
      </div>
    </main>
  );
}