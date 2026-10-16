import {
  Sparkles,
  Mail,
  Code2,
  ArrowUpRight,
  BriefcaseBusiness,
  Atom,
} from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Remote Jobs", href: "/jobs?remote=true" },
    { label: "AI & Technology Jobs", href: "/jobs?category=ai-research" },
  ];

  const resourceLinks = [
    { label: "Career Resources", href: "/resources" },
    { label: "Job Alerts", href: "/alerts" },
    { label: "About Quantahire", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const agencyLink = (
    <a
      href="https://gurucrafts.agency/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[#4385F5] transition-colors hover:text-[#109589]"
    >
      GuruCrafts Agency
    </a>
  );

  return (
    <footer className="relative overflow-hidden bg-[#091126] text-white">
      {/* Decorative brand accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#5145E5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-[#109589]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="mb-5 inline-flex items-center rounded-xl bg-white px-3 py-2"
              aria-label="Quantahire home"
            >
              <img
                src={logo}
                alt="Quantahire"
                className="h-12 w-auto max-w-[230px] object-contain"
              />
            </Link>

            <p className="max-w-xs text-sm leading-7 text-slate-400">
              Discover opportunities across technology, finance, engineering,
              business, and more. Find roles that match your skills and
              ambitions with Quantahire.
            </p>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              Built with technology by {agencyLink}.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-[#109589]" />
              Connecting talent with opportunity
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 font-bold text-white">
              <BriefcaseBusiness size={17} className="text-[#4385F5]" />
              Explore
            </h4>

            <div className="space-y-3.5 text-sm text-slate-400">
              {exploreLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group flex items-center gap-2 transition-colors hover:text-[#109589]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors group-hover:bg-[#109589]" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 font-bold text-white">
              <Sparkles size={17} className="text-[#109589]" />
              Resources
            </h4>

            <div className="space-y-3.5 text-sm text-slate-400">
              {resourceLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group flex items-center gap-2 transition-colors hover:text-[#4385F5]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors group-hover:bg-[#4385F5]" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#5145E5] to-[#109589] shadow-lg shadow-[#5145E5]/20">
              <Atom size={22} className="text-white" />
            </div>

            <h4 className="mb-3 text-lg font-bold text-white">
              Your next opportunity starts here.
            </h4>

            <p className="mb-5 text-sm leading-6 text-slate-400">
              Create your account to explore opportunities and stay informed
              about roles aligned with your career goals.
            </p>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5145E5] via-[#4385F5] to-[#109589] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#5145E5]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5145E5]/25"
            >
              Get Started
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <Mail size={14} className="text-[#109589]" />
              Discover opportunities that fit your goals.
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                © {currentYear}{" "}
                <span className="font-semibold text-white">Quantahire</span>.
                All rights reserved.
              </p>

              <p className="mt-2 text-xs text-slate-500">
                A product of {agencyLink}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-400">
              <Link
                to="/privacy"
                className="transition-colors hover:text-[#4385F5]"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="transition-colors hover:text-[#109589]"
              >
                Terms of Service
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-1.5 transition-colors hover:text-[#5145E5]"
              >
                About
                <Code2 size={13} />
              </Link>
            </div>
          </div>

          {/* Brand signature */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/5 pt-5 text-xs text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5145E5]" />
            <span>Talent.</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#4385F5]" />
            <span>Technology.</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#109589]" />
            <span>Opportunity.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}