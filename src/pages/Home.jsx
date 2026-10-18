import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Atom,
  BadgeCheck,
  Bot,
  Check,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

import Navbar, { DISPLAY_FONT } from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/api";
import { startCheckout } from "../components/checkout/Checkout";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const QUICK_TAGS = [
  { label: "Remote only", params: { remote: "true" } },
  { label: "Quantum & AI", params: { search: "AI" } },
  { label: "$100k+", params: { salary_min: "100000" } },
  { label: "Auto-apply ready", params: { auto_apply: "true" } },
];

const STACK = ["IBM Qiskit", "OpenAI GPT-4o", "Playwright", "Paystack", "Vercel"];

const PILLARS = [
  {
    icon: Atom,
    title: "IBM Qiskit QAOA engine",
    badge: "Built with IBM Qiskit",
    body:
      "Keyword search ranks jobs one at a time. We score every role against your profile, then frame picking the best set of roles as a QUBO optimisation problem and solve it with QAOA, a quantum algorithm built with IBM Qiskit. Every quantum result is checked against a classical solver.",
  },
  {
    icon: Bot,
    title: "Quantum Talent AI Copilot",
    badge: "1-click auto-apply",
    body:
      "Stop filling out the same ATS forms. The Copilot tailors your resume for each role and submits applications in the background while you get on with your day.",
  },
  {
    icon: ShieldCheck,
    title: "Ghost-job protection",
    badge: "Re-checked daily",
    body:
      "Every listing is re-checked against the employer's own ATS each day. When a company closes a role, we remove it from Quantahire.",
  },
  {
    icon: CreditCard,
    title: "Pay the way you already pay",
    badge: "Secured by Paystack",
    body:
      "Pay by card, M-Pesa or mobile money through Paystack's secure checkout. No US bank card needed.",
  },
];

const STEPS = [
  {
    icon: Upload,
    title: "Upload your profile",
    body: "We read your CV and turn your experience, skills and goals into a profile we can match against every open role.",
  },
  {
    icon: Atom,
    title: "Run the QAOA match",
    body: "We shortlist your strongest roles, then QAOA picks the best combination for your salary, location and skills, not just the top keyword hits.",
  },
  {
    icon: Bot,
    title: "Let the Copilot apply",
    body: "The Copilot tailors your resume to each job's ATS and submits through Workday, Greenhouse and Lever.",
  },
  {
    icon: LayoutDashboard,
    title: "Track every application",
    body: "Follow each role on your board from Applied to Under review, Interview and Offer.",
  },
];

const PLANS = [
  {
    id: "trial",
    name: "Quantum Copilot 7-day trial",
    price: "$9.99",
    period: "for 7 days",
    audience: "For active job seekers who want auto-apply now.",
    features: ["100 auto-apply credits", "AI ATS resume tailor", "QAOA compatibility scoring", "Application board sync"],
    cta: "Start 7-day trial ($9.99)",
    note: "Renews at $39.99/month on day 8 unless you cancel.",
    action: "checkout",
  },
  {
    id: "pro",
    name: "Quantum Copilot Monthly Pro",
    price: "$39.99",
    period: "per month",
    audience: "For career changers who want applications going out continuously.",
    features: ["Unlimited auto-apply credits", "Unlimited resume customisations", "Priority quantum match runs", "Screenshot proof of every application"],
    cta: "Subscribe to Pro ($39.99/mo)",
    note: "Cancel anytime from your account.",
    action: "checkout",
    featured: true,
  },
  {
    id: "employer_post",
    name: "Direct employer job post",
    price: "$99",
    period: "per post, 30 days",
    audience: "For companies hiring tech and AI talent.",
    features: ["30-day verified listing", "Automated listing verification", "AI match recommendations", "Direct ATS referral pipeline"],
    cta: "Post a job ($99)",
    action: "link",
    to: "/employers/post-job",
  },
  {
    id: "enterprise",
    name: "Enterprise quantum sourcing",
    price: "$1,500",
    period: "per month",
    audience: "For corporate talent acquisition teams.",
    features: ["Batch QAOA applicant shortlisting", "Custom matching criteria", "Dedicated account manager", "Unlimited applicant exports"],
    cta: "Contact enterprise sales",
    action: "link",
    to: "/enterprise#contact",
  },
];

