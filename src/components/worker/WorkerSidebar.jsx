import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  X, LayoutDashboard, Search, BriefcaseBusiness, Bookmark,
  Atom, UserRound, Settings, LogOut, Sparkles, ArrowUpRight,
} from "lucide-react";

import logo from "../../assets/logo.png";

const sections = [
  { label: "WORKSPACE", links: [
    { label: "Overview", to: "/worker/dashboard", icon: LayoutDashboard, end: true },
    { label: "Find Jobs", to: "/jobs", icon: Search },
    { label: "My Applications", to: "/worker/applications", icon: BriefcaseBusiness },
    { label: "Saved Jobs", to: "/worker/saved-jobs", icon: Bookmark },
    { label: "Quantum Matches", to: "/worker/quantum-matches", icon: Atom },
    { label: "My Subscriptions", to: "/worker/subscription", icon: Atom },
  ] },
  { label: "ACCOUNT", links: [
    { label: "My Profile", to: "/worker/profile", icon: UserRound },
    { label: "Settings", to: "/worker/settings", icon: Settings },
  ] },
];

export default function WorkerSidebar({ open, onClose, user }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("user");
    onClose();
    navigate("/signin", { replace: true });
  };

  const name = user?.full_name || user?.username || "Job seeker";
  const initials = name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  return (
    <>
      {open && <button type="button" aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-[#10162F]/60 backdrop-blur-[2px] lg:hidden" />}
      <aside aria-label="Worker navigation" className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-[#E9EAF3] bg-white shadow-xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
          <NavLink
  to="/worker/dashboard"
  onClick={onClose}
  className="flex items-center"
>
  <img
    src={logo}
    alt="Quantahire Logo"
    className="h-12 w-auto max-w-[190px] object-contain sm:h-14"
  />
</NavLink>
          <button type="button" onClick={onClose} aria-label="Close sidebar" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><X size={20} /></button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-4 text-[10px] font-extrabold tracking-[0.16em] text-slate-400">{section.label}</p>
              <div className="space-y-1">
                {section.links.map(({ label, to, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-[#5145E5]/[0.09] text-[#5145E5]" : "text-slate-600 hover:bg-[#F8F9FF] hover:text-[#18124A]"}`}>
                    <Icon size={18} strokeWidth={2} /><span className="flex-1">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          <div className="mx-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#18124A] to-[#5145E5] p-4 text-white">
            <span className="inline-flex rounded-lg bg-white/10 p-2 text-[#14E0C8]"><Sparkles size={18} /></span>
            <p className="mt-3 text-sm font-extrabold">Find your next opportunity</p>
            <p className="mt-1 text-xs leading-5 text-white/70">Explore roles that fit your skills and career goals.</p>
            <NavLink to="/jobs" onClick={onClose} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#14E0C8]">Browse jobs <ArrowUpRight size={14} /></NavLink>
          </div>
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            {user?.profile_image ? <img src={user.profile_image} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5145E5]/10 text-sm font-bold text-[#5145E5]">{initials || "JS"}</span>}
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#18124A]">{name}</p><p className="truncate text-xs text-slate-400">Job seeker</p></div>
          </div>
          <button type="button" onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"><LogOut size={18} /> Sign out</button>
        </div>
      </aside>
    </>
  );
}