import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Search,
  MapPin,
  Sparkles,
  BrainCircuit,
  Bot,
  ScanEye,
  Database,
  ShieldCheck,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Zap,
  CheckCircle2,
  Code2,
  ChartNoAxesCombined,
  GraduationCap,
  Truck,
  HeartPulse,
  Landmark,
  Cpu,
  BellRing,
  Atom,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import api from "../api/api";

const BRAND = {
  purple: "#5145E5",
  blue: "#4385F5",
  teal: "#109589",
  darkTeal: "#087F78",
  navy: "#10162F",
  background: "#F8FAFC",
};

const fallbackCategories = [
  {
    name: "Software & Technology",
    slug: "software-technology",
    description: "Software engineering, web, mobile and cloud roles.",
    icon: Code2,
  },
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Machine learning, generative AI and AI research.",
    icon: BrainCircuit,
  },
  {
    name: "Finance & Banking",
    slug: "finance-banking",
    description: "Fintech, accounting, investment and banking careers.",
    icon: Landmark,
  },
  {
    name: "Engineering",
    slug: "engineering",
    description: "Engineering, infrastructure and technical careers.",
    icon: Cpu,
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    description: "Healthcare, medical research and health technology.",
    icon: HeartPulse,
  },
  {
    name: "Logistics & Operations",
    slug: "logistics-operations",
    description: "Supply chain, logistics and operations management.",
    icon: Truck,
  },
];

const categoryIcons = [
  { keywords: ["software", "developer", "technology", "programming", "web"], icon: Code2 },
  { keywords: ["machine", "artificial intelligence", "ai", "ml"], icon: BrainCircuit },
  { keywords: ["finance", "bank", "account", "investment"], icon: Landmark },
  { keywords: ["engineer", "engineering"], icon: Cpu },
  { keywords: ["health", "medical", "clinical"], icon: HeartPulse },
  { keywords: ["logistic", "supply chain", "operation"], icon: Truck },
  { keywords: ["data", "analytics", "research"], icon: ChartNoAxesCombined },
  { keywords: ["design", "creative", "media"], icon: Sparkles },
  { keywords: ["education", "teaching", "training"], icon: GraduationCap },
  { keywords: ["security", "safety"], icon: ShieldCheck },
  { keywords: ["cloud", "infrastructure", "devops"], icon: Database },
  { keywords: ["vision", "imaging"], icon: ScanEye },
  { keywords: ["generative", "llm", "language model"], icon: Bot },
];