const FAQS = [
  {
    q: "How does quantum matching work compared to classical job boards?",
    a: "Most job boards rank roles by keyword overlap, one at a time. Quantahire first scores each role against your profile with AI, then frames choosing the best set of roles as an optimisation problem and solves it with QAOA, a quantum algorithm built with IBM Qiskit. Today's quantum hardware handles small problems, so we run it on your shortlisted roles, and we check every result against a classical solver so you always get the best answer either method finds.",
  },
  {
    q: "How do you keep ghost jobs off Quantahire?",
    a: "We re-check every listing against the employer's own ATS each day and remove roles that have closed. If you ever find one that slipped through, report it from the job page and we'll remove it.",
  },
  {
    q: "How does the AI Copilot auto-apply to jobs?",
    a: "The Copilot opens the employer's application page, tailors your resume to the job's ATS requirements, fills in the form and submits it for you. You'll see each application on your board, with a screenshot as proof.",
  },
  {
    q: "What happens after the 7-day trial?",
    a: "Your plan renews at $39.99/month on day 8. Cancel anytime before then from your account settings and you won't be charged again.",
  },
];

/* Example data for the hero illustration (not live data). */
const EXAMPLE_ROLES = [
  { title: "Backend Engineer, Django", meta: "Fintech, Nairobi, hybrid", score: 92, pick: true },
  { title: "Platform Engineer", meta: "Payments, remote", score: 88, pick: true },
  { title: "Python Developer", meta: "Payments, remote", score: 86, pick: false, reason: "Too similar to Platform Engineer" },
  { title: "Data Engineer", meta: "Logistics, Kigali", score: 79, pick: true },
  { title: "Full-stack Developer", meta: "E-commerce, Lagos", score: 64, pick: false, reason: "Below your salary range" },
];

/* ------------------------------------------------------------------ */
/* Hero illustration: one example match run, animated once on load      */
/* ------------------------------------------------------------------ */

