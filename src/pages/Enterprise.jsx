import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Atom, BadgeCheck, BarChart3, BrainCircuit,
  BriefcaseBusiness, Check, ChevronRight, CircleDot, Cpu, Database,
  FileCheck2, Fingerprint, Globe2, Layers3, LockKeyhole, Network,
  SearchCheck, ShieldCheck, Sparkles, Target, Users2, Workflow,
  ClipboardList,
  GitBranch,
  UsersRound,
  CheckCircle2,
  SlidersHorizontal,
  FlaskConical,
} from "lucide-react";

const capabilities = [
  {
    icon: Target,
    title: "Candidate compatibility scoring",
    description: "Evaluate candidate-to-role alignment using structured skills, role requirements, preferences, and other relevant criteria.",
    tag: "Scoring layer",
  },
  {
    icon: Atom,
    title: "QAOA-assisted shortlisting",
    description: "Explore constrained candidate selection through QUBO formulations and hybrid quantum-classical optimization.",
    tag: "Quantum research",
  },
  {
    icon: Workflow,
    title: "Recruitment pipeline",
    description: "Bring job postings, applicants, shortlist decisions, and hiring stages into a more organized workflow.",
    tag: "Employer workspace",
  },
  {
    icon: SearchCheck,
    title: "Verified job discovery",
    description: "A planned verification pipeline designed to detect stale listings and improve trust in job discovery.",
    tag: "Roadmap",
  },
  {
    icon: BrainCircuit,
    title: "AI-assisted talent insights",
    description: "Surface understandable match signals to help recruiters review relevant applicants with greater context.",
    tag: "AI roadmap",
  },
  {
    icon: ShieldCheck,
    title: "Responsible hiring decisions",
    description: "Keep people in control of hiring outcomes, with reviewable recommendations instead of opaque automatic decisions.",
    tag: "Human oversight",
  },
];

const steps = [
  { number: "01", title: "Define the role", description: "Create a job requisition and specify skills, experience, location, salary, and hiring priorities." },
  { number: "02", title: "Evaluate fit", description: "Compare applicant profiles against relevant requirements and generate compatibility signals." },
  { number: "03", title: "Optimize the shortlist", description: "Model selection constraints and evaluate classical and QAOA-based candidate combinations." },
  { number: "04", title: "Review and decide", description: "Recruiters inspect the suggested shortlist and make the final hiring decisions." },
];

const stack = [
  { icon: Atom, title: "IBM Qiskit", subtitle: "Quantum algorithm development" },
  { icon: Cpu, title: "QAOA + QUBO", subtitle: "Constrained optimization" },
  { icon: Database, title: "PostgreSQL", subtitle: "Structured recruitment data" },
  { icon: Layers3, title: "Django + Celery", subtitle: "APIs and background processing" },
];

function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#5145E5]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#14E0C8]" />{eyebrow}
      </span>
      <h2 className="mt-4 font-['Bricolage_Grotesque',sans-serif] text-3xl font-extrabold tracking-tight text-[#18124A] sm:text-4xl lg:text-[42px] lg:leading-tight">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>}
    </div>
  );
}

function QuantumVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[490px]" aria-label="Illustration of candidates being evaluated against job requirements">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-[#14E0C8]/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-sm sm:p-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Atom size={18} className="text-[#14E0C8]" /> Talent optimization</div>
          <span className="rounded-full bg-[#14E0C8]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7DF8EA]">Illustrative model</span>
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="space-y-3">
            {["Candidate A", "Candidate B", "Candidate C"].map((label, index) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5145E5] text-white"><Users2 size={15} /></div>
                <span className="text-[11px] font-medium text-white sm:text-xs">{label}</span>
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#14E0C8]" />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 text-[#14E0C8]"><CircleDot size={16} /><Network size={30} /><CircleDot size={16} /></div>
          <div className="space-y-3">
            {["Role 01", "Role 02", "Role 03"].map((label) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#14E0C8]/15 text-[#14E0C8]"><BriefcaseBusiness size={15} /></div>
                <span className="text-[11px] font-medium text-white sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-[#14E0C8]/25 bg-[#14E0C8]/10 p-4">
          <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-white">Optimization approach</span><BadgeCheck size={17} className="text-[#14E0C8]" /></div>
          <p className="mt-2 font-mono text-xs text-[#B6FFF5]">Compatibility → QUBO → QAOA → Review</p>
          <div className="mt-3 grid grid-cols-12 gap-1">{Array.from({ length: 24 }, (_, i) => <span key={i} className={`h-1.5 rounded-full ${i % 5 === 0 ? "bg-[#14E0C8]" : i % 3 === 0 ? "bg-indigo-300" : "bg-white/15"}`} />)}</div>
        </div>
      </div>
    </div>
  );
}

export default function Enterprise() {
  return (
    <div className="overflow-hidden bg-white">
      
<section className="relative isolate w-full overflow-hidden bg-[#10162F] text-white">
  {/* Background gradient */}
  <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_30%,rgba(81,69,229,0.42),transparent_55%)]" />

  {/* Decorative circle */}
  <div className="pointer-events-none absolute -left-32 top-24 hidden h-72 w-72 rounded-full border-[42px] border-white/[0.025] sm:block" />

  {/* Additional glow */}
  <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#14E0C8]/[0.06] blur-[100px] sm:h-96 sm:w-96" />

  <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 lg:px-8 lg:py-24 xl:gap-14 xl:py-28">

    {/* Left: Hero content */}
    <div className="relative z-10 min-w-0 text-center lg:text-left">

      {/* Eyebrow badge */}
      <div className="flex justify-center lg:justify-start">
        <span className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 px-3 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8CF8EC] sm:px-4 sm:text-xs">
          <Sparkles size={15} className="shrink-0" />
          Enterprise Quantum Sourcing
        </span>
      </div>

      {/* Main heading */}
      <h1 className="mx-auto mt-6 max-w-3xl font-['Bricolage_Grotesque',sans-serif] text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.13] tracking-tight sm:mt-7 lg:mx-0 lg:text-[clamp(2.5rem,4vw,3.625rem)] xl:text-[3.625rem]">
        Better talent decisions,
        <span className="mt-2 block bg-gradient-to-r from-[#14E0C8] via-[#8CF8EC] to-[#A89FFF] bg-clip-text text-transparent">
          powered by smarter optimization.
        </span>
      </h1>

      {/* Description */}
      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-indigo-100/90 sm:mt-6 sm:text-base sm:leading-8 lg:mx-0 xl:text-lg">
        Quantahire is building a hybrid quantum-classical recruitment
        platform to help teams assess candidate fit, explore complex
        hiring constraints, and build more relevant shortlists.
      </p>

      {/* CTA buttons */}
      <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">

        {/* Primary CTA */}
        <a
          href="mailto:enterprise@quantahire.tech?subject=Quantahire%20Enterprise%20Inquiry"
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#14E0C8] px-5 py-3.5 text-center text-sm font-extrabold text-[#10162F] shadow-lg shadow-[#14E0C8]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#91FFF1] hover:shadow-[#14E0C8]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14E0C8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10162F] sm:w-auto sm:px-6"
        >
          Discuss enterprise access
          <ArrowRight
            size={18}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>

        {/* Secondary CTA */}
        <Link
          to="/jobs"
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/[0.04] px-5 py-3.5 text-center text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto sm:px-6"
        >
          Explore the job platform
          <ArrowUpRight
            size={17}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      {/* Development notice */}
      <div className="mx-auto mt-6 flex max-w-xl items-start justify-center gap-2 lg:mx-0 lg:justify-start">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#14E0C8]" />

        <p className="text-left text-xs leading-6 text-indigo-200/80">
          Enterprise features are being developed in phases.
          Contact us to discuss requirements and availability.
        </p>
      </div>
    </div>

    {/* Right: Quantum visual */}
    <div className="relative flex min-w-0 w-full items-center justify-center">

      {/* Visual glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[#5145E5]/15 blur-[70px]" />

      {/* Responsive visual container */}
      <div className="relative mx-auto w-full min-w-0 max-w-[520px] sm:max-w-[600px] lg:max-w-none">

        <div className="relative flex min-h-[260px] w-full min-w-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] p-2 backdrop-blur-sm sm:min-h-[360px] sm:rounded-[28px] sm:p-4 lg:min-h-[400px] xl:min-h-[450px]">

          <div className="relative w-full min-w-0">
            <QuantumVisual />
          </div>

        </div>
      </div>
    </div>
  </div>
</section>


      <section className="border-b border-slate-100 bg-[#F8F9FF]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Target, title: "Relevant shortlists", description: "Evaluate more than keyword overlap" },
            { icon: Network, title: "Constraint-aware matching", description: "Model competing hiring priorities" },
            { icon: LockKeyhole, title: "Human-led decisions", description: "Recommendations for recruiter review" },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3"><div className="rounded-xl bg-[#EBEAFF] p-3 text-[#5145E5]"><Icon size={20} /></div><div><h3 className="text-sm font-bold text-[#18124A]">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
          ))}
        </div>
      </section>

      
