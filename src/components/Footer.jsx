
import { Link } from "react-router-dom";
import { Mail, ArrowUpRight, MapPin } from "lucide-react";
import {
  FaLinkedinIn,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";

import quantahireLogo from "../assets/logo.png";

const SUPPORT_EMAIL = "support@quantahire.tech";

// Replace the placeholder URLs with your official social profiles.
const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    url: "https://www.linkedin.com/in/quantahire-tech-811032447/",
  },
  {
    name: "X (Twitter)",
    icon: FaXTwitter,
    url: "https://x.com/Quantahire",
  },
  {
    name: "Facebook",
    icon: FaFacebookF,
    url: "https://www.facebook.com/quantahire",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/quantahire",
  },
  {
    name: "TikTok",
    icon: FaTiktok,
    url: "https://www.tiktok.com/@quantahiretech",
  },
];

const COLUMNS = [
  {
    title: "Candidates",
    links: [
      { label: "Find jobs", to: "/jobs" },
      { label: "Quantum Talent Copilot", to: "/copilot" },
      { label: "AI resume tailor", to: "/copilot" },
      { label: "Salary calculators", to: "/salaries" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Post a job ($99)", to: "/jobs/new" },
      {
        label: "Enterprise quantum sourcing",
        to: "/enterprise",
      },
      { label: "Recruiter login", to: "/signin" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Quantahire", to: "/about" },
      { label: "IBM Qiskit integration", to: "/#how-it-works" },
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#10162F] text-slate-300">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#5145E5]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#14E0C8]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-14 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              to="/"
              aria-label="Quantahire home"
              className="inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
            >
              <img
                src={quantahireLogo}
                alt="Quantahire"
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              The quantum-powered job board. Match scoring,
              quantum-optimised shortlists and an AI Copilot
              that applies for you.
            </p>

            {/* Support email */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-white">
                Need help? Contact support
              </h3>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:border-[#14E0C8]/40 hover:bg-white/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#14E0C8]/10 text-[#14E0C8]">
                  <Mail size={18} />
                </span>

                <span className="text-sm font-medium text-slate-200 group-hover:text-[#14E0C8]">
                  {SUPPORT_EMAIL}
                </span>

                <ArrowUpRight
                  size={16}
                  className="text-slate-500 transition group-hover:text-[#14E0C8]"
                />
              </a>
            </div>

            {/* Social media */}
            <div className="mt-7">
              <h3 className="mb-4 text-sm font-bold text-white">
                Follow Quantahire
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Quantahire on ${social.name}`}
                      title={social.name}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-[#14E0C8]/40 hover:bg-[#14E0C8]/10 hover:text-[#14E0C8]"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer navigation */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="relative mb-5 text-sm font-bold text-white">
                {col.title}

                <span className="absolute -bottom-2 left-0 h-0.5 w-8 rounded-full bg-[#14E0C8]" />
              </h2>

              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1.5 text-sm leading-6 text-slate-400 transition-colors hover:text-[#14E0C8]"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-xs leading-6 text-slate-500">
            © {year} Quantahire (quantahire.tech).
            All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/privacy"
              className="text-xs text-slate-400 transition hover:text-[#14E0C8]"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-slate-400 transition hover:text-[#14E0C8]"
            >
              Terms of Service
            </Link>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-xs text-slate-400 transition hover:text-[#14E0C8]"
            >
              Support
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-6 lg:px-8">
          <p className="text-xs leading-6 text-slate-500/80">
            IBM and Qiskit are trademarks of IBM Corp.
            Quantahire is not affiliated with or endorsed by IBM.
          </p>
        </div>
      </div>
    </footer>
  );
}
