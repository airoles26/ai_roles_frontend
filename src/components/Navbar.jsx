import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const colors = {
    purple: "#5145E5",
    blue: "#4385F5",
    teal: "#109589",
    darkTeal: "#087F78",
    navy: "#172554",
  };

  const links = [
    { label: "Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Remote Jobs", href: "/jobs?remote=true" },
    { label: "Career Resources", href: "/resources" },
  ];

  const closeMobileMenu = () => setOpen(false);

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "bg-[#5145E5]/10 text-[#5145E5]"
        : "text-slate-700 hover:bg-[#109589]/10 hover:text-[#109589]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.02] backdrop-blur-xl">
      {/* Main Navbar */}
      <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-4 sm:h-[96px] sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center"
          aria-label="Quantahire home"
        >
          <img
            src={logo}
            alt="Quantahire"
            className="h-[64px] w-auto max-w-[230px] object-contain sm:h-[76px] sm:max-w-[300px] lg:h-[82px] lg:max-w-[360px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) =>
            link.href.includes("?") ? (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-[#109589]/10 hover:text-[#109589]"
              >
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.label}
                to={link.href}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5145E5] transition-colors duration-200 hover:bg-[#5145E5]/5"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5145E5] via-[#4385F5] to-[#109589] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5145E5]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#5145E5]/25"
          >
            Get job alerts
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5145E5] transition-colors hover:bg-[#5145E5]/10 lg:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <nav className="space-y-1">
              {links.map((link) =>
                link.href.includes("?") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={closeMobileMenu}
                    className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-[#109589]/10 hover:text-[#109589]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 font-medium transition-colors ${
                        isActive
                          ? "bg-[#5145E5]/10 text-[#5145E5]"
                          : "text-slate-700 hover:bg-[#109589]/10 hover:text-[#109589]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>

            {/* Mobile Actions */}
            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center rounded-xl border border-[#5145E5]/30 px-4 py-3 font-semibold text-[#5145E5] transition-colors hover:bg-[#5145E5]/5"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5145E5] to-[#109589] px-4 py-3 font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Get job alerts
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}