
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Building2,
  Settings,
  LogOut,
  Plus,
  X,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

const workspaceLinks = [
  {
    label: "Overview",
    path: "/company/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Manage Jobs",
    path: "/company/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applicants",
    path: "/company/applicants",
    icon: Users,
  },
  {
    label: "Analytics",
    path: "/company/analytics",
    icon: BarChart3,
  },
];

const managementLinks = [
  {
    label: "Company Profile",
    path: "/company/company-profile",
    icon: Building2,
  },
  {
    label: "Plans",
    path: "/plans",
    icon: CreditCard,
  },
  {
    label: "Subscription",
    path: "/subscription",
    icon: CreditCard,
  },
  {
    label: "Settings",
    path: "/company/settings",
    icon: Settings,
  },
];

function getStoredUser() {
  try {
    const raw =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!raw) return null;

    const data = JSON.parse(raw);
    return data.user || data;
  } catch {
    return null;
  }
}

function SidebarLink({ item, onClose }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClose}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl
        px-3 py-3 text-[13px] font-semibold
        transition-all duration-200 ${
          isActive
            ? "bg-[#5145E5] text-white shadow-md shadow-indigo-500/20"
            : "text-slate-500 hover:bg-[#5145E5]/[0.06] hover:text-[#5145E5]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-[#5145E5]/10 group-hover:text-[#5145E5]"
              }`}
          >
            <Icon size={17} strokeWidth={2} />
          </div>

          <span className="min-w-0 flex-1 truncate">
            {item.label}
          </span>

          {isActive && (
            <ChevronRight
              size={15}
              className="text-white/80"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function CompanySidebar({
  mobileOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [signingOut, setSigningOut] = useState(false);
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    setUser(getStoredUser());
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, onClose]);

  const handleSignOut = () => {
    if (signingOut) return;

    setSigningOut(true);

    ["access", "refresh", "user"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    navigate("/signin", { replace: true });
  };

  const displayName =
    user?.full_name ||
    user?.username ||
    "Employer";

  const companyName =
    user?.company?.name ||
    user?.company_name ||
    "Employer Workspace";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#18124A]/50 backdrop-blur-[3px] lg:hidden"
        />
      )}

      <aside
        aria-label="Employer navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px]
          flex-col border-r border-slate-200/80 bg-white
          shadow-2xl shadow-slate-900/10
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-none ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
      >
        {/* Brand */}
        <div className="flex h-[80px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <Link
            to="/company/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#5145E5] shadow-lg shadow-indigo-500/20">
              <BriefcaseBusiness
                size={22}
                className="text-white"
                strokeWidth={2}
              />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#14E0C8]" />
            </div>

            <div className="min-w-0">
              <h1 className="text-[21px] font-extrabold tracking-[-0.06em] text-[#18124A]">
                Quanta
                <span className="text-[#5145E5]">
                  hire
                </span>
                <span className="text-[#14E0C8]">
                  .
                </span>
              </h1>

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Employer Workspace
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          {/* Workspace heading */}
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              Main
            </span>
          </div>

          <div className="space-y-1">
            {workspaceLinks.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                onClose={onClose}
              />
            ))}
          </div>

          {/* Management heading */}
          <div className="mb-3 mt-8 px-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Organization
            </p>
          </div>

          <div className="space-y-1">
            {managementLinks.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                onClose={onClose}
              />
            ))}
          </div>

          {/* Quick action */}
          <div className="mt-8 rounded-2xl border border-[#5145E5]/10 bg-[#F8F9FF] p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5145E5]/10 text-[#5145E5]">
                <Sparkles size={18} />
              </div>

              <span className="text-xs font-bold text-[#18124A]">
                Quick Action
              </span>
            </div>

            <h3 className="mt-3 text-sm font-extrabold text-[#18124A]">
              Find your next great hire
            </h3>

            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Publish a vacancy and start receiving applications from talented candidates.
            </p>

            <Link
              to="/company/jobs/new"
              onClick={onClose}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-3 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/15 transition hover:bg-[#4338CA]"
            >
              <Plus size={16} strokeWidth={2.5} />
              Post a Job
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </nav>

        {/* Bottom account section */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <Link
            to="/company/company-profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-[#5145E5]/20 hover:bg-[#F8F9FF]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#18124A] text-xs font-bold text-white">
              {initials || <Building2 size={18} />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#18124A]">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {companyName}
              </p>
            </div>

            <ChevronRight
              size={16}
              className="shrink-0 text-slate-400"
            />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <LogOut size={18} />
            )}

            <span className="flex-1 text-left">
              {signingOut
                ? "Signing out..."
                : "Sign out"}
            </span>

            <ArrowUpRight size={15} />
          </button>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 px-1 pt-3">
            <p className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} Quantahire
            </p>

            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <ShieldCheck
                size={12}
                className="text-[#5145E5]"
              />
              Employer Portal
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