export default function Home() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadHome = async () => {
      try {
        setLoading(true);

        const [jobsResponse, categoriesResponse] = await Promise.all([
          api.get("/jobs/?ordering=-posted_at"),
          api.get("/categories/"),
        ]);

        if (cancelled) return;

        const jobsData = jobsResponse.data;
        const allJobs = Array.isArray(jobsData)
          ? jobsData
          : jobsData?.results || [];

        setJobs(allJobs.slice(0, 6));
        setJobCount(
          typeof jobsData?.count === "number"
            ? jobsData.count
            : allJobs.length
        );

        const categoriesData = categoriesResponse.data;
        const allCategories = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData?.results || [];

        setCategories(allCategories);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed loading Quantahire homepage:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 6).map((category) => ({
          ...category,
          icon: category.icon || getCategoryIcon(category.name),
        }))
      : fallbackCategories;

  function getCategoryIcon(name = "") {
    const normalized = name.toLowerCase();

    return (
      categoryIcons.find(({ keywords }) =>
        keywords.some((keyword) => normalized.includes(keyword))
      )?.icon || BriefcaseBusiness
    );
  }

  const stats = [
    {
      icon: BriefcaseBusiness,
      value: jobCount > 0 ? jobCount.toLocaleString() : "Explore",
      label: "Job opportunities",
    },
    {
      icon: Building2,
      value: "Global",
      label: "Hiring companies",
    },
    {
      icon: Globe2,
      value: "Worldwide",
      label: "Career opportunities",
    },
    {
      icon: Zap,
      value: "Discover",
      label: "Your next move",
    },
  ];

  const benefits = [
    {
      title: "Opportunities across industries",
      description:
        "Explore careers in technology, finance, engineering, healthcare, business and more.",
    },
    {
      title: "Search that fits your goals",
      description:
        "Find roles using job titles, skills, companies and locations.",
    },
    {
      title: "One place to explore",
      description:
        "Discover opportunities gathered from supported company hiring sources.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#10162F]">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden border-b border-slate-100 bg-white">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 8% 20%, rgba(81,69,229,0.10), transparent 30%), radial-gradient(circle at 90% 18%, rgba(16,149,137,0.12), transparent 32%), radial-gradient(circle at 55% 100%, rgba(67,133,245,0.06), transparent 40%)",
            }}
          />

          <div className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[460px] w-[850px] -translate-x-1/2 rounded-full bg-[#5145E5]/5 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5145E5]/15 bg-white/80 px-4 py-2 text-xs font-bold text-[#5145E5] shadow-sm sm:text-sm">
                <Atom size={16} className="text-[#109589]" />
                A smarter way to discover your next opportunity
              </div>

              <h1 className="text-4xl font-black leading-[1.12] tracking-[-0.045em] text-[#10162F] sm:text-5xl md:text-6xl lg:text-7xl">
                Your next career move
                <br className="hidden sm:block" />{" "}
                starts with{" "}
                <span className="bg-gradient-to-r from-[#5145E5] via-[#4385F5] to-[#109589] bg-clip-text text-transparent">
                  Quantahire.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Explore job opportunities across technology, finance,
                engineering, business and more. Find roles that match your
                skills, experience and ambitions.
              </p>

              {/* SEARCH */}
              <form
                onSubmit={handleSearch}
                className="mx-auto mt-9 max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-[#5145E5]/[0.08] transition focus-within:border-[#5145E5]/40"
              >
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
                    <Search
                      size={20}
                      className="shrink-0 text-[#5145E5]"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Job title, skill or company"
                      aria-label="Job title, skill or company"
                      className="w-full min-w-0 bg-transparent text-sm font-medium text-[#10162F] outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </label>

                  <div className="hidden h-9 w-px bg-slate-200 lg:block" />

                  <label className="flex min-w-0 flex-1 items-center gap-3 border-t border-slate-100 px-4 py-3 lg:border-t-0">
                    <MapPin
                      size={20}
                      className="shrink-0 text-[#109589]"
                    />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="City, country or remote"
                      aria-label="Job location"
                      className="w-full min-w-0 bg-transparent text-sm font-medium text-[#10162F] outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5145E5] to-[#109589] px-7 py-4 text-sm font-extrabold text-white shadow-md shadow-[#5145E5]/15 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5145E5] focus:ring-offset-2"
                  >
                    Search jobs
                    <ArrowRight size={17} />
                  </button>
                </div>
              </form>

              {/* POPULAR SEARCHES */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 sm:text-sm">
                <span className="text-slate-400">Popular searches:</span>

                {[
                  { label: "Software Engineer", query: "software engineer" },
                  { label: "Data Analyst", query: "data analyst" },
                  { label: "Finance", query: "finance" },
                  { label: "Remote", query: "remote", remote: true },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={
                      item.remote
                        ? "/jobs?remote=true"
                        : `/jobs?search=${encodeURIComponent(item.query)}`
                    }
                    className="transition-colors hover:text-[#5145E5]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* STATS */}
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#5145E5]/25 hover:shadow-lg hover:shadow-[#5145E5]/[0.06] sm:p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5145E5]/10 to-[#109589]/10 text-[#5145E5] transition-colors group-hover:text-[#109589]">
                      <Icon size={19} />
                    </div>

                    <div className="text-xl font-black text-[#10162F] sm:text-2xl">
                      {stat.value}
                    </div>

                    <div className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LATEST JOBS */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#109589] sm:text-sm">
                  Explore new possibilities
                </p>

                <h2 className="text-3xl font-black tracking-tight text-[#10162F] sm:text-4xl">
                  Latest opportunities
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                  Discover recently listed roles from companies hiring across
                  different industries.
                </p>
              </div>

              <Link
                to="/jobs"
                className="group inline-flex items-center gap-2 self-start text-sm font-extrabold text-[#5145E5] transition hover:text-[#109589] sm:self-auto"
              >
                Browse all jobs
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-48 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                  />
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id || job.slug} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC] px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5145E5]/10 text-[#5145E5]">
                  <BriefcaseBusiness size={27} />
                </div>

                <h3 className="font-bold text-[#10162F]">
                  No job listings available yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  New opportunities will appear here as jobs become available.
                  Try browsing all jobs or check back soon.
                </p>

                <Link
                  to="/jobs"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4338CA]"
                >
                  Explore jobs
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#109589] sm:text-sm">
                Find your field
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#10162F] sm:text-4xl">
                Explore careers by category
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                From technology and finance to engineering and operations,
                discover opportunities across a range of professional fields.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayCategories.map((category) => {
                const Icon = category.icon || getCategoryIcon(category.name);

                return (
                  <Link
                    key={category.slug || category.id || category.name}
                    to={`/jobs?category=${encodeURIComponent(category.slug || category.name)}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#5145E5]/30 hover:shadow-xl hover:shadow-[#5145E5]/[0.06] sm:p-6"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#5145E5]/10 to-[#109589]/10 text-[#5145E5] transition-all duration-300 group-hover:from-[#5145E5] group-hover:to-[#109589] group-hover:text-white">
                      <Icon size={23} />
                    </div>

                    <h3 className="text-lg font-extrabold text-[#10162F] transition-colors group-hover:text-[#5145E5]">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {category.description ||
                        `Explore ${category.name} job opportunities.`}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#109589]">
                      Explore jobs
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHY QUANTAHIRE */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5145E5]/10 bg-[#5145E5]/5 px-3 py-1.5 text-xs font-extrabold text-[#5145E5]">
                <Atom size={14} className="text-[#109589]" />
                Meet Quantahire
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-tight text-[#10162F] sm:text-4xl lg:text-5xl">
                Less searching.
                <br />
                <span className="bg-gradient-to-r from-[#5145E5] to-[#109589] bg-clip-text text-transparent">
                  More possibilities.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Quantahire brings job discovery into one place, helping you
                explore roles, compare opportunities and focus on positions
                aligned with your career goals.
              </p>

              <div className="mt-8 space-y-5">
                {benefits.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-[#109589]"
                    />

                    <div>
                      <h3 className="font-extrabold text-[#10162F]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/jobs"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#5145E5]/15 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
              >
                Start exploring
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#5145E5]/15 via-[#4385F5]/5 to-[#109589]/15 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#10162F] p-5 shadow-2xl sm:p-8">
                <div className="mb-7 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#63D1C3]">
                      Your career journey
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
                      Opportunities to explore
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5145E5]/30 to-[#109589]/30 text-[#63D1C3]">
                    <Atom size={23} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: "Software Engineer",
                      company: "Technology",
                      icon: Code2,
                      color: "#8B83FF",
                    },
                    {
                      title: "Financial Analyst",
                      company: "Finance & Banking",
                      icon: ChartNoAxesCombined,
                      color: "#63D1C3",
                    },
                    {
                      title: "Data & AI Specialist",
                      company: "Data & Intelligence",
                      icon: BrainCircuit,
                      color: "#70A7FF",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.08]"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          <Icon size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-white">
                            {item.title}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            {item.company}
                          </div>
                        </div>

                        <ArrowRight
                          size={17}
                          className="shrink-0 text-slate-500"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#109589]/20 bg-[#109589]/10 p-4">
                  <Sparkles
                    size={19}
                    className="mt-0.5 shrink-0 text-[#63D1C3]"
                  />

                  <div>
                    <div className="text-sm font-bold text-white">
                      A world of opportunities
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      Explore roles across industries and discover where your
                      skills could take you next.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#10162F] px-6 py-14 text-center text-white sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#5145E5]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-[#109589]/25 blur-3xl" />
            <div className="pointer-events-none absolute right-[15%] top-8 h-20 w-20 rounded-full bg-[#4385F5]/15 blur-2xl" />

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5145E5]/30 to-[#109589]/30 text-[#63D1C3]">
                <BellRing size={26} />
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Ready for your next opportunity?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Start exploring job opportunities, discover new career paths
                and take the next step toward your professional goals.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5145E5] to-[#109589] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#5145E5]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Join Quantahire
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-extrabold text-white transition hover:border-[#63D1C3]/50 hover:bg-white/10"
                >
                  Browse opportunities
                </Link>
              </div>

              <p className="mt-5 text-xs text-slate-400">
                Talent. Technology. Opportunity.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
