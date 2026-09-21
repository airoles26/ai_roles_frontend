import { useState } from "react";

import {
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

import logo from "../assets/logo.png";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    {
      label: "Remote Jobs",
      href: "/jobs?remote=true",
    },
    {
      label: "Career Resources",
      href: "/resources",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">

      {/* NAVBAR */}
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:h-28 sm:px-6 lg:h-32 lg:px-8">

        {/* LOGO */}
        <a
          href="/"
          className="flex h-full items-center"
        >
          <img
            src={logo}
            alt="AI Roles Online"
            className="h-20 w-auto object-contain sm:h-24 lg:h-28"
          />
        </a>


        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-3 text-sm font-semibold text-slate-600 transition duration-200 hover:text-[#1699A4]"
            >
              {link.label}
            </a>
          ))}
        </nav>


        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">

          <a
            href="/login"
            className="px-4 py-3 text-sm font-bold text-[#071A3D] transition hover:text-[#1699A4]"
          >
            Sign in
          </a>

          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1699A4] px-5 py-3 text-sm font-bold text-white transition duration-200 hover:bg-[#147C91]"
          >
            Get job alerts

            <ArrowRight size={16} />
          </a>
        </div>


        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D]/5 text-[#071A3D] transition hover:bg-[#1699A4]/10 hover:text-[#1699A4] lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>


      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-6 shadow-lg lg:hidden">

          <div className="mx-auto flex max-w-7xl flex-col gap-1">

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 font-semibold text-slate-700 transition hover:bg-[#1699A4]/5 hover:text-[#1699A4]"
              >
                {link.label}
              </a>
            ))}


            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-[#071A3D] transition hover:border-[#1699A4]"
              >
                Sign in
              </a>

              <a
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#1699A4] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#147C91]"
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