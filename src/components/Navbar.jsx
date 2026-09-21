import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

import logo from "../assets/logo.png";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Jobs",
      href: "/jobs",
    },
    {
      label: "Companies",
      href: "/companies",
    },
    {
      label: "Remote Jobs",
      href: "/jobs?remote=true",
    },
    {
      label: "Career Resources",
      href: "/resources",
    },
  ];


  const closeMobileMenu = () => {
    setOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">

      {/* MAIN NAVBAR */}
      <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-4 sm:h-[96px] sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center"
        >
          <img
            src={logo}
            alt="AI Roles Online"
            className="h-[68px] w-auto object-contain sm:h-[76px] lg:h-[82px]"
          />
        </Link>


        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-1 lg:flex">

          {links.map((link) => {

            /*
             * Remote Jobs contains a query parameter.
             * NavLink works best with pathname routes,
             * so a regular Link is used for it.
             */
            if (link.href.includes("?")) {
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#1699A4]/5 hover:text-[#1699A4]"
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#1699A4]/10 text-[#147C91]"
                      : "text-slate-700 hover:bg-[#1699A4]/5 hover:text-[#1699A4]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>


        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">

          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#071A3D] transition hover:bg-[#1699A4]/5 hover:text-[#1699A4]"
          >
            Sign in
          </Link>


          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-[#1699A4] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#147C91]"
          >
            Get job alerts

            <ArrowRight size={16} />
          </Link>
        </div>


        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#071A3D] transition hover:bg-[#1699A4]/10 hover:text-[#1699A4] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>


      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            {/* MOBILE LINKS */}
            <nav className="space-y-1">

              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-[#1699A4]/5 hover:text-[#1699A4]"
                >
                  {link.label}
                </Link>
              ))}

            </nav>


            {/* MOBILE ACTIONS */}
            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center rounded-xl border border-[#1699A4] px-4 py-3 font-semibold text-[#147C91] transition hover:bg-[#1699A4]/5"
              >
                Sign in
              </Link>


              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1699A4] px-4 py-3 font-semibold text-white transition hover:bg-[#147C91]"
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