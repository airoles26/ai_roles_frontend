import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, Bell, Building2, Check, ChevronDown, ChevronRight,
  CircleHelp, LayoutDashboard, LoaderCircle, LogOut, Menu,
  Plus, Search, Settings, UserRound, X,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const pageTitles = [
  { path: "/employer/dashboard", title: "Overview", subtitle: "Your hiring workspace at a glance" },
  { path: "/employer/jobs/new", title: "Post a Job", subtitle: "Find the right talent for your team" },
  { path: "/employer/jobs", title: "Manage Jobs", subtitle: "Manage your open positions" },
  { path: "/employer/applicants", title: "Applicants", subtitle: "Review and connect with candidates" },
  { path: "/employer/company-profile", title: "Company Profile", subtitle: "Keep your company information up to date" },
  { path: "/employer/settings", title: "Settings", subtitle: "Manage your workspace preferences" },
  { path: "/employer/analytics", title: "Analytics", subtitle: "Understand your recruitment performance" },
  { path: "/employer/subscription", title: "Subscription", subtitle: "Manage your plan and billing" },
];

function getStoredUser() {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const stored = JSON.parse(storage.getItem("user") || "null");
      if (stored) return stored.user || stored;
    } catch { /* Ignore malformed cached user */ }
  }
  return null;
}

function getAccessToken() {
  return localStorage.getItem("access") || sessionStorage.getItem("access");
}

