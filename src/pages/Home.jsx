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
  CheckCircle2,
  ArrowUpRight,
  MessageCircleQuestion,
  HelpCircle,
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
    <figure className="relative rounded-[28px] bg-[#10162F] p-5 text-white shadow-[0_30px_80px_-30px_rgba(81,69,229,0.55)] sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400">Example match run</p>
          <p className={`${DISPLAY_FONT} mt-1 text-lg font-bold`}>Your best 3 roles out of 5</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors duration-500 ${
            done ? "bg-[#14E0C8]/15 text-[#14E0C8]" : "bg-white/10 text-slate-300"
          }`}
          aria-live="polite"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-[#14E0C8]" : "animate-pulse bg-slate-300"}`} />
          {done ? "Optimised" : "Running QAOA…"}
        </span>
      </div>

      <ul className="mt-6 space-y-2.5">
        {EXAMPLE_ROLES.map((role) => {
          const selected = done && role.pick;
          const skipped = done && !role.pick;
          return (
            <li
              key={role.title}
              className={`rounded-2xl border px-4 py-3 transition-all duration-500 ${
                selected
                  ? "border-[#14E0C8]/50 bg-[#14E0C8]/[0.08]"
                  : skipped
                  ? "border-white/5 bg-white/[0.02] opacity-55"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{role.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {skipped ? role.reason : role.meta}
                  </p>
                </div>
                <div className="w-24 shrink-0">
                  <div className="flex justify-end text-sm font-bold tabular-nums">{role.score}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5145E5] to-[#14E0C8]"
                      style={{ width: `${role.score}%` }}
                    />
                  </div>
                </div>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {selected && <Check size={18} className="text-[#14E0C8]" aria-label="Selected" />}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <figcaption className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-400">
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


  const heroImages = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=85",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85",
  "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1920&q=85",
];

const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);





  return (
    <div className="min-h-screen bg-white text-[#10162F]">
      <Navbar />

      <main>
        {/* ---------------- HERO ---------------- */}
        

<section className="relative isolate w-full min-w-0 overflow-hidden bg-[#07132C] text-white">

  {/* Background image slider */}
  <div
    aria-hidden="true"
     className="pointer-events-none absolute inset-0 -z-10 bg-[#061329]/40 sm:bg-gradient-to-r sm:from-[#061329]/65 sm:via-[#071A35]/40 sm:to-[#061329]/20"
  >
    {heroImages.map((image, index) => (
      <div
        key={image}
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out ${
          currentSlide === index ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url("${image}")`,
          transform:
            currentSlide === index ? "scale(1.04)" : "scale(1)",
          transition:
            "opacity 1500ms ease-in-out, transform 6000ms ease-out",
        }}
      />
    ))}
  </div>

  {/* Dark responsive overlay */}
  <div
  aria-hidden="true"
  className="
    pointer-events-none absolute inset-0 -z-10
    bg-[#061329]/40
    lg:bg-gradient-to-r
    lg:from-[#061329]/45
    lg:via-[#071A35]/20
    lg:to-transparent
  "
/>

  {/* Decorative gradients */}
  {/* Subtle decorative gradients */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10"
  style={{
    background:
      "radial-gradient(60rem 30rem at 85% -10%, rgba(20,224,200,0.05), transparent 60%), radial-gradient(50rem 30rem at -10% 10%, rgba(81,69,229,0.05), transparent 60%)",
  }}
/>

  {/* Main hero container */}
  <div className="relative mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-center gap-8 px-4 pb-20 pt-10 min-[375px]:px-5 sm:gap-10 sm:px-6 sm:pb-24 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-20 xl:gap-14">

    {/* Left content */}
    <div className="relative z-10 min-w-0 w-full">

      {/* Badge */}
      <div className="flex">
        <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold leading-4 text-white backdrop-blur-md min-[375px]:text-xs sm:px-3.5 sm:text-sm">
          <Atom
            size={15}
            className="shrink-0 text-[#14E0C8]"
          />
          <span>
            Quantahire 1.0, built with IBM Qiskit
          </span>
        </p>
      </div>

      {/* Heading */}
      <h1
        className={`${DISPLAY_FONT} mt-5 max-w-3xl break-words text-[clamp(2rem,8vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:mt-6 lg:leading-[1.04]`}
      >
        Quantahire{" "}
        <span className="bg-gradient-to-r from-[#14E0C8] to-[#A5A0FF] bg-clip-text text-transparent">
          is the world's first quantum powered job board
        </span>
      </h1>

      {/* Description */}
      <p className="mt-5 max-w-xl text-sm leading-6 text-slate-200 sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
        Quantahire operates as the world's first quantum powered job board, seamlessly uniting an extensive programmatic job repository with an autonomous AI Copilot suite ('Quantum Talent') and an enterprise IBM Qiskit QAOA matching engine
      </p>

      {/* CTA buttons */}
      <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">

        <button
          type="button"
          onClick={() => checkout("trial")}
          disabled={busyPlan === "trial"}
          className="flex min-h-12 w-full min-w-0 items-center justify-center rounded-xl bg-[#5145E5] px-4 py-3 text-center text-xs font-extrabold leading-5 text-white shadow-lg shadow-[#5145E5]/25 transition hover:bg-[#4338CA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14E0C8] disabled:opacity-60 min-[375px]:text-sm sm:w-auto sm:px-5 lg:px-6"
        >
          {busyPlan === "trial"
            ? "Opening checkout…"
            : "Activate auto-apply, $9.99 for 7 days"}
        </button>

        <Link
          to="/jobs"
          className="flex min-h-12 w-full min-w-0 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-center text-xs font-extrabold leading-5 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14E0C8] min-[375px]:text-sm sm:w-auto sm:px-5 lg:px-6"
        >
          {jobsLabel
            ? `Explore ${jobsLabel} live jobs`
            : "Explore live jobs"}
        </Link>

      </div>

      {/* Subscription info */}
      <p className="mt-3 text-xs leading-5 text-slate-300">
        Then $39.99/month from day 8. Cancel anytime.
      </p>

      {checkoutError && (
        <p
          role="alert"
          className="mt-3 break-words text-sm font-semibold text-red-300"
        >
          {checkoutError}
        </p>
      )}

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="mt-8 w-full min-w-0 rounded-2xl border border-white/20 bg-white p-2 text-slate-900 shadow-2xl shadow-black/20 focus-within:border-[#5145E5]/50 sm:mt-10"
      >
        <div className="flex w-full min-w-0 flex-col lg:flex-row lg:items-center">

          {/* Job keyword */}
          <label className="flex min-h-12 w-full min-w-0 items-center gap-3 px-3 py-3 sm:px-4 lg:min-w-0 lg:flex-[1.3]">
            <Search
              size={19}
              className="shrink-0 text-[#5145E5]"
            />

            <span className="sr-only">
              Job title, tech stack or keyword
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, tech stack or keyword"
              className="w-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
            />
          </label>

          {/* Divider */}
          <div className="mx-3 h-px bg-slate-200 lg:mx-0 lg:h-8 lg:w-px lg:shrink-0" />

          {/* Location */}
          <label className="flex min-h-12 w-full min-w-0 items-center gap-3 px-3 py-3 sm:px-4 lg:min-w-0 lg:flex-1">
            <MapPin
              size={19}
              className="shrink-0 text-[#109589]"
            />

            <span className="sr-only">
              Location
            </span>

            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Remote, Nairobi, London"
              className="w-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
            />
          </label>

          {/* Search button */}
          <button
            type="submit"
            className="mt-1 flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#5145E5] to-[#109589] px-5 py-3.5 text-sm font-extrabold text-white transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2 lg:mt-0 lg:w-auto"
          >
            Search jobs
          </button>

        </div>
      </form>

      {/* Quick tags */}
      <div className="mt-4 flex w-full flex-wrap gap-2">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.label}
            type="button"
            onClick={() => goToJobs(tag.params)}
            className="max-w-full rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold leading-5 text-white backdrop-blur-sm transition hover:border-[#14E0C8] hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14E0C8] sm:px-3.5 sm:text-sm"
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Features */}
      <ul className="mt-7 flex flex-col gap-3 text-xs font-semibold leading-5 text-slate-200 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 sm:text-sm">

        <li className="flex items-start gap-2">
          <Check
            size={16}
            className="mt-0.5 shrink-0 text-[#14E0C8]"
          />
          <span>
            Applies via Workday, Greenhouse and Lever
          </span>
        </li>

        <li className="flex items-start gap-2">
          <Check
            size={16}
            className="mt-0.5 shrink-0 text-[#14E0C8]"
          />
          <span>
            Listings re-checked daily
          </span>
        </li>

        {jobsLabel && (
          <li className="flex items-start gap-2">
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-[#14E0C8]"
            />
            <span>{jobsLabel} active roles</span>
          </li>
        )}

      </ul>

    </div>

    {/* Right preview */}
    <div className="relative z-10 w-full min-w-0 max-w-full overflow-hidden lg:overflow-visible">
      <div className="mx-auto w-full min-w-0 max-w-xl lg:max-w-none">
        <MatchRunPreview />
      </div>
    </div>

  </div>

  {/* Slider navigation dots */}
  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2 sm:bottom-6 sm:gap-3">
    {heroImages.map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setCurrentSlide(index)}
        aria-label={`Go to slide ${index + 1}`}
        aria-current={
          currentSlide === index ? "true" : undefined
        }
        className="flex h-8 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14E0C8]"
      >
        <span
          className={`block h-2.5 rounded-full transition-all duration-300 ${
            currentSlide === index
              ? "w-8 bg-[#14E0C8]"
              : "w-2.5 bg-white/50"
          }`}
        />
      </button>
    ))}
  </div>

