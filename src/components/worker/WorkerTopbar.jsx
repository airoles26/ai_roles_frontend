import { Link, useLocation } from "react-router-dom";
import { Menu, Search, Bell, ChevronRight, Sparkles, UserRound } from "lucide-react";

const labels = {
  "/worker/dashboard": "Overview",
  "/worker/applications": "My Applications",
  "/worker/saved-jobs": "Saved Jobs",
  "/worker/matches": "Quantum Matches",
  "/worker/profile": "My Profile",
  "/worker/settings": "Settings",
};

export default function WorkerTopbar({ onMenuClick, user }) {
  const location = useLocation();
  const title = labels[location.pathname] || "Talent Workspace";
  const name = user?.full_name || user?.username || "Job seeker";
  const firstName = name.trim().split(/\s+/)[0];
  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-[#E9EAF3] bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open navigation" className="rounded-xl border border-slate-200 p-2.5 text-[#18124A] hover:bg-slate-50 lg:hidden"><Menu size={21} /></button>
        <div className="min-w-0">
          <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex"><span>Workspace</span><ChevronRight size={13} /><span className="truncate text-[#5145E5]">{title}</span></div>
          <h1 className="truncate text-lg font-extrabold tracking-tight text-[#18124A] sm:mt-0.5 sm:text-xl">{title}</h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link to="/jobs" aria-label="Search jobs" className="rounded-xl p-2.5 text-slate-500 transition hover:bg-[#F8F9FF] hover:text-[#5145E5] sm:hidden"><Search size={20} /></Link>
        <Link to="/jobs" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-[#F8F9FF] px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:border-[#5145E5]/30 sm:inline-flex"><Search size={16} /> Search jobs <span className="ml-5 text-[10px] text-slate-400">↗</span></Link>
        <Link to="/worker/matches" title="Quantum matches" aria-label="Quantum matches" className="rounded-xl p-2.5 text-[#5145E5] transition hover:bg-[#5145E5]/10"><Sparkles size={20} /></Link>
        {/* Connect to a real notifications route or API when available. */}
        <span className="hidden h-7 w-px bg-slate-200 sm:block" />
        <Link to="/worker/profile" className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-50" aria-label="Open your profile">
          {user?.profile_image ? <img src={user.profile_image} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5145E5]/10 text-[#5145E5]"><UserRound size={19} /></span>}
          <span className="hidden max-w-28 truncate text-sm font-bold text-[#18124A] xl:block">{firstName}</span>
        </Link>
      </div>
    </header>
  );
}