function MatchRunPreview() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      return undefined;
    }
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <figure className="relative rounded-[24px] sm:rounded-[28px] bg-[#10162F] p-4 text-white shadow-[0_20px_50px_-20px_rgba(81,69,229,0.5)] sm:p-7 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400">Example match run</p>
          <p className={`${DISPLAY_FONT} mt-1 text-base sm:text-lg font-bold`}>Your best 3 roles out of 5</p>
        </div>
        <span
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-500 ${
            done ? "bg-[#14E0C8]/15 text-[#14E0C8]" : "bg-white/10 text-slate-300"
          }`}
          aria-live="polite"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-[#14E0C8]" : "animate-pulse bg-slate-300"}`} />
          {done ? "Optimised" : "Running QAOA…"}
        </span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {EXAMPLE_ROLES.map((role) => {
          const selected = done && role.pick;
          const skipped = done && !role.pick;
          return (
            <li
              key={role.title}
              className={`rounded-xl sm:rounded-2xl border px-3.5 py-3 sm:px-4 transition-all duration-500 ${
                selected
                  ? "border-[#14E0C8]/50 bg-[#14E0C8]/[0.08]"
                  : skipped
                  ? "border-white/5 bg-white/[0.02] opacity-55"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs sm:text-sm font-bold">{role.title}</p>
                  <p className="mt-0.5 truncate text-[11px] sm:text-xs text-slate-400">
                    {skipped ? role.reason : role.meta}
                  </p>
                </div>
                <div className="w-16 sm:w-24 shrink-0">
                  <div className="flex justify-end text-xs sm:text-sm font-bold tabular-nums">{role.score}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5145E5] to-[#14E0C8]"
                      style={{ width: `${role.score}%` }}
                    />
                  </div>
                </div>
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center">
                  {selected && <Check size={16} className="text-[#14E0C8] sm:w-[18px]" aria-label="Selected" />}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <figcaption className="mt-4 sm:mt-5 flex items-start gap-2 text-[11px] sm:text-xs leading-4 sm:leading-5 text-slate-400">
        <BadgeCheck size={16} className="mt-0.5 shrink-0 text-[#14E0C8]" />
        QAOA skips near-duplicate roles and roles outside your constraints, then we confirm the
        pick against a classical solver.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [jobCount, setJobCount] = useState(null);
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState("");
  const [busyPlan, setBusyPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Live job count for the hero proof bar and secondary CTA.
  useEffect(() => {
    let cancelled = false;
    api
      .get("/jobs/", { params: { page_size: 1 } })
      .then(({ data }) => {
        if (cancelled) return;
        const count = typeof data?.count === "number" ? data.count : Array.isArray(data) ? data.length : null;
        setJobCount(count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Make "/#pricing" and "/#how-it-works" nav links scroll to their section.
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);

  const jobsLabel = jobCount ? `${jobCount.toLocaleString()}` : null;

  const goToJobs = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    navigate(`/jobs${qs ? `?${qs}` : ""}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (place.trim()) params.location = place.trim();
    goToJobs(params);
  };

  const checkout = async (plan) => {
    setCheckoutError("");
    setBusyPlan(plan);
    try {
      await startCheckout(plan, navigate);
    } catch {
      setCheckoutError("We couldn't open the payment page. Check your connection and try again.");
    } finally {
      setBusyPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#10162F] overflow-x-hidden">
      <Navbar />

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60rem 30rem at 85% -10%, rgba(20,224,200,0.12), transparent 60%), radial-gradient(50rem 30rem at -10% 10%, rgba(81,69,229,0.10), transparent 60%)",
            }}
          />

          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#5145E5]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#5145E5] sm:text-sm">
                <Atom size={14} className="text-[#109589] shrink-0" />
                <span className="truncate">Quantahire 2.0, built with IBM Qiskit</span>
              </p>

              <h1 className={`${DISPLAY_FONT} mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[4.4rtrem]`}>
                Quantahire is the world's first quantum powered job board
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
                Quantahire operates as the world's first quantum powered job board, seamlessly uniting an extensive programmatic job repository with an autonomous AI Copilot suite ('Quantum Talent') and an enterprise IBM Qiskit QAOA matching engine.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => checkout("trial")}
                  disabled={busyPlan === "trial"}
                  className="w-full sm:w-auto rounded-xl bg-[#5145E5] px-6 py-3.5 text-center text-sm font-extrabold text-white shadow-lg shadow-[#5145E5]/25 transition hover:bg-[#4338CA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2 disabled:opacity-60 sm:text-base"
                >
                  {busyPlan === "trial" ? "Opening checkout…" : "Activate auto-apply, $9.99 for 7 days"}
                </button>
                <Link
                  to="/jobs"
                  className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-extrabold text-[#10162F] transition hover:border-[#5145E5]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] sm:text-base"
                >
                  {jobsLabel ? `Explore ${jobsLabel} live jobs` : "Explore live jobs"}
                </Link>
              </div>
              <p className="mt-2.5 text-xs text-slate-500">
                Then $39.99/month from day 8. Cancel anytime.
              </p>
              {checkoutError && (
                <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{checkoutError}</p>
              )}

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/[0.04] focus-within:border-[#5145E5]/50"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                  <label className="flex min-w-0 flex-[1.3] items-center gap-3 px-3 py-2 md:px-4 md:py-3">
                    <Search size={18} className="shrink-0 text-[#5145E5]" />
                    <span className="sr-only">Job title, tech stack or keyword</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Job title, tech stack or keyword (e.g. Python)"
                      className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </label>
                  <div className="hidden h-8 w-px bg-slate-200 md:block" />
                  <label className="flex min-w-0 flex-1 items-center gap-3 border-t border-slate-100 px-3 py-2 md:border-t-0 md:px-4 md:py-3">
                    <MapPin size={18} className="shrink-0 text-[#109589]" />
                    <span className="sr-only">Location</span>
                    <input
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="Remote, Nairobi, London"
                      className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full md:w-auto rounded-xl bg-gradient-to-r from-[#5145E5] to-[#109589] px-6 py-3.5 text-sm font-extrabold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2"
                  >
                    Search jobs
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => goToJobs(tag.params)}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#5145E5]/40 hover:text-[#5145E5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] sm:text-sm"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              <ul className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-slate-600">
                <li className="flex items-center gap-2"><Check size={16} className="text-[#109589] shrink-0" />Applies via Workday, Greenhouse and Lever</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#109589] shrink-0" />Listings re-checked daily</li>
                {jobsLabel && (
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#109589] shrink-0" />{jobsLabel} active roles</li>
                )}
              </ul>
            </div>

            <div className="mt-4 lg:mt-0">
              <MatchRunPreview />
            </div>
          </div>
        </section>

        {/* ---------------- STACK STRIP ---------------- */}
        <section aria-label="Technology" className="border-y border-slate-200 bg-[#F8FAFC]">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:px-6 md:flex-row md:justify-between lg:px-8">
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Built on a modern, secure stack</p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-x-8">
              {STACK.map((name) => (
                <li key={name} className={`${DISPLAY_FONT} text-sm sm:text-base font-bold text-slate-400`}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- PILLARS ---------------- */}
        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className={`${DISPLAY_FONT} max-w-2xl text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight`}>
              Better matches, fewer forms, no dead listings
            </h2>

            <div className="mt-10 sm:mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:gap-x-16">
              {PILLARS.map(({ icon: Icon, title, badge, body }) => (
                <article key={title} className="border-t-2 border-[#10162F] pt-5 sm:pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <Icon size={24} className="text-[#5145E5] sm:w-[26px]" />
                    <span className="rounded-full bg-[#109589]/10 px-3 py-1 text-[11px] sm:text-xs font-bold text-[#087F78]">
                      {badge}
                    </span>
                  </div>
                  <h3 className={`${DISPLAY_FONT} mt-4 sm:mt-5 text-xl sm:text-2xl font-bold`}>{title}</h3>
                  <p className="mt-2.5 sm:mt-3 max-w-[60ch] text-sm sm:text-base leading-6 sm:leading-7 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section id="how-it-works" className="scroll-mt-20 bg-[#10162F] py-16 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className={`${DISPLAY_FONT} max-w-2xl text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight`}>
              How Quantahire works
            </h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-slate-300">
              From CV to offer in four steps. You stay in control of which roles the Copilot applies to.
            </p>

            <ol className="mt-10 sm:mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="relative">
                  <div className="flex items-center gap-3">
                    <span className={`${DISPLAY_FONT} text-4xl sm:text-5xl font-extrabold text-[#14E0C8]`}>{i + 1}</span>
                    <Icon size={20} className="text-slate-400 sm:w-[22px]" />
                  </div>
                  <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold">{title}</h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-300">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- PRICING ---------------- */}
        <section id="pricing" className="scroll-mt-20 py-14 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className={`${DISPLAY_FONT} text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight`}>
                Simple pricing, paid your way
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-slate-600">
                Card, M-Pesa or mobile money through Paystack. Prices in US dollars.
              </p>
            </div>

            {checkoutError && (
              <p role="alert" className="mt-6 text-sm font-semibold text-red-600">{checkoutError}</p>
            )}

            <div className="mt-10 sm:mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex flex-col rounded-3xl p-5 sm:p-6 ${
                    plan.featured
                      ? "bg-[#10162F] text-white ring-2 ring-[#14E0C8]/60"
                      : "border border-slate-200 bg-white"
                  }`}
                >
                  {plan.featured && (
                    <span className="mb-4 self-start rounded-full bg-[#14E0C8]/15 px-3 py-1 text-xs font-bold text-[#14E0C8]">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-base font-bold">{plan.name}</h3>
                  <p className="mt-3 sm:mt-4 flex items-baseline gap-2">
                    <span className={`${DISPLAY_FONT} text-3xl sm:text-4xl font-extrabold`}>{plan.price}</span>
                    <span className={`text-xs sm:text-sm ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>{plan.period}</span>
                  </p>
                  <p className={`mt-2.5 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>
                    {plan.audience}
                  </p>

                  <ul className="mt-5 sm:mt-6 flex-1 space-y-2.5 sm:space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-xs sm:text-sm">
                        <Check size={16} className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#14E0C8]" : "text-[#109589]"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.action === "checkout" ? (
                    <button
                      type="button"
                      onClick={() => checkout(plan.id)}
                      disabled={busyPlan === plan.id}
                      className={`mt-6 sm:mt-8 rounded-xl px-4 py-3 text-xs sm:text-sm font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2 disabled:opacity-60 ${
                        plan.featured
                          ? "bg-[#14E0C8] text-[#10162F] hover:brightness-105"
                          : "bg-[#5145E5] text-white hover:bg-[#4338CA]"
                      }`}
                    >
                      {busyPlan === plan.id ? "Opening checkout…" : plan.cta}
                    </button>
                  ) : (
                    <Link
                      to={plan.to}
                      className="mt-6 sm:mt-8 rounded-xl border border-slate-300 px-4 py-3 text-center text-xs sm:text-sm font-extrabold transition hover:border-[#5145E5]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
                    >
                      {plan.cta}
                    </Link>
                  )}
                  {plan.note && (
                    <p className={`mt-2.5 sm:mt-3 text-[11px] sm:text-xs ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>{plan.note}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="border-t border-slate-200 bg-[#F8FAFC] py-14 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <h2 className={`${DISPLAY_FONT} text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight`}>
              Questions, answered
            </h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((item) => (
                <details key={item.q} className="group py-4 sm:py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 sm:gap-6 text-left text-sm sm:text-lg font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown size={18} className="mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-180 sm:w-5" />
                  </summary>
                  <p className="mt-2.5 sm:mt-3 max-w-[68ch] text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-[#5145E5] via-[#3B4FD8] to-[#087F78] px-5 py-12 text-center text-white sm:px-12 sm:py-16">
            <h2 className={`${DISPLAY_FONT} mx-auto max-w-3xl text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight`}>
              Ready to land your best-matched role?
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-white/85">
              Quantum-optimised matching and a Copilot that applies for you, from $9.99 for your first week.
            </p>
            <button
              type="button"
              onClick={() => checkout("trial")}
              disabled={busyPlan === "trial"}
              className="mt-6 sm:mt-8 w-full sm:w-auto rounded-xl bg-white px-7 py-3.5 text-sm sm:text-base font-extrabold text-[#10162F] transition hover:bg-[#E9FFFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5145E5] disabled:opacity-60"
            >
              {busyPlan === "trial" ? "Opening checkout…" : "Start 7-day access, $9.99"}
            </button>
            <p className="mt-2.5 text-xs text-white/70">Then $39.99/month from day 8. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}