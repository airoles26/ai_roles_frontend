import {
  Sparkles,
  Mail,
  Code2,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-950">
                <Sparkles size={18} />
              </div>

              <span className="text-lg font-black">
                AI Roles
              </span>
            </div>

            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Discover opportunities in artificial intelligence,
              machine learning, AI research and the technologies
              shaping the future.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 font-bold">
              Explore
            </h4>

            <div className="space-y-3 text-sm text-slate-400">
              <a
                className="block transition hover:text-white"
                href="/jobs"
              >
                Browse Jobs
              </a>

              <a
                className="block transition hover:text-white"
                href="/companies"
              >
                Companies
              </a>

              <a
                className="block transition hover:text-white"
                href="/jobs?remote=true"
              >
                Remote Jobs
              </a>

              <a
                className="block transition hover:text-white"
                href="/jobs?category=ai-research"
              >
                AI Research Jobs
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-bold">
              Resources
            </h4>

            <div className="space-y-3 text-sm text-slate-400">
              <a
                className="block transition hover:text-white"
                href="/resources"
              >
                Career Resources
              </a>

              <a
                className="block transition hover:text-white"
                href="/alerts"
              >
                Job Alerts
              </a>

              <a
                className="block transition hover:text-white"
                href="/about"
              >
                About AI Roles
              </a>

              <a
                className="block transition hover:text-white"
                href="/contact"
              >
                Contact
              </a>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 className="mb-4 font-bold">
              Find your next AI role
            </h4>

            <p className="mb-5 text-sm leading-6 text-slate-400">
              Create an account and get notified when new AI
              opportunities matching your interests are added.
            </p>

            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              Get Job Alerts

              <ArrowUpRight size={16} />
            </a>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <Mail size={14} />
              Personalized AI job alerts
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} AI Roles. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <a
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </a>

            <a
              href="/about"
              className="flex items-center gap-1 transition hover:text-white"
            >
              About
              <Code2 size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}