import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { startCheckout } from "./checkout/Checkout";
import quantahireLogo from "../assets/logo.png";

export const DISPLAY_FONT =
  "font-['Bricolage_Grotesque',ui-sans-serif,system-ui,sans-serif]";

const NAV_LINKS = [
  { label: "Find jobs", to: "/jobs" },
  { label: "Quantum Talent Copilot", to: "/copilot" },
  { label: "Enterprise sourcing", to: "/enterprise" },
  { label: "Pricing", to: "/#pricing" },
  { label: "How QAOA works", to: "/#how-it-works" },
];

/** Quantum "Q" mark: an orbit ring with a qubit dot, indigo to neon teal. */
export function QuantahireMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="qh-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5145E5" />
          <stop offset="100%" stopColor="#14E0C8" />
        </linearGradient>
      </defs>
      <circle cx="15" cy="15" r="10" fill="none" stroke="url(#qh-grad)" strokeWidth="3.2" />
      <ellipse
        cx="15" cy="15" rx="13" ry="4.6"
        fill="none" stroke="url(#qh-grad)" strokeWidth="1.2" opacity="0.55"
        transform="rotate(-35 15 15)"
      />
      <path d="M20.5 20.5 L27 27" stroke="url(#qh-grad)" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="15" cy="15" r="2.6" fill="#14E0C8" />
    </svg>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const startTrial = async () => {
    setBusy(true);
    try {
      await startCheckout("trial", navigate);
    } catch {
      navigate("/signup?plan=trial");
    } finally {
      setBusy(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] ${
      isActive ? "text-[#5145E5]" : "text-slate-600 hover:text-[#10162F]"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] w-full border-b border-slate-200/70 bg-white/95 shadow-md backdrop-blur-md">
      <nav className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Quantahire home"
          className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
        >
          <img
            src={quantahireLogo}
            alt="Quantahire"
            className="h-12 w-auto object-contain sm:h-16"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} to={link.to} className={linkClass} end>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/signin"
            className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#10162F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
          >
            Signin
          </Link>
          <button
            type="button"
            onClick={startTrial}
            disabled={busy}
            className="rounded-xl bg-[#5145E5] px-4.5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4338CA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {busy ? "Opening checkout…" : "Start 7-day trial ($9.99)"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-[#10162F] lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 pb-6 pt-3 lg:hidden shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 grid gap-2.5">
            <Link 
              to="/signin" 
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700"
            >
              Signin
            </Link>
            <button
              type="button"
              onClick={startTrial}
              disabled={busy}
              className="rounded-xl bg-[#5145E5] px-4 py-3 font-bold text-white disabled:opacity-60"
            >
              {busy ? "Opening checkout…" : "Start 7-day trial ($9.99)"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}