<section className="relative isolate overflow-hidden bg-[#F8FAFF] py-20 sm:py-24 lg:py-28">
  {/* Background decorations */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#5145E5]/[0.07] blur-[110px]" />
    <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#14E0C8]/[0.08] blur-[110px]" />
    <div className="absolute inset-0 bg-[radial-gradient(#5145E5_0.6px,transparent_0.6px)] [background-size:26px_26px] opacity-[0.035]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#5145E5]/15 bg-[#5145E5]/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#5145E5]">
        <span className="h-2 w-2 rounded-full bg-[#5145E5]" />
        Why Quantahire
      </span>

      <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#18124A] sm:text-4xl lg:text-5xl">
        Recruitment is more than
        <span className="mt-2 block bg-gradient-to-r from-[#5145E5] via-[#7569EE] to-[#087F78] bg-clip-text text-transparent">
          a keyword match.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Hiring teams weigh multiple factors at once: qualifications,
        availability, role requirements, compensation, and team
        priorities. Quantahire's enterprise vision is to make these
        trade-offs easier to evaluate.
      </p>
    </div>

    {/* Capabilities grid */}
    <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {capabilities.map(
        ({ icon: Icon, title, description, tag }, index) => (
          <article
            key={title}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#E9E9F5] bg-white p-6 shadow-[0_8px_35px_rgba(20,20,60,0.035)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5145E5]/30 hover:shadow-[0_20px_50px_rgba(81,69,229,0.10)] sm:p-7 lg:p-8"
          >
            {/* Subtle hover background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5145E5]/[0.035] via-transparent to-[#14E0C8]/[0.055] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Decorative number */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-5 select-none text-[110px] font-black leading-none text-[#5145E5]/[0.035] sm:text-[130px]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Icon and badge */}
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5145E5]/10 bg-gradient-to-br from-[#5145E5]/10 to-[#14E0C8]/10 text-[#5145E5] transition-all duration-300 group-hover:scale-105 group-hover:border-[#5145E5]/25 group-hover:from-[#5145E5] group-hover:to-[#7569EE] group-hover:text-white">
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-[3px] border-white bg-[#14E0C8]" />
              </div>

              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#5145E5]/10 bg-[#F3F1FF] px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-[#5145E5] sm:text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5145E5]" />
                {tag}
              </span>
            </div>

            {/* Content */}
            <div className="relative mt-8 flex-1">
              <h3 className="text-xl font-extrabold leading-snug tracking-tight text-[#18124A] transition-colors duration-300 group-hover:text-[#5145E5]">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {description}
              </p>
            </div>

            {/* Footer */}
            <div className="relative mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[11px]">
                Enterprise capability
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[#5145E5] transition-all duration-300 group-hover:border-[#5145E5] group-hover:bg-[#5145E5] group-hover:text-white">
                <Sparkles size={17} />
              </div>
            </div>
          </article>
        )
      )}
    </div>

    {/* Bottom reassurance */}
    <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:mt-16 sm:flex-row">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14E0C8]/10 text-[#087F78]">
        <ShieldCheck size={20} />
      </div>

      <p className="max-w-2xl text-sm leading-6 text-slate-600">
        Built around a vision for smarter hiring decisions,
        transparent evaluation, and more efficient recruitment.
      </p>
    </div>
  </div>
</section>


      
<section className="relative isolate overflow-hidden bg-[#F8F9FF] py-20 sm:py-24 lg:py-28">
  {/* Background decorations */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#5145E5]/[0.07] blur-[110px]" />
    <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#14E0C8]/[0.08] blur-[110px]" />
    <div className="absolute inset-0 bg-[radial-gradient(#5145E5_0.6px,transparent_0.6px)] [background-size:26px_26px] opacity-[0.035]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section heading */}
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#5145E5]/15 bg-[#5145E5]/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#5145E5]">
        <span className="h-2 w-2 rounded-full bg-[#5145E5]" />
        Our Approach
      </span>

      <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#18124A] sm:text-4xl lg:text-5xl">
        From job requirements
        <span className="mt-2 block bg-gradient-to-r from-[#5145E5] via-[#7569EE] to-[#087F78] bg-clip-text text-transparent">
          to a considered shortlist.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        A practical workflow combining structured data,
        compatibility scoring, optimization experiments,
        and recruiter judgment.
      </p>
    </div>

    {/* Workflow steps */}
    <div className="relative mt-14 sm:mt-16 lg:mt-20">

      {/* Connecting line on desktop */}
      <div className="pointer-events-none absolute left-[12%] right-[12%] top-[55px] hidden h-[2px] bg-gradient-to-r from-[#5145E5]/10 via-[#5145E5]/30 to-[#14E0C8]/30 lg:block" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="group relative min-w-0"
          >
            {/* Step card */}
            <div className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E8E7F5] bg-white p-6 shadow-[0_8px_35px_rgba(20,20,60,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#5145E5]/30 hover:shadow-[0_20px_50px_rgba(81,69,229,0.10)] sm:p-7">

              {/* Hover gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5145E5]/[0.035] via-transparent to-[#14E0C8]/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Top section */}
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#5145E5]/10 bg-gradient-to-br from-[#5145E5]/10 to-[#14E0C8]/10 text-[#5145E5] transition-all duration-300 group-hover:scale-105 group-hover:from-[#5145E5] group-hover:to-[#7569EE] group-hover:text-white">

                  {index === 0 && (
                    <ClipboardList size={28} strokeWidth={1.8} />
                  )}

                  {index === 1 && (
                    <BrainCircuit size={28} strokeWidth={1.8} />
                  )}

                  {index === 2 && (
                    <GitBranch size={28} strokeWidth={1.8} />
                  )}

                  {index === 3 && (
                    <UsersRound size={28} strokeWidth={1.8} />
                  )}

                  {index > 3 && (
                    <CheckCircle2 size={28} strokeWidth={1.8} />
                  )}
                </div>

                <span className="font-['Bricolage_Grotesque',sans-serif] text-5xl font-black leading-none tracking-tight text-[#5145E5]/10 transition-colors duration-300 group-hover:text-[#5145E5]/20">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="relative mt-8 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#5145E5]">
                  Step {index + 1}
                </span>

                <h3 className="mt-3 text-lg font-extrabold leading-snug tracking-tight text-[#18124A] transition-colors duration-300 group-hover:text-[#5145E5] sm:text-xl">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>

              {/* Bottom progress decoration */}
              <div className="relative mt-8 flex items-center gap-2 border-t border-slate-100 pt-5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5145E5] to-[#14E0C8] transition-all duration-500"
                    style={{
                      width: `${((index + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-[10px] font-bold text-slate-400">
                  {Math.round(((index + 1) / steps.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Connecting arrow between desktop cards */}
            {index < steps.length - 1 && (
              <div className="pointer-events-none absolute -right-4 top-12 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-[#5145E5]/15 bg-white text-[#5145E5] shadow-md lg:flex">
                <ChevronRight size={19} strokeWidth={2.5} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Bottom information */}
    <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:mt-16 sm:flex-row">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14E0C8]/10 text-[#087F78]">
        <ShieldCheck size={20} />
      </div>

      <p className="max-w-2xl text-sm leading-6 text-slate-600">
        Combining intelligent technology with human judgment
        to support more thoughtful recruitment decisions.
      </p>
    </div>
  </div>
</section>


      
<section
  id="technology"
  className="relative isolate overflow-hidden bg-[#F8FAFF] py-20 sm:py-24 lg:py-28"
>
  {/* Background decorations */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5145E5]/[0.07] blur-[120px]" />
    <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#14E0C8]/[0.08] blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section heading */}
    <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#5145E5]/15 bg-[#5145E5]/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#5145E5]">
        <span className="h-2 w-2 rounded-full bg-[#5145E5]" />
        The Technology
      </span>

      <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#18124A] sm:text-4xl lg:text-5xl">
        Built around
        <span className="mt-2 block bg-gradient-to-r from-[#5145E5] via-[#7569EE] to-[#087F78] bg-clip-text text-transparent">
          hybrid quantum-classical
        </span>
        <span className="block">research.</span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        Quantahire's technical blueprint explores how QAOA can
        complement conventional ranking and optimization methods
        for constrained talent matching.
      </p>
    </div>

    <div className="grid items-stretch gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">

      {/* Left: Research workflow */}
      <div className="relative isolate overflow-hidden rounded-[28px] bg-[#10162F] p-6 text-white sm:p-8 lg:p-9">

        {/* Decorative glows */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#5145E5]/30 blur-[90px]" />
          <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#14E0C8]/15 blur-[90px]" />
        </div>

        {/* Panel header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/20 bg-[#14E0C8]/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#14E0C8]">
            <Atom size={14} />
            Research Workflow
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-300">
            Hybrid Optimization
          </span>
        </div>

        <h3 className="mt-7 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          Where intelligent matching
          <span className="block text-[#14E0C8]">
            meets optimization research.
          </span>
        </h3>

        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
          Exploring a structured approach to talent matching
          that combines classical methods, quantum experiments,
          and human oversight.
        </p>

        {/* Workflow list */}
        <div className="relative mt-9 space-y-4">

          {[
            {
              icon: SlidersHorizontal,
              title: "Problem formulation",
              description:
                "Convert compatibility signals and hiring constraints into an optimization problem.",
            },
            {
              icon: Atom,
              title: "Hybrid optimization",
              description:
                "Compare QAOA-generated solutions against classical baselines.",
            },
            {
              icon: Cpu,
              title: "Background execution",
              description:
                "Run intensive calculations asynchronously using background workers.",
            },
            {
              icon: UsersRound,
              title: "Human oversight",
              description:
                "Keep recruiters in control of final hiring decisions.",
            },
          ].map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-all duration-300 hover:border-[#14E0C8]/30 hover:bg-white/[0.08] sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#14E0C8]/20 bg-[#14E0C8]/10 text-[#14E0C8] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#14E0C8] group-hover:text-[#10162F]">
                <Icon size={22} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#14E0C8]">
                    Phase {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h4 className="mt-1.5 text-sm font-extrabold text-white sm:text-base">
                  {title}
                </h4>

                <p className="mt-1.5 text-xs leading-6 text-slate-300 sm:text-sm">
                  {description}
                </p>
              </div>

              <CheckCircle2
                size={17}
                className="mt-1 shrink-0 text-white/25"
              />
            </div>
          ))}
        </div>

        {/* Panel footer */}
        <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#14E0C8]/10 text-[#14E0C8]">
            <ShieldCheck size={20} />
          </div>

          <p className="text-xs leading-6 text-slate-300">
            Designed to support recruiter judgment,
            not replace human decision-making.
          </p>
        </div>
      </div>

      {/* Right: Technology stack */}
      <div className="flex min-w-0 flex-col">

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-[#18124A] sm:text-2xl">
              Technology ecosystem
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Components supporting Quantahire's research blueprint.
            </p>
          </div>

          <span className="rounded-full border border-[#5145E5]/10 bg-[#5145E5]/[0.07] px-3 py-1.5 text-xs font-bold text-[#5145E5]">
            {stack.length} Components
          </span>
        </div>

        {/* Technology cards */}
        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          {stack.map(({ icon: Icon, title, subtitle }, index) => (
            <article
              key={title}
              className="group relative flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#E9E9F5] bg-white p-6 shadow-[0_8px_30px_rgba(20,20,60,0.035)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5145E5]/30 hover:shadow-[0_20px_45px_rgba(81,69,229,0.10)]"
            >
              {/* Hover gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5145E5]/[0.04] to-[#14E0C8]/[0.05] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#5145E5]/10 bg-gradient-to-br from-[#5145E5]/10 to-[#14E0C8]/10 text-[#5145E5] transition-all duration-300 group-hover:scale-105 group-hover:from-[#5145E5] group-hover:to-[#7569EE] group-hover:text-white">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <span className="text-xs font-extrabold text-[#5145E5]/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative mt-7 flex-1">
                <h4 className="text-lg font-extrabold tracking-tight text-[#18124A]">
                  {title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {subtitle}
                </p>
              </div>

              <div className="relative mt-7 h-1 w-12 rounded-full bg-gradient-to-r from-[#5145E5] to-[#14E0C8] transition-all duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </div>

    {/* Development status notice */}
    <div className="mt-8 overflow-hidden rounded-[24px] border border-[#DCD8FA] bg-gradient-to-r from-[#F2F0FF] via-white to-[#F0FFFC] p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#5145E5] shadow-sm">
          <FlaskConical size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-extrabold text-[#18124A] sm:text-lg">
              Research & Development Status
            </h3>

            <span className="rounded-full border border-[#5145E5]/15 bg-[#5145E5]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#5145E5]">
              Experimental
            </span>
          </div>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Quantahire has conducted small-scale QAOA experiments,
            including execution on IBM Quantum hardware. This does
            not establish quantum speedup or production-scale
            enterprise performance.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


      <section className="bg-[#10162F] py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#14E0C8]">Enterprise plan · proposed pricing</span>
            <h2 className="mt-4 font-['Bricolage_Grotesque',sans-serif] text-3xl font-extrabold tracking-tight sm:text-4xl">Enterprise Quantum Sourcing</h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-indigo-100">For recruitment teams evaluating advanced applicant ranking, constrained shortlist optimization, and dedicated sourcing workflows.</p>
            <div className="mt-7 flex flex-wrap items-baseline gap-2"><span className="text-5xl font-extrabold">$1,500</span><span className="text-indigo-200">/ month · proposed</span></div>
            <p className="mt-2 text-xs text-indigo-200">Blueprint pricing, subject to availability and a confirmed commercial agreement.</p>
            <a href="mailto:enterprise@quantahire.tech?subject=Enterprise%20Quantum%20Sourcing" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3.5 text-sm font-extrabold text-[#10162F] transition hover:bg-[#91FFF1]">Request an enterprise discussion <ArrowRight size={17} /></a>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm sm:p-9">
            <h3 className="text-lg font-bold">Proposed enterprise capabilities</h3>
            <div className="mt-6 space-y-5">
              {[
                "Batch candidate matching and shortlist analysis",
                "Custom constraint and optimization configuration",
                "Recruiter-facing applicant pipeline workflows",
                "Candidate comparison and reporting tools",
                "Enterprise onboarding and support",
              ].map((item) => <div key={item} className="flex items-start gap-3"><Check size={18} className="mt-0.5 shrink-0 text-[#14E0C8]" /><span className="text-sm leading-6 text-indigo-100">{item}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Development roadmap" title="An ambitious roadmap, delivered in stages." description="The technical blueprint outlines a phased path from platform foundations to more advanced enterprise optimization and automation." center />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { period: "Late 2026", title: "Platform foundations", description: "Core job marketplace, candidate tools, employer workflows, and early matching experiments." },
            { period: "2027", title: "Enterprise optimization", description: "Planned production hybrid Qiskit workflows, enterprise sourcing, and recruiter tools." },
            { period: "2028–2030", title: "Scale and research", description: "Planned broader ATS automation, larger job coverage, and further hardware exploration." },
          ].map((phase) => <article key={phase.period} className="rounded-3xl border border-[#E9E9F5] bg-[#FAFAFF] p-7"><span className="rounded-full bg-[#EBEAFF] px-3 py-1 text-xs font-extrabold text-[#5145E5]">{phase.period}</span><h3 className="mt-6 text-xl font-extrabold text-[#18124A]">{phase.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{phase.description}</p></article>)}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#5145E5] to-[#2C236E] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="relative"><Globe2 className="mx-auto text-[#14E0C8]" size={30} /><h2 className="mx-auto mt-5 max-w-2xl font-['Bricolage_Grotesque',sans-serif] text-3xl font-extrabold sm:text-4xl">Let's explore what smarter sourcing could look like for your team.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-indigo-100">Tell us about your recruitment needs and learn more about Quantahire's enterprise roadmap.</p><a href="mailto:enterprise@quantahire.tech?subject=Let's%20talk%20Quantahire%20Enterprise" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3.5 text-sm font-extrabold text-[#10162F] transition hover:bg-[#91FFF1]">Contact enterprise team <ArrowRight size={17} /></a></div>
        </div>
      </section>
    </div>
  );
}