export default function CompanyTopbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const page = [...pageTitles]
    .sort((a, b) => b.path.length - a.path.length)
    .find(({ path }) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const pageTitle = page?.title || "Employer Workspace";
  const pageSubtitle = page?.subtitle || "Manage your hiring activity";
  const companyName = company?.name || user?.company?.name || user?.company_name || "Your Company";
  const displayName = user?.full_name || user?.username || "Employer";
  const companyLogo = company?.logo_url || company?.logo || user?.company?.logo_url;
  const companyInitial = companyName === "Your Company" ? null : companyName.charAt(0).toUpperCase();

  const loadCompany = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoadingCompany(true);
    try {
      const response = await fetch(`${API_BASE_URL}/employer/dashboard/`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.company) setCompany(data.company);
    } catch (error) {
      console.error("Unable to load company details:", error);
    } finally {
      setLoadingCompany(false);
    }
  }, []);

  useEffect(() => { setUser(getStoredUser()); }, [location.pathname]);
  useEffect(() => { loadCompany(); }, [loadCompany]);
  useEffect(() => {
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);
  useEffect(() => { setLogoFailed(false); }, [companyLogo]);
  useEffect(() => {
    function closeOnOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
      }
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    setSearchOpen(false);
    navigate(query ? `/employer/jobs?search=${encodeURIComponent(query)}` : "/employer/jobs");
  };

  const handleSignOut = () => {
    // Client-side sign-out only. Revoke refresh tokens server-side if supported.
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("access");
      storage.removeItem("refresh");
      storage.removeItem("user");
    }
    setProfileOpen(false);
    navigate("/signin", { replace: true });
  };

  return (
    <header ref={rootRef} className="sticky top-0 z-30 border-b border-[#E9EAF5] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
        {/* Page context */}
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuClick} aria-label="Open navigation"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-[#18124A] transition hover:bg-[#F4F3FF] lg:hidden">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="mb-0.5 hidden items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-400 sm:flex">
              <span>Employer workspace</span><ChevronRight size={12} /><span className="truncate text-[#5145E5]">{pageTitle}</span>
            </div>
            <h1 className="truncate text-lg font-extrabold tracking-tight text-[#18124A] sm:text-xl">{pageTitle}</h1>
            <p className="hidden truncate text-xs text-slate-500 xl:block">{pageSubtitle}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your jobs..." aria-label="Search jobs"
              className="h-10 w-40 rounded-xl border border-[#E8E8F3] bg-[#F8F9FF] pl-10 pr-3 text-sm text-[#18124A] outline-none transition placeholder:text-slate-400 focus:border-[#5145E5] focus:bg-white focus:ring-4 focus:ring-[#5145E5]/10 xl:w-60" />
          </form>

          <button type="button" aria-label="Search jobs" onClick={() => setSearchOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#E8E8F3] text-[#18124A] transition hover:bg-[#F4F3FF] md:hidden">
            <Search size={19} />
          </button>

          <Link to="/employer/jobs/new"
            className="hidden h-10 items-center gap-2 rounded-xl bg-[#5145E5] px-4 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition hover:bg-[#4034CD] sm:inline-flex">
            <Plus size={17} /> Post a Job
          </Link>

          <div className="relative">
            <button type="button" aria-label="Notifications" aria-expanded={notificationsOpen}
              onClick={() => { setNotificationsOpen((v) => !v); setProfileOpen(false); }}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition ${notificationsOpen ? "border-[#5145E5]/30 bg-[#F4F3FF] text-[#5145E5]" : "border-[#E8E8F3] text-[#18124A] hover:bg-[#F4F3FF]"}`}>
              <Bell size={19} />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-[calc(100%+14px)] z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E8E8F3] bg-white shadow-2xl shadow-[#18124A]/10">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div><h2 className="text-sm font-extrabold text-[#18124A]">Notifications</h2><p className="mt-0.5 text-xs text-slate-400">Hiring updates in one place</p></div>
                  <button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={17} /></button>
                </div>
                <div className="px-6 py-9 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F1EFFF] text-[#5145E5]"><Bell size={24} /></div>
                  <p className="mt-4 text-sm font-bold text-[#18124A]">You're all caught up</p>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">Application and hiring notifications will appear here once connected.</p>
                </div>
                <Link to="/employer/applicants" onClick={() => setNotificationsOpen(false)} className="flex items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-xs font-bold text-[#5145E5] hover:bg-[#F8F9FF]">View applicants <ArrowRight size={15} /></Link>
              </div>
            )}
          </div>

          <div className="mx-0.5 hidden h-8 w-px bg-[#E8E8F3] sm:block" />

          <div className="relative">
            <button type="button" aria-label="Company menu" aria-expanded={profileOpen}
              onClick={() => { setProfileOpen((v) => !v); setNotificationsOpen(false); }}
              className={`flex h-11 items-center gap-2 rounded-xl p-1 transition sm:gap-3 sm:pr-2 ${profileOpen ? "bg-[#F4F3FF]" : "hover:bg-[#F8F9FF]"}`}>
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#5145E5] to-[#18124A] text-sm font-extrabold text-white">
                {companyLogo && !logoFailed ? (
                  <img src={companyLogo} alt={`${companyName} logo`} className="h-full w-full object-cover" onError={() => setLogoFailed(true)} />
                ) : companyInitial ? companyInitial : loadingCompany ? <LoaderCircle size={18} className="animate-spin" /> : <Building2 size={20} />}
              </div>
              <div className="hidden max-w-36 min-w-0 text-left lg:block">
                <p className="truncate text-sm font-bold text-[#18124A]">{companyName}</p>
                <p className="truncate text-[11px] text-slate-400">{displayName}</p>
              </div>
              <ChevronDown size={16} className={`hidden text-slate-400 transition-transform lg:block ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+14px)] z-50 w-[min(290px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E8E8F3] bg-white p-2 shadow-2xl shadow-[#18124A]/10">
                <div className="rounded-xl bg-[#F8F9FF] px-4 py-3">
                  <p className="truncate text-sm font-extrabold text-[#18124A]">{companyName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{user?.email || displayName}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#14E0C8]/15 px-2 py-1 text-[10px] font-bold text-[#087F78]"><Check size={11} /> Employer workspace</span>
                </div>
                <div className="my-2 space-y-0.5">
                  <Link to="/employer/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#F4F3FF] hover:text-[#5145E5]"><LayoutDashboard size={17} /> Dashboard</Link>
                  <Link to="/employer/company-profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#F4F3FF] hover:text-[#5145E5]"><Building2 size={17} /> Company profile</Link>
                  <Link to="/employer/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-[#F4F3FF] hover:text-[#5145E5]"><Settings size={17} /> Settings</Link>
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut size={17} /> Sign out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} className="border-t border-[#E8E8F3] bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2 rounded-xl border border-[#E8E8F3] bg-[#F8F9FF] px-3 focus-within:border-[#5145E5]">
            <Search size={18} className="text-slate-400" />
            <input ref={searchInputRef} type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your jobs..." aria-label="Search your jobs" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
            <button type="submit" aria-label="Submit search" className="text-[#5145E5]"><ArrowRight size={18} /></button>
            <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} className="text-slate-400"><X size={18} /></button>
          </div>
        </form>
      )}
    </header>
  );
}