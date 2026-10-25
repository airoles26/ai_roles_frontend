import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Atom, BadgeCheck, BarChart3, BrainCircuit,
  BriefcaseBusiness, Check, ChevronRight, CircleDot, Cpu, Database,
  FileCheck2, Fingerprint, Globe2, Layers3, LockKeyhole, Network,
  SearchCheck, ShieldCheck, Sparkles, Target, Users2, Workflow,
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
      <section className="relative isolate overflow-hidden bg-[#10162F] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_30%,rgba(81,69,229,0.42),transparent_50%)]" />
        <div className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.025]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 px-4 py-2 text-xs font-bold tracking-wide text-[#8CF8EC]"><Sparkles size={15} /> ENTERPRISE QUANTUM SOURCING</span>
            <h1 className="mt-7 max-w-3xl font-['Bricolage_Grotesque',sans-serif] text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px]">
              Better talent decisions, <span className="text-[#14E0C8]">powered by smarter optimization.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-indigo-100 sm:text-lg">
              Quantahire is building a hybrid quantum-classical recruitment platform to help teams assess candidate fit, explore complex hiring constraints, and build more relevant shortlists.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="mailto:enterprise@quantahire.tech?subject=Quantahire%20Enterprise%20Inquiry" className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3.5 text-sm font-extrabold text-[#10162F] transition hover:bg-[#91FFF1]">Discuss enterprise access <ArrowRight size={18} /></a>
              <Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Explore the job platform <ArrowUpRight size={17} /></Link>
            </div>
            <p className="mt-5 text-xs leading-6 text-indigo-200/80">Enterprise features are being developed in phases. Contact us to discuss requirements and availability.</p>
          </div>
          <QuantumVisual />
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

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Why Quantahire" title="Recruitment is more than a keyword match." description="Hiring teams weigh multiple factors at once: qualifications, availability, role requirements, compensation, and team priorities. Quantahire's enterprise vision is to make these trade-offs easier to evaluate." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description, tag }) => (
            <article key={title} className="group rounded-3xl border border-[#E9E9F5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#C8C4FA] hover:shadow-lg sm:p-7">
              <div className="flex items-center justify-between"><div className="rounded-2xl bg-[#F1F0FF] p-3 text-[#5145E5]"><Icon size={23} /></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">{tag}</span></div>
              <h3 className="mt-6 text-lg font-extrabold text-[#18124A]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#F8F9FF] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our approach" title="From job requirements to a considered shortlist." description="A practical workflow combining structured data, compatibility scoring, optimization experiments, and recruiter judgment." center />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative rounded-3xl border border-[#E8E7F5] bg-white p-6 shadow-sm">
                <span className="font-['Bricolage_Grotesque',sans-serif] text-4xl font-extrabold text-[#5145E5]/20">{step.number}</span>
                <h3 className="mt-5 text-lg font-extrabold text-[#18124A]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                {index < steps.length - 1 && <ChevronRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-[#5145E5] lg:block" size={22} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <SectionHeading eyebrow="The technology" title="Built around hybrid quantum-classical research." description="Quantahire's technical blueprint explores how QAOA can complement conventional ranking and optimization methods for constrained talent matching." />
          <div className="mt-8 space-y-4">
            {[
              "Convert compatibility signals and hiring constraints into an optimization problem.",
              "Compare QAOA-generated solutions against classical baselines.",
              "Run intensive calculations asynchronously using background workers.",
              "Keep recruiters in control of final hiring decisions.",
            ].map((item) => <div key={item} className="flex items-start gap-3"><div className="mt-1 rounded-full bg-[#E8FBF8] p-1 text-[#0F9F91]"><Check size={14} /></div><p className="text-sm leading-7 text-slate-600">{item}</p></div>)}
          </div>
          <p className="mt-7 rounded-2xl border border-[#E4E1FA] bg-[#F7F6FF] p-4 text-xs leading-6 text-slate-600"><strong className="text-[#18124A]">Development status:</strong> Quantahire has conducted small-scale QAOA experiments, including execution on IBM Quantum hardware. This does not establish quantum speedup or production-scale enterprise performance.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stack.map(({ icon: Icon, title, subtitle }) => <div key={title} className="rounded-3xl border border-[#E9E9F5] bg-white p-6 shadow-sm"><div className="inline-flex rounded-xl bg-[#F1F0FF] p-3 text-[#5145E5]"><Icon size={26} /></div><h3 className="mt-6 font-extrabold text-[#18124A]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p></div>)}
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