import { useEffect, useState } from "react";

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
  BellRing,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Zap,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import api from "../api/api";


const BRAND = {
  navy: "#071A3D",
  teal: "#1699A4",
  tealDark: "#147C91",
  gold: "#E6A064",
  background: "#F7FAFC",
};


const fallbackCategories = [
  {
    name: "Machine Learning",
    slug: "machine-learning",
    icon: BrainCircuit,
    description:
      "ML engineering, training and production systems",
  },
  {
    name: "LLM & Generative AI",
    slug: "llm-generative-ai",
    icon: Bot,
    description:
      "LLMs, agents, inference and generative AI",
  },
  {
    name: "AI Research",
    slug: "ai-research",
    icon: Sparkles,
    description:
      "Research engineering and research science",
  },
  {
    name: "Computer Vision",
    slug: "computer-vision",
    icon: ScanEye,
    description:
      "Vision models and multimodal systems",
  },
  {
    name: "MLOps & Infrastructure",
    slug: "mlops-infrastructure",
    icon: Database,
    description:
      "AI infrastructure, MLOps and platforms",
  },
  {
    name: "AI Safety",
    slug: "ai-safety",
    icon: ShieldCheck,
    description:
      "Alignment, safety and interpretability",
  },
];


export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobCount, setJobCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");


  /*
  |--------------------------------------------------------------------------
  | LOAD HOME DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);

        const [
          jobsResponse,
          categoriesResponse,
        ] = await Promise.all([
          api.get("/jobs/?ordering=-posted_at"),
          api.get("/categories/"),
        ]);

        const jobsData = jobsResponse.data;

        if (Array.isArray(jobsData)) {
          setJobs(jobsData.slice(0, 6));
          setJobCount(jobsData.length);
        } else {
          setJobs(
            (jobsData.results || []).slice(0, 6)
          );

          setJobCount(
            jobsData.count || 0
          );
        }

        const categoriesData =
          categoriesResponse.data;

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          setCategories(
            categoriesData.results || []
          );
        }
      } catch (error) {
        console.error(
          "Failed loading homepage:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (location.trim()) {
      params.set(
        "location",
        location.trim()
      );
    }

    window.location.href =
      `/jobs?${params.toString()}`;
  };


  /*
  |--------------------------------------------------------------------------
  | CATEGORIES
  |--------------------------------------------------------------------------
  */

  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 6)
      : fallbackCategories;


  const categoryIcon = (name) => {
    const value =
      name.toLowerCase();

    if (
      value.includes("machine") ||
      value.includes("ml")
    ) {
      return BrainCircuit;
    }

    if (
      value.includes("llm") ||
      value.includes("generative")
    ) {
      return Bot;
    }

    if (value.includes("vision")) {
      return ScanEye;
    }

    if (
      value.includes("infrastructure") ||
      value.includes("mlops")
    ) {
      return Database;
    }

    if (
      value.includes("safety") ||
      value.includes("security")
    ) {
      return ShieldCheck;
    }

    return Sparkles;
  };


  return (
    <div className="min-h-screen bg-white text-[#071A3D]">
      <Navbar />

      <main>

        {/* ========================================================= */}
        {/* HERO */}
        {/* ========================================================= */}

        <section className="relative overflow-hidden border-b border-slate-100 bg-white">

          {/* Background glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 10% 20%, rgba(22,153,164,0.12), transparent 30%), radial-gradient(circle at 88% 30%, rgba(7,26,61,0.08), transparent 32%)",
            }}
          />

          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#1699A4]/5 blur-[120px]" />


          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">

            <div className="mx-auto max-w-4xl text-center">

              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1699A4]/20 bg-[#1699A4]/5 px-4 py-2 text-xs font-extrabold text-[#147C91]">

                <Sparkles
                  size={14}
                  className="text-[#E6A064]"
                />

                Opportunities building the future
              </div>


              {/* Heading */}
              <h1 className="text-4xl font-black tracking-[-0.045em] text-[#071A3D] sm:text-5xl md:text-6xl lg:text-7xl">

                Find your next role in{" "}

                <span className="text-[#1699A4]">
                  artificial intelligence.
                </span>
              </h1>


              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Discover AI, machine learning and
                research opportunities from innovative
                companies around the world — gathered
                in one place.
              </p>


              {/* SEARCH */}
              <form
                onSubmit={handleSearch}
                className="mx-auto mt-9 max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/60"
              >
                <div className="flex flex-col lg:flex-row">

                  {/* Job search */}
                  <div className="flex flex-1 items-center gap-3 px-4 py-3">

                    <Search
                      size={20}
                      className="shrink-0 text-[#1699A4]"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Job title, skill or company"
                      className="w-full bg-transparent text-sm font-medium text-[#071A3D] outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </div>


                  <div className="hidden w-px bg-slate-200 lg:block" />


                  {/* Location */}
                  <div className="flex flex-1 items-center gap-3 border-t border-slate-100 px-4 py-3 lg:border-t-0">

                    <MapPin
                      size={20}
                      className="shrink-0 text-[#1699A4]"
                    />

                    <input
                      value={location}
                      onChange={(e) =>
                        setLocation(
                          e.target.value
                        )
                      }
                      placeholder="City, country or remote"
                      className="w-full bg-transparent text-sm font-medium text-[#071A3D] outline-none placeholder:text-slate-400 sm:text-base"
                    />
                  </div>


                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1699A4] px-7 py-4 text-sm font-extrabold text-white transition duration-300 hover:bg-[#147C91]"
                  >
                    Search jobs

                    <Search size={17} />
                  </button>
                </div>
              </form>


              {/* Popular */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 sm:text-sm">

                <span>
                  Popular:
                </span>

                <a
                  href="/jobs?search=machine+learning"
                  className="transition hover:text-[#1699A4]"
                >
                  Machine Learning
                </a>

                <a
                  href="/jobs?search=llm"
                  className="transition hover:text-[#1699A4]"
                >
                  LLM
                </a>

                <a
                  href="/jobs?search=research+engineer"
                  className="transition hover:text-[#1699A4]"
                >
                  Research Engineer
                </a>

                <a
                  href="/jobs?remote=true"
                  className="transition hover:text-[#1699A4]"
                >
                  Remote
                </a>
              </div>
            </div>


            {/* STATS */}
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">

              {[
                {
                  icon: BriefcaseBusiness,
                  value: jobCount
                    ? `${jobCount}+`
                    : "Growing",
                  label: "Active AI roles",
                },
                {
                  icon: Building2,
                  value: "Top",
                  label: "AI companies",
                },
                {
                  icon: Globe2,
                  value: "Global",
                  label: "Opportunities",
                },
                {
                  icon: Zap,
                  value: "Fresh",
                  label: "Job listings",
                },
              ].map((stat) => {
                const Icon =
                  stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#1699A4]/30 hover:shadow-lg md:text-center"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1699A4]/8 text-[#1699A4] md:mx-auto">
                      <Icon size={18} />
                    </div>

                    <div className="text-xl font-black text-[#071A3D]">
                      {stat.value}
                    </div>

                    <div className="mt-1 text-xs font-semibold text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* LATEST JOBS */}
        {/* ========================================================= */}

        <section className="py-20 sm:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#1699A4]">
                  Fresh opportunities
                </p>

                <h2 className="text-3xl font-black tracking-tight text-[#071A3D] sm:text-4xl">
                  Latest AI jobs
                </h2>

                <p className="mt-3 max-w-xl text-slate-500">
                  Explore recently discovered roles
                  from companies building AI products,
                  models and infrastructure.
                </p>
              </div>


              <a
                href="/jobs"
                className="group inline-flex items-center gap-2 text-sm font-extrabold text-[#1699A4] transition hover:text-[#147C91]"
              >
                Browse all jobs

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </a>
            </div>


            {loading ? (
              <div className="grid gap-4 lg:grid-cols-2">

                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-48 animate-pulse rounded-2xl bg-slate-100"
                    />
                  )
                )}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">

                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F7FAFC] px-6 py-14 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1699A4]/8 text-[#1699A4]">
                  <BriefcaseBusiness
                    size={27}
                  />
                </div>

                <h3 className="font-bold text-[#071A3D]">
                  No jobs available yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  New AI opportunities will
                  appear here after ingestion.
                </p>
              </div>
            )}
          </div>
        </section>


        {/* ========================================================= */}
        {/* CATEGORIES */}
        {/* ========================================================= */}

        <section className="bg-[#F7FAFC] py-20 sm:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="mx-auto mb-12 max-w-2xl text-center">

              <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#1699A4]">
                Explore your field
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#071A3D] sm:text-4xl">
                Browse AI career paths
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                Find opportunities across the
                areas driving modern artificial
                intelligence.
              </p>
            </div>


            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {displayCategories.map(
                (category) => {
                  const Icon =
                    category.icon ||
                    categoryIcon(
                      category.name
                    );

                  return (
                    <a
                      key={
                        category.slug ||
                        category.name
                      }
                      href={`/jobs?category=${category.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#1699A4]/40 hover:shadow-xl hover:shadow-slate-200/60"
                    >

                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1699A4]/8 text-[#1699A4] transition duration-300 group-hover:bg-[#1699A4] group-hover:text-white">
                        <Icon
                          size={23}
                        />
                      </div>


                      <h3 className="text-lg font-extrabold text-[#071A3D]">
                        {category.name}
                      </h3>


                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {category.description ||
                          `Explore ${category.name} opportunities from leading AI teams.`}
                      </p>


                      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#1699A4]">

                        View jobs

                        <ArrowRight
                          size={15}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </a>
                  );
                }
              )}
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* VALUE PROPOSITION */}
        {/* ========================================================= */}

        <section className="py-20 sm:py-24">

          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#1699A4]/8 px-3 py-1.5 text-xs font-extrabold text-[#147C91]">

                <Zap
                  size={13}
                  className="text-[#E6A064]"
                />

                Built for AI careers
              </div>


              <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight text-[#071A3D] sm:text-4xl lg:text-5xl">

                Spend less time searching.

                <br />

                <span className="text-[#1699A4]">
                  Find relevant roles faster.
                </span>
              </h2>


              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                AI Roles brings opportunities
                from different hiring sources
                together and organizes them by
                skills, category, location and
                company.
              </p>


              <div className="mt-8 space-y-5">

                {[
                  {
                    title:
                      "AI-focused opportunities",
                    description:
                      "Filter out unrelated vacancies and focus on roles connected to AI and machine learning.",
                  },
                  {
                    title:
                      "Structured job discovery",
                    description:
                      "Search by skills, category, company, location and remote availability.",
                  },
                  {
                    title:
                      "Fresh job data",
                    description:
                      "Listings are synchronized with supported company hiring sources.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3"
                  >

                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-[#1699A4]"
                    />

                    <div>
                      <h3 className="font-extrabold text-[#071A3D]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {
                          item.description
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* RIGHT CARD */}
            <div className="relative">

              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#1699A4]/15 via-[#1699A4]/5 to-[#E6A064]/10 blur-2xl" />


              <div className="relative rounded-[2rem] border border-[#1699A4]/10 bg-[#071A3D] p-6 shadow-2xl sm:p-8">

                <div className="mb-8 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#55C3C9]">
                      Smart discovery
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white">
                      Your AI career feed
                    </h3>
                  </div>


                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1699A4]/20 text-[#55C3C9]">

                    <BrainCircuit
                      size={22}
                    />
                  </div>
                </div>


                <div className="space-y-3">

                  {[
                    "Research Engineer",
                    "Machine Learning Engineer",
                    "LLM Infrastructure Engineer",
                  ].map(
                    (title, index) => (
                      <div
                        key={title}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <div className="text-sm font-bold text-white">
                              {title}
                            </div>

                            <div className="mt-1 text-xs text-slate-400">

                              AI Company •{" "}

                              {index === 1
                                ? "Remote"
                                : "Global opportunities"}
                            </div>
                          </div>


                          <div className="rounded-full bg-[#1699A4]/15 px-2.5 py-1 text-[10px] font-extrabold text-[#55C3C9]">
                            NEW
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>


                {/* Alert */}
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#1699A4] p-4 text-white">

                  <BellRing
                    size={20}
                  />

                  <div>
                    <div className="text-sm font-extrabold">
                      Job alerts
                    </div>

                    <div className="text-xs text-white/80">
                      Get matching
                      opportunities when
                      they appear.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* CTA */}
        {/* ========================================================= */}

        <section className="px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8">

          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#071A3D] px-6 py-14 text-center text-white sm:px-10 sm:py-16">

            {/* Decoration */}
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#1699A4]/25 blur-3xl" />

            <div className="absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-[#1699A4]/15 blur-3xl" />

            <div className="absolute right-[15%] top-8 h-20 w-20 rounded-full bg-[#E6A064]/10 blur-2xl" />


            <div className="relative mx-auto max-w-2xl">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1699A4]/20">

                <BellRing
                  size={27}
                  className="text-[#55C3C9]"
                />
              </div>


              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Don't miss your next AI
                opportunity.
              </h2>


              <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">
                Create your profile and
                receive job alerts tailored
                to the roles and technologies
                you're interested in.
              </p>


              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1699A4] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#147C91]"
                >
                  Create free account

                  <ArrowRight
                    size={17}
                  />
                </a>


                <a
                  href="/jobs"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-extrabold text-white transition hover:border-[#1699A4]/60 hover:bg-[#1699A4]/10"
                >
                  Browse jobs
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}