import { Link } from "react-router-dom";

import { DISPLAY_FONT, QuantahireMark } from "./Navbar";

const COLUMNS = [
  {
    title: "Candidates",
    links: [
      { label: "Find jobs", to: "/jobs" },
      { label: "Quantum Talent Copilot", to: "/copilot" },
      { label: "AI resume tailor", to: "/copilot#resume-tailor" },
      { label: "Salary calculators", to: "/salaries" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Post a job ($99)", to: "/employers/post-job" },
      { label: "Enterprise quantum sourcing", to: "/enterprise" },
      { label: "Recruiter login", to: "/login?role=recruiter" },
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
  return (
    <footer className="bg-[#10162F] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2.5">
            <QuantahireMark />
            <span className={`${DISPLAY_FONT} text-xl font-bold text-white`}>Quantahire</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            The quantum-powered job board. Match scoring, quantum-optimised
            shortlists and an AI Copilot that applies for you.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-bold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-400 transition-colors hover:text-[#14E0C8]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Quantahire (quantahire.tech). All rights reserved.
          IBM and Qiskit are trademarks of IBM Corp. Quantahire is not affiliated with or endorsed by IBM.
        </p>
      </div>
    </footer>
  );
}