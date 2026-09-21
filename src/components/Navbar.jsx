import { useState } from "react";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Remote Jobs", href: "/jobs?remote=true" },
    { label: "Career Resources", href: "/resources" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center">
  <img
    src={logo}
    alt="AI Roles Online"
    className="h-14 w-auto object-contain sm:h-16"
  />
</a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/login"
            className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-950"
          >
            Sign in
          </a>

          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-600"
          >
            Get job alerts
            <ArrowRight size={16} />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-semibold text-slate-700"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
              <a
                href="/login"
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold"
              >
                Sign in
              </a>

              <a
                href="/register"
                className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}