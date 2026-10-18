import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
} from "lucide-react";

const links = [
  {
    label: "Overview",
    path: "/company/dashboard",
    icon: LayoutDashboard,
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
    label: "Company Profile",
    path: "/company/company-profile",
    icon: Building2,
  },
  {
    label: "Settings",
    path: "/company/settings",
    icon: Settings,
  },
];

export default function CompanySidebar({ mobileOpen, onClose }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    setSigningOut(true);

    ["access", "refresh", "user"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    window.location.href = "/signin";
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <Link
            to="/company/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A3D] text-white">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#071A3D]">
                Quanta<span className="text-[#1699A4]">hire</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Employer portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {links.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/company/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#071A3D] text-white shadow-md shadow-slate-900/10"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#071A3D]"
                  }`
                }
              >
                <Icon size={19} />
                <span className="flex-1">{label}</span>

                {label === "Applicants" && (
                  <span className="rounded-full bg-[#1699A4] px-2 py-0.5 text-[10px] font-bold text-white">
                    New
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Job posting promotion */}
        <div className="px-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#071A3D] to-[#123C67] p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={19} className="text-teal-300" />
            </div>

            <h3 className="text-sm font-bold">Build your dream team</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-300">
              Publish your next vacancy and connect with global talent.
            </p>

            <Link
              to="/company/jobs/new"
              onClick={onClose}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#1699A4] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#147C91]"
            >
              <Plus size={15} />
              Post a job
            </Link>
          </div>
        </div>

        {/* Sign out */}
        <div className="p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>

          <p className="mt-2 text-center text-[10px] text-slate-400">
            © {new Date().getFullYear()} Quantahire
          </p>
        </div>
      </aside>
    </>
  );
}