</section>


        {/* ---------------- PILLARS ---------------- */}
        
<section className="relative isolate overflow-hidden bg-[#F8FAFF] py-20 text-[#18124A] sm:py-24 lg:py-28">
  {/* Background decorations */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-10 h-[400px] w-[400px] rounded-full bg-[#5145E5]/[0.06] blur-[110px]" />
    <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#14E0C8]/[0.08] blur-[110px]" />
    <div className="absolute inset-0 bg-[radial-gradient(#5145E5_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.035]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section header */}
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#5145E5]/15 bg-[#5145E5]/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#5145E5]">
        <span className="h-2 w-2 rounded-full bg-[#5145E5]" />
        Why Quantahire
      </span>

      <h2
        className={`${DISPLAY_FONT} mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl`}
      >
        Better matches.
        <span className="block text-[#5145E5]">
          Less busywork.
        </span>
        <span className="block">
          Real opportunities.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Your job search deserves more than endless scrolling and
        repetitive applications. Discover how Quantahire combines
        intelligent technology with a simpler, more effective
        hiring experience.
      </p>
    </div>

    {/* Feature cards */}
    <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-7">
      {PILLARS.map(({ icon: Icon, title, badge, body }, i) => (
        <article
          key={title}
          className="group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_35px_rgba(20,20,60,0.035)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5145E5]/30 hover:shadow-[0_20px_50px_rgba(81,69,229,0.10)] sm:p-8 lg:p-9"
        >
          {/* Gradient hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5145E5]/[0.035] via-transparent to-[#14E0C8]/[0.055] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Decorative background number */}
          <span
            aria-hidden="true"
            className={`${DISPLAY_FONT} pointer-events-none absolute -right-2 -top-5 select-none text-[110px] font-black leading-none text-[#5145E5]/[0.035] sm:text-[140px]`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Icon and badge */}
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5145E5]/10 bg-gradient-to-br from-[#5145E5]/10 to-[#14E0C8]/10 text-[#5145E5] transition-all duration-300 group-hover:scale-105 group-hover:border-[#5145E5]/25 group-hover:from-[#5145E5] group-hover:to-[#7569EE] group-hover:text-white">
                <Icon size={29} strokeWidth={1.8} />
              </div>

              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-[3px] border-white bg-[#14E0C8]" />
            </div>

            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#14E0C8]/20 bg-[#14E0C8]/10 px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-[#087F78] sm:text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0AAE9D]" />
              {badge}
            </span>
          </div>

          {/* Card content */}
          <div className="relative mt-8 flex-1">
            <h3
              className={`${DISPLAY_FONT} text-xl font-extrabold leading-snug tracking-tight text-[#18124A] transition-colors duration-300 group-hover:text-[#5145E5] sm:text-2xl`}
            >
              {title}
            </h3>

            <p className="mt-4 max-w-[58ch] text-sm leading-7 text-slate-600 sm:text-[15px]">
              {body}
            </p>
          </div>

          {/* Card footer */}
          <div className="relative mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Quantahire advantage
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[#5145E5] transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#5145E5] group-hover:bg-[#5145E5] group-hover:text-white">
              <ArrowUpRight size={17} />
            </div>
          </div>
        </article>
      ))}
    </div>

    {/* Bottom reassurance */}
    <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:mt-16 sm:flex-row">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14E0C8]/10 text-[#087F78]">
        <CheckCircle2 size={20} />
      </div>

      <p className="max-w-xl text-sm leading-6 text-slate-600">
        Built to help you spend less time searching and more time
        preparing for the opportunities that matter.
      </p>
    </div>
  </div>
</section>


        {/* ---------------- HOW IT WORKS ---------------- */}
        
<section
  id="how-it-works"
  className="relative isolate scroll-mt-20 overflow-hidden bg-[#080D23] py-20 text-white sm:py-24 lg:py-28"
>
  {/* Background effects */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#5145E5]/20 blur-[120px]" />
    <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#14E0C8]/10 blur-[120px]" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#10162F]/60 via-transparent to-[#080D23]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/25 bg-[#14E0C8]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#14E0C8]">
        <span className="h-2 w-2 rounded-full bg-[#14E0C8]" />
        Simple. Smart. Powerful.
      </span>

      <h2
        className={`${DISPLAY_FONT} mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl`}
      >
        Your next opportunity,
        <span className="mt-2 block bg-gradient-to-r from-[#14E0C8] via-[#7FFFEF] to-[#A89FFF] bg-clip-text text-transparent">
          just four steps away.
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
        From CV to offer, Quantahire simplifies your job search with
        intelligent matching and automated applications. You're always
        in control.
      </p>
    </div>

    {/* Steps */}
    <div className="relative mt-14 sm:mt-16 lg:mt-20">

      {/* Connecting line on desktop */}
      <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-12 hidden h-px bg-gradient-to-r from-transparent via-[#14E0C8]/40 to-transparent lg:block" />

      <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="group relative min-w-0">

            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#14E0C8]/40 hover:bg-white/[0.075] hover:shadow-[#14E0C8]/10 sm:p-7">

              {/* Hover gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5145E5]/15 via-transparent to-[#14E0C8]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Top */}
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#14E0C8]/20 bg-gradient-to-br from-[#5145E5]/30 to-[#14E0C8]/10 text-[#14E0C8] transition-all duration-300 group-hover:scale-110 group-hover:border-[#14E0C8]/50">
                  <Icon size={29} strokeWidth={1.8} />
                </div>

                <span
                  className={`${DISPLAY_FONT} text-5xl font-black tracking-tight text-white/10 transition-colors duration-300 group-hover:text-[#14E0C8]/25`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="relative mt-8 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#14E0C8]">
                  Step {i + 1}
                </span>

                <h3 className="mt-3 text-lg font-extrabold leading-snug tracking-tight text-white sm:text-xl">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {body}
                </p>
              </div>

              {/* Bottom decoration */}
              <div className="relative mt-8 h-1 w-12 rounded-full bg-gradient-to-r from-[#5145E5] to-[#14E0C8] transition-all duration-300 group-hover:w-full" />
            </div>
          </li>
        ))}
      </ol>
    </div>

    {/* Bottom message */}
    <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:mt-16 sm:flex-row">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 text-[#14E0C8]">
        <CheckCircle2 size={17} />
      </span>

      <p className="text-sm font-medium text-slate-300">
        Your career journey, powered by intelligence.
        <span className="ml-1 font-bold text-white">
          You stay in control.
        </span>
      </p>
    </div>
  </div>
</section>


        {/* ---------------- PRICING ---------------- */}
        <section id="pricing" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className={`${DISPLAY_FONT} text-3xl font-extrabold tracking-tight sm:text-5xl`}>
                Simple pricing, paid your way
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Card, M-Pesa or mobile money through Paystack. Prices in US dollars.
              </p>
            </div>

            {checkoutError && (
              <p role="alert" className="mt-6 text-sm font-semibold text-red-600">{checkoutError}</p>
            )}

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex flex-col rounded-3xl p-6 ${
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
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className={`${DISPLAY_FONT} text-4xl font-extrabold`}>{plan.price}</span>
                    <span className={`text-sm ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>{plan.period}</span>
                  </p>
                  <p className={`mt-3 text-sm leading-6 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>
                    {plan.audience}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm">
                        <Check size={17} className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#14E0C8]" : "text-[#109589]"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {plan.action === "checkout" ? (
                    <button
                      type="button"
                      onClick={() => checkout(plan.id)}
                      disabled={busyPlan === plan.id}
                      className={`mt-8 rounded-xl px-4 py-3 text-sm font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2 disabled:opacity-60 ${
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
                      className="mt-8 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-extrabold transition hover:border-[#5145E5]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5]"
                    >
                      {plan.cta}
                    </Link>
                  )}
                  {plan.note && (
                    <p className={`mt-3 text-xs ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>{plan.note}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        
<section
  id="faqs"
  className="relative isolate scroll-mt-20 overflow-hidden border-t border-slate-100 bg-white py-20 text-[#18124A] sm:py-24 lg:py-28"
>
  {/* Background decorations */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#5145E5]/[0.06] blur-[110px]" />
    <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#14E0C8]/[0.08] blur-[110px]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

      {/* Left: FAQ introduction */}
      <div className="lg:sticky lg:top-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#5145E5]/15 bg-[#5145E5]/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#5145E5]">
          <span className="h-2 w-2 rounded-full bg-[#5145E5]" />
          Help Center
        </span>

        <h2
          className={`${DISPLAY_FONT} mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl`}
        >
          Questions?
          <span className="mt-2 block text-[#5145E5]">
            We've got
          </span>
          <span className="block">
            answers.
          </span>
        </h2>

        <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
          Everything you need to know about Quantahire,
          intelligent job matching, automated applications,
          and getting started with your next career move.
        </p>

        {/* Support card */}
        <div className="mt-9 max-w-md overflow-hidden rounded-2xl border border-[#5145E5]/10 bg-gradient-to-br from-[#F3F1FF] via-white to-[#EFFFFC] p-5 sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#5145E5] shadow-sm">
            <MessageCircleQuestion size={23} strokeWidth={1.8} />
          </div>

          <h3 className="mt-5 text-lg font-extrabold">
            Still have questions?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Can't find the answer you're looking for?
            We're happy to help you learn more about Quantahire.
          </p>

          <a
            href="mailto:support@quantahire.tech"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4034C7] hover:shadow-indigo-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5145E5] focus-visible:ring-offset-2"
          >
            Contact support
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* Right: FAQ accordion */}
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5145E5]/10 text-[#5145E5]">
              <HelpCircle size={19} />
            </span>
            <h3 className="text-sm font-extrabold sm:text-base">
              Frequently asked questions
            </h3>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
            {FAQS.length} Questions
          </span>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, index) => (
            <details
              key={item.q}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(20,20,60,0.025)] transition-all duration-300 open:border-[#5145E5]/25 open:bg-[#FAFAFF] open:shadow-[0_12px_35px_rgba(81,69,229,0.07)]"
            >
              {/* Active left accent */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#5145E5] to-[#14E0C8] opacity-0 transition-opacity duration-300 group-open:opacity-100" />

              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#5145E5] sm:px-6 sm:py-6 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="mt-0.5 shrink-0 text-xs font-extrabold text-[#5145E5]/60 sm:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm font-bold leading-6 text-[#18124A] transition-colors duration-300 group-open:text-[#5145E5] sm:text-base">
                    {item.q}
                  </span>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-open:rotate-180 group-open:border-[#5145E5]/20 group-open:bg-[#5145E5] group-open:text-white">
                  <ChevronDown size={18} strokeWidth={2.2} />
                </span>
              </summary>

              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
                <div className="min-h-0 overflow-hidden">
                  <div className="mx-5 border-t border-slate-200/80 pb-6 pt-4 sm:mx-6">
                    <p className="max-w-[65ch] text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Bottom reassurance */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#14E0C8]/15 bg-[#14E0C8]/[0.06] p-4 sm:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087F78]">
            <ShieldCheck size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-[#18124A]">
              Built with transparency in mind
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">
              Understand how Quantahire works and make informed
              decisions about your job search.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* ---------------- FINAL CTA ---------------- */}
        <section className="px-5 py-20 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#5145E5] via-[#3B4FD8] to-[#087F78] px-6 py-16 text-center text-white sm:px-12">
            <h2 className={`${DISPLAY_FONT} mx-auto max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl`}>
              Ready to land your best-matched role?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-white/85">
              Quantum-optimised matching and a Copilot that applies for you, from $9.99 for your first week.
            </p>
            <button
              type="button"
              onClick={() => checkout("trial")}
              disabled={busyPlan === "trial"}
              className="mt-8 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-[#10162F] transition hover:bg-[#E9FFFB] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5145E5] disabled:opacity-60 sm:text-base"
            >
              {busyPlan === "trial" ? "Opening checkout…" : "Start 7-day access, $9.99"}
            </button>
            <p className="mt-3 text-xs text-white/70">Then $39.99/month from day 8. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}