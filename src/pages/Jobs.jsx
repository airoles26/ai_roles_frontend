import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
  Building2,
  BrainCircuit,
  Globe2,
  RefreshCw,
  ChevronDown,
  Check,
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
};


export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [error, setError] = useState("");

  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | FILTER STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [company, setCompany] = useState(
    searchParams.get("company") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [skill, setSkill] = useState(
    searchParams.get("skill") || ""
  );

  const [remote, setRemote] = useState(
    searchParams.get("remote") || ""
  );

  const [employmentType, setEmploymentType] =
    useState(
      searchParams.get("employment_type") || ""
    );

  const [ordering, setOrdering] = useState(
    searchParams.get("ordering") || "-posted_at"
  );

  const [page, setPage] = useState(
    Number(searchParams.get("page")) || 1
  );


  /*
  |--------------------------------------------------------------------------
  | FETCH FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadFilters = async () => {
      try {
        setFilterLoading(true);

        const [
          categoryResponse,
          companyResponse,
          skillResponse,
        ] = await Promise.all([
          api.get("/categories/"),
          api.get("/companies/"),
          api.get("/skills/"),
        ]);

        setCategories(
          getResults(categoryResponse.data)
        );

        setCompanies(
          getResults(companyResponse.data)
        );

        setSkills(
          getResults(skillResponse.data)
        );
      } catch (err) {
        console.error(
          "Failed to load filters:",
          err
        );
      } finally {
        setFilterLoading(false);
      }
    };

    loadFilters();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | BUILD API QUERY
  |--------------------------------------------------------------------------
  */

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    const currentSearch =
      searchParams.get("search");

    const currentLocation =
      searchParams.get("location");

    const currentCompany =
      searchParams.get("company");

    const currentCategory =
      searchParams.get("category");

    const currentSkill =
      searchParams.get("skill");

    const currentRemote =
      searchParams.get("remote");

    const currentEmployment =
      searchParams.get("employment_type");

    const currentOrdering =
      searchParams.get("ordering");

    const currentPage =
      searchParams.get("page");

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    if (currentLocation) {
      params.set("location", currentLocation);
    }

    if (currentCompany) {
      params.set("company", currentCompany);
    }

    if (currentCategory) {
      params.set("category", currentCategory);
    }

    if (currentSkill) {
      params.set("skill", currentSkill);
    }

    if (currentRemote) {
      params.set("remote", currentRemote);
    }

    if (currentEmployment) {
      params.set(
        "employment_type",
        currentEmployment
      );
    }

    if (currentOrdering) {
      params.set(
        "ordering",
        currentOrdering
      );
    }

    if (currentPage) {
      params.set("page", currentPage);
    }

    return params.toString();
  }, [searchParams]);


  /*
  |--------------------------------------------------------------------------
  | FETCH JOBS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/jobs/?${queryString}`
        );

        const data = response.data;

        if (Array.isArray(data)) {
          setJobs(data);
          setCount(data.length);
          setNext(null);
          setPrevious(null);
        } else {
          setJobs(data.results || []);
          setCount(data.count || 0);
          setNext(data.next || null);
          setPrevious(data.previous || null);
        }
      } catch (err) {
        console.error(
          "Failed loading jobs:",
          err
        );

        setError(
          "We couldn't load the jobs. Please try again."
        );

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [queryString]);


  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  function getResults(data) {
    if (Array.isArray(data)) {
      return data;
    }

    return data?.results || [];
  }


  const updateURL = (overrides = {}) => {
    const params = new URLSearchParams();

    const values = {
      search,
      location,
      company,
      category,
      skill,
      remote,
      employment_type: employmentType,
      ordering,
      page,
      ...overrides,
    };

    Object.entries(values).forEach(
      ([key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value !== false
        ) {
          params.set(key, value);
        }
      }
    );

    setSearchParams(params);
  };


  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);

    updateURL({
      page: 1,
    });
  };


  const applyFilters = () => {
    setPage(1);

    updateURL({
      page: 1,
    });

    setMobileFiltersOpen(false);
  };


  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCompany("");
    setCategory("");
    setSkill("");
    setRemote("");
    setEmploymentType("");
    setOrdering("-posted_at");
    setPage(1);

    setSearchParams({});
    setMobileFiltersOpen(false);
  };


  const handleOrdering = (value) => {
    setOrdering(value);
    setPage(1);

    updateURL({
      ordering: value,
      page: 1,
    });
  };


  const changePage = (newPage) => {
    if (newPage < 1) return;

    setPage(newPage);

    updateURL({
      page: newPage,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const activeFilters = [
    searchParams.get("company"),
    searchParams.get("category"),
    searchParams.get("skill"),
    searchParams.get("remote"),
    searchParams.get("employment_type"),
    searchParams.get("location"),
  ].filter(Boolean).length;


  /*
  |--------------------------------------------------------------------------
  | FILTER PANEL
  |--------------------------------------------------------------------------
  */

  const FilterPanel = () => (
    <div className="space-y-7">

      {/* Heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            style={{ color: BRAND.teal }}
          />

          <h3
            className="font-extrabold"
            style={{ color: BRAND.navy }}
          >
            Filters
          </h3>

          {activeFilters > 0 && (
            <span
              className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black text-white"
              style={{
                backgroundColor: BRAND.teal,
              }}
            >
              {activeFilters}
            </span>
          )}
        </div>

        {activeFilters > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-slate-500 transition hover:text-red-500"
          >
            Clear all
          </button>
        )}
      </div>


      {/* Remote */}
      <FilterSection title="Work arrangement">
        <button
          onClick={() =>
            setRemote(
              remote === "true" ? "" : "true"
            )
          }
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
            remote === "true"
              ? "border-[#1699A4] bg-[#1699A4]/5 text-[#147C91]"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
              remote === "true"
                ? "border-[#1699A4] bg-[#1699A4] text-white"
                : "border-slate-300"
            }`}
          >
            {remote === "true" && (
              <Check size={13} />
            )}
          </span>

          <Globe2 size={16} />

          Remote jobs
        </button>
      </FilterSection>


      {/* Category */}
      <FilterSection title="Category">
        <SelectInput
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All categories
          </option>

          {categories.map((item) => (
            <option
              key={item.id || item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </SelectInput>
      </FilterSection>


      {/* Company */}
      <FilterSection title="Company">
        <SelectInput
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
        >
          <option value="">
            All companies
          </option>

          {companies.map((item) => (
            <option
              key={item.id || item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </SelectInput>
      </FilterSection>


      {/* Skill */}
      <FilterSection title="Skill">
        <SelectInput
          value={skill}
          onChange={(e) =>
            setSkill(e.target.value)
          }
        >
          <option value="">
            All skills
          </option>

          {skills.map((item) => (
            <option
              key={item.id || item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </SelectInput>
      </FilterSection>


      {/* Employment */}
      <FilterSection title="Employment type">
        <SelectInput
          value={employmentType}
          onChange={(e) =>
            setEmploymentType(e.target.value)
          }
        >
          <option value="">
            All employment types
          </option>

          <option value="full_time">
            Full time
          </option>

          <option value="part_time">
            Part time
          </option>

          <option value="contract">
            Contract
          </option>

          <option value="internship">
            Internship
          </option>

          <option value="temporary">
            Temporary
          </option>
        </SelectInput>
      </FilterSection>


      <button
        onClick={applyFilters}
        disabled={filterLoading}
        className="w-full rounded-xl px-5 py-3 text-sm font-extrabold text-white transition hover:opacity-90 disabled:opacity-60"
        style={{
          backgroundColor: BRAND.teal,
        }}
      >
        Apply filters
      </button>
    </div>
  );


  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Navbar />

      <main>

        {/* HERO */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(22,153,164,0.10),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(7,26,61,0.08),transparent_32%)]" />

          <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">

            <div className="max-w-3xl">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-extrabold"
                style={{
                  color: BRAND.tealDark,
                  backgroundColor:
                    "rgba(22,153,164,0.09)",
                }}
              >
                <BrainCircuit size={15} />

                AI & Machine Learning Careers
              </div>

              <h1
                className="text-4xl font-black tracking-[-0.04em] sm:text-5xl"
                style={{
                  color: BRAND.navy,
                }}
              >
                Find AI jobs that{" "}
                <span
                  style={{
                    color: BRAND.teal,
                  }}
                >
                  match your skills.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Search artificial intelligence,
                machine learning, LLM, research,
                infrastructure and data roles from
                companies around the world.
              </p>
            </div>


            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50"
            >
              <div className="flex flex-col lg:flex-row">

                <div className="flex flex-1 items-center gap-3 px-4 py-3">
                  <Search
                    size={20}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Job title, skill or company"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </div>

                <div className="hidden w-px bg-slate-200 lg:block" />

                <div className="flex flex-1 items-center gap-3 border-t border-slate-100 px-4 py-3 lg:border-t-0">
                  <MapPin
                    size={20}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="City, country or remote"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white transition hover:opacity-90"
                  style={{
                    backgroundColor: BRAND.teal,
                  }}
                >
                  <Search size={17} />
                  Search jobs
                </button>
              </div>
            </form>
          </div>
        </section>


        {/* JOBS */}
        <section className="border-t border-slate-100 py-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

            <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">

              {/* DESKTOP FILTERS */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <FilterPanel />
                </div>
              </aside>


              {/* CONTENT */}
              <div className="min-w-0">

                {/* Results toolbar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

                  <div>
                    <h2
                      className="text-xl font-black"
                      style={{
                        color: BRAND.navy,
                      }}
                    >
                      AI Jobs
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {loading
                        ? "Searching opportunities..."
                        : `${count.toLocaleString()} ${
                            count === 1
                              ? "opportunity"
                              : "opportunities"
                          } found`}
                    </p>
                  </div>


                  <div className="flex items-center gap-2">

                    {/* Mobile filter */}
                    <button
                      onClick={() =>
                        setMobileFiltersOpen(true)
                      }
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 lg:hidden"
                    >
                      <SlidersHorizontal
                        size={16}
                      />

                      Filters

                      {activeFilters > 0 && (
                        <span
                          className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] text-white"
                          style={{
                            backgroundColor:
                              BRAND.teal,
                          }}
                        >
                          {activeFilters}
                        </span>
                      )}
                    </button>


                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={ordering}
                        onChange={(e) =>
                          handleOrdering(
                            e.target.value
                          )
                        }
                        className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#1699A4]"
                      >
                        <option value="-posted_at">
                          Newest
                        </option>

                        <option value="posted_at">
                          Oldest
                        </option>

                        <option value="-salary_max">
                          Highest salary
                        </option>

                        <option value="salary_min">
                          Lowest salary
                        </option>
                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>


                {/* ERROR */}
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm font-semibold text-red-700">
                      {error}
                    </p>

                    <button
                      onClick={() =>
                        window.location.reload()
                      }
                      className="mt-3 flex items-center gap-2 text-sm font-bold text-red-700"
                    >
                      <RefreshCw size={15} />
                      Try again
                    </button>
                  </div>
                )}


                {/* LOADING */}
                {loading && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(
                      (item) => (
                        <div
                          key={item}
                          className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
                        >
                          <div className="flex gap-4 p-6">
                            <div className="h-12 w-12 rounded-xl bg-slate-100" />

                            <div className="flex-1">
                              <div className="h-3 w-28 rounded bg-slate-100" />
                              <div className="mt-3 h-5 w-2/3 rounded bg-slate-100" />
                              <div className="mt-5 h-3 w-1/2 rounded bg-slate-100" />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}


                {/* RESULTS */}
                {!loading &&
                  !error &&
                  jobs.length > 0 && (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                        />
                      ))}
                    </div>
                  )}


                {/* EMPTY */}
                {!loading &&
                  !error &&
                  jobs.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                      <div
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor:
                            "rgba(22,153,164,0.08)",
                          color: BRAND.teal,
                        }}
                      >
                        <BriefcaseBusiness
                          size={25}
                        />
                      </div>

                      <h3
                        className="mt-5 text-lg font-black"
                        style={{
                          color: BRAND.navy,
                        }}
                      >
                        No matching jobs
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Try changing your search
                        keywords or removing some of
                        your filters.
                      </p>

                      <button
                        onClick={clearFilters}
                        className="mt-5 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            BRAND.teal,
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}


                {/* PAGINATION */}
                {!loading &&
                  jobs.length > 0 &&
                  (previous || next) && (
                    <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

                      <button
                        disabled={!previous}
                        onClick={() =>
                          changePage(page - 1)
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={17} />
                        Previous
                      </button>


                      <div className="text-sm text-slate-500">
                        Page{" "}
                        <span
                          className="font-extrabold"
                          style={{
                            color: BRAND.navy,
                          }}
                        >
                          {page}
                        </span>
                      </div>


                      <button
                        disabled={!next}
                        onClick={() =>
                          changePage(page + 1)
                        }
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          backgroundColor:
                            BRAND.navy,
                        }}
                      >
                        Next
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  )}


                {/* INFO */}
                <div className="mt-8 rounded-2xl border border-[#1699A4]/20 bg-[#1699A4]/5 p-5">
                  <div className="flex gap-3">
                    <BrainCircuit
                      size={21}
                      className="mt-0.5 shrink-0 text-[#1699A4]"
                    />

                    <div>
                      <h3
                        className="text-sm font-extrabold"
                        style={{
                          color: BRAND.navy,
                        }}
                      >
                        Built specifically for AI
                        careers
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        AI Roles collects and
                        organizes AI-focused
                        opportunities so you can
                        spend less time searching
                        across multiple company
                        career pages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          <button
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 right-0 top-0 w-[90%] max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1699A4]">
                  Refine results
                </p>

                <h2 className="font-black text-[#071A3D]">
                  Job Filters
                </h2>
              </div>

              <button
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5">
              <FilterPanel />
            </div>
          </div>
        </div>
      )}


      <Footer />
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| SMALL COMPONENTS
|--------------------------------------------------------------------------
*/

function FilterSection({
  title,
  children,
}) {
  return (
    <div>
      <label className="mb-2.5 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {title}
      </label>

      {children}
    </div>
  );
}


function SelectInput({
  children,
  ...props
}) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#1699A4] focus:ring-4 focus:ring-[#1699A4]/10"
      >
        {children}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}