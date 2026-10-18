import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  Building2,
  ArrowUpRight,
  X,
  LoaderCircle,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const pageTitles = [
  { path: "/employer/dashboard", title: "Overview" },
  { path: "/employer/jobs/new", title: "Post a Job" },
  { path: "/employer/jobs", title: "Manage Jobs" },
  { path: "/employer/applicants", title: "Applicants" },
  { path: "/employer/company-profile", title: "Company Profile" },
  { path: "/employer/settings", title: "Settings" },
  { path: "/employer/analytics", title: "Analytics" },
  { path: "/employer/subscription", title: "Subscription" },
];

function getStoredUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null")
    );
  } catch {
    return null;
  }
}

function getAccessToken() {
  return (
    localStorage.getItem("access") ||
    sessionStorage.getItem("access")
  );
}

export default function CompanyTopbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  const page = [...pageTitles]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );

  const pageTitle = page?.title || "Employer Workspace";

  const companyName =
    company?.name ||
    user?.company?.name ||
    user?.company_name ||
    "Your Company";

  const displayName =
    user?.full_name || user?.username || "Employer";

  const initial = companyName !== "Your Company"
    ? companyName.charAt(0).toUpperCase()
    : null;

  const loadCompany = useCallback(async () => {
    const token = getAccessToken();

    if (!token) return;

    setLoadingCompany(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/employer/dashboard/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      if (data.company) {
        setCompany(data.company);
      }
    } catch (error) {
      console.error("Unable to load company details:", error);
    } finally {
      setLoadingCompany(false);
    }
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, [location.pathname]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  useEffect(() => {
    setNotificationsOpen(false);
  }, [location.pathname]);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/employer/jobs");
      return;
    }

    navigate(
      `/employer/jobs?search=${encodeURIComponent(query)}`
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Navigation and page title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="shrink-0 rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="hidden truncate text-sm font-medium text-slate-500 sm:inline">
                Employer workspace
              </span>

              <ChevronRight
                size={14}
                className="hidden shrink-0 text-slate-400 sm:block"
              />

              <h1 className="truncate text-sm font-bold text-[#071A3D] sm:text-base">
                {pageTitle}
              </h1>
            </div>

            <p className="mt-0.5 truncate text-xs text-slate-400">
              Manage your hiring activity
            </p>
          </div>
        </div>

        {/* Right: Search, notifications and company profile */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <form
            onSubmit={handleSearch}
            className="relative hidden md:block"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs..."
              aria-label="Search your jobs"
              className="w-40 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-xs outline-none transition focus:border-[#1699A4] focus:bg-white lg:w-56"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen((open) => !open)
              }
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
            >
              <Bell size={18} />
            </button>

            {notificationsOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute right-0 top-12 z-50 w-[min(300px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-bold text-[#071A3D]">
                      Notifications
                    </h2>

                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      aria-label="Close notifications"
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="py-5 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Bell size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Notifications
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      New application and hiring updates will appear here when notifications are connected.
                    </p>
                  </div>

                  <Link
                    to="/employer/applicants"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex items-center justify-center gap-1 border-t border-slate-100 pt-3 text-sm font-bold text-[#147C91] hover:text-[#071A3D]"
                  >
                    View applicants
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="hidden h-9 w-px bg-slate-200 sm:block" />

          {/* Company profile */}
          <Link
            to="/employer/company-profile"
            aria-label={`Company profile: ${companyName}`}
            className="flex min-w-0 items-center gap-2.5 rounded-xl transition hover:bg-slate-50 sm:p-1.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#071A3D] text-sm font-bold text-white">
              {company?.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={`${companyName} logo`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : initial ? (
                initial
              ) : loadingCompany ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Building2 size={19} />
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="max-w-36 truncate text-sm font-bold text-[#071A3D]">
                {companyName}
              </p>

              <p className="max-w-36 truncate text-[11px] text-slate-400">
                {displayName}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}