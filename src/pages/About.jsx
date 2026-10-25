import { Link } from "react-router-dom";
import {
  ArrowRight, Atom, BrainCircuit, BriefcaseBusiness, CheckCircle2,
  Cpu, Database, FileText, Globe2, Layers3, LockKeyhole,
  Network, Rocket, SearchCheck, ShieldCheck, Sparkles, Target,
  Users, Workflow, Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: Atom,
    title: "Quantum-inspired matching",
    eyebrow: "MATCHING ENGINE",
    description:
      "We model job shortlisting as an optimization problem and explore QAOA through IBM Qiskit, alongside classical baselines. Our prototype supports local simulation and experimental hardware runs.",
  },
  {
    icon: BrainCircuit,
    title: "Quantum Talent Copilot",
    eyebrow: "PRODUCT VISION",
    description:
      "An AI-assisted career workspace designed for compatibility scoring, job-specific resume tailoring, and application support. Automated form submission is part of the product roadmap.",
  },
  {
    icon: SearchCheck,
    title: "More reliable job discovery",
    eyebrow: "JOB QUALITY",
    description:
      "A job discovery experience designed around direct employer listings, relevant search, and ongoing validation of listing availability. Automated verification is a planned capability.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Smarter recruiter workflows",
    eyebrow: "EMPLOYER TOOLS",
    description:
      "A unified employer experience for posting openings, reviewing applicants, and eventually using batch optimization to evaluate candidate-job fit under multiple constraints.",
  },
];

const steps = [
  { number: "01", title: "Understand the opportunity", text: "Bring together job requirements, skills, location, salary preferences, and other relevant constraints." },
  { number: "02", title: "Score compatibility", text: "Build interpretable candidate-job affinity scores using the information available." },
  { number: "03", title: "Optimize the shortlist", text: "Explore constrained selections using QAOA and compare their outcomes with classical optimization." },
  { number: "04", title: "Support the next step", text: "Present relevant jobs and develop tools that help candidates prepare and track applications." },
];

const roadmap = [
  { period: "Late 2026", title: "Foundation & Copilot", text: "Quantahire rebrand, job discovery, candidate workspace, and initial Quantum Talent Copilot features.", status: "Current focus" },
  { period: "2027", title: "Hybrid quantum matching", text: "Expand QUBO/QAOA matching pipelines and enterprise candidate-shortlisting workflows.", status: "Planned" },
  { period: "2028", title: "Broader application automation", text: "Develop more capable, auditable application workflows and grow verified job coverage.", status: "Planned" },
  { period: "2029–2030", title: "Advanced quantum infrastructure", text: "Evaluate larger quantum workloads as hardware, economics, and practical performance evolve.", status: "Long-term vision" },
];

const stack = [
  { icon: Globe2, label: "React / Next.js", detail: "Web experience" },
  { icon: Layers3, label: "Django REST Framework", detail: "Application APIs" },
  { icon: Database, label: "PostgreSQL + Redis", detail: "Data and task queues" },
  { icon: Cpu, label: "IBM Qiskit", detail: "Optimization experiments" },
  { icon: Workflow, label: "Celery", detail: "Background processing" },
  { icon: Network, label: "Playwright", detail: "Planned application automation" },
];

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#5145E5]">{eyebrow}</p>
      <h2 className="font-['Bricolage_Grotesque',ui-sans-serif,system-ui,sans-serif] text-3xl font-extrabold tracking-tight text-[#18124A] sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>}
    </div>
  );
}

export default function About() {
  return (
    <div className="overflow-hidden bg-white text-slate-800">
      {/* The shared MainLayout renders Navbar and Footer. */}
      <section className="relative isolate overflow-hidden bg-[#10162F] px-5 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#5145E5]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#14E0C8]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#14E0C8]/30 bg-[#14E0C8]/10 px-4 py-2 text-xs font-bold tracking-wide text-[#8FF9E9]">
              <Sparkles size={15} /> ABOUT QUANTAHIRE
            </span>
            <h1 className="mt-7 font-['Bricolage_Grotesque',ui-sans-serif,system-ui,sans-serif] text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Rethinking how <span className="text-[#14E0C8]">talent meets opportunity.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-indigo-100 sm:text-lg">
              Quantahire is building a job discovery and recruitment platform that combines intelligent matching, quantum optimization research, and AI-assisted career workflows.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3.5 text-sm font-bold text-[#10162F] transition hover:bg-[#86F6E7]">
                Explore jobs <ArrowRight size={17} />
              </Link>
              <Link to="/enterprise" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                For employers <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] border border-white/10" />
            <div className="relative rounded-[1.7rem] border border-white/15 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div><p className="text-xs font-semibold uppercase tracking-widest text-[#9BFFF1]">Our approach</p><p className="mt-2 text-xl font-bold">Human goals. Better matching.</p></div>
                <Atom size={38} className="text-[#14E0C8]" />
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { icon: Users, label: "People and opportunities", sub: "Candidate and employer needs" },
                  { icon: BrainCircuit, label: "Intelligent compatibility", sub: "Skills and constraints" },
                  { icon: Cpu, label: "Optimization research", sub: "QAOA and classical comparisons" },
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5145E5]/50 text-[#9BFFF1]"><Icon size={21} /></span>
                    <div className="min-w-0 flex-1"><p className="font-semibold text-white">{label}</p><p className="mt-1 text-xs text-indigo-200">{sub}</p></div>
                    <span className="text-xs font-bold text-indigo-300">0{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-6 text-indigo-200">An evolving platform—not a claim that quantum methods outperform classical methods in production.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Why we exist" title="Job searching deserves more than keyword matching." />
            <p className="mt-6 text-base leading-8 text-slate-600">Candidates can spend hours finding relevant openings and tailoring applications, while recruiters sort through large volumes of profiles. Traditional search alone doesn't capture every constraint that makes a role a good fit.</p>
            <p className="mt-4 text-base leading-8 text-slate-600">Quantahire's blueprint brings discovery, compatibility scoring, constrained optimization, and application assistance into one connected experience.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E9E9F5] bg-[#F8F8FF] p-6"><Target className="text-[#5145E5]" size={26}/><h3 className="mt-5 text-lg font-bold text-[#18124A]">Our mission</h3><p className="mt-3 text-sm leading-7 text-slate-600">Make the path between qualified talent and meaningful work more relevant, transparent, and efficient.</p></div>
            <div className="rounded-2xl border border-[#E9E9F5] bg-[#F8F8FF] p-6"><Rocket className="text-[#5145E5]" size={26}/><h3 className="mt-5 text-lg font-bold text-[#18124A]">Our vision</h3><p className="mt-3 text-sm leading-7 text-slate-600">Build a global talent infrastructure where AI and emerging optimization methods support better hiring decisions.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FE] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="What we're building" title="One connected platform. Multiple ways to move forward." description="Quantahire's technical and product blueprints organize the experience around job seekers, employers, and an evolving matching engine." centered />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, eyebrow, description }) => (
              <article key={title} className="rounded-3xl border border-[#E8EAF6] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#F0EFFF] p-3 text-[#5145E5]"><Icon size={26}/></div>
                <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5145E5]">{eyebrow}</p>
                <h3 className="mt-2 text-xl font-bold text-[#18124A]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Behind the matching" title="From real-world constraints to useful recommendations." description="Our optimization research treats matching as a selection problem. We test quantum approaches against classical methods rather than assuming one is always better." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative rounded-2xl border border-[#E9E9F5] p-6">
                <span className="text-4xl font-extrabold text-[#D9D6FF]">{step.number}</span>
                <h3 className="mt-5 text-lg font-bold text-[#18124A]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#E6E4FF] bg-[#F8F7FF] p-5 text-sm text-slate-700">
            <ShieldCheck className="shrink-0 text-[#5145E5]" size={22}/>
            <p><strong className="text-[#18124A]">Research-led, results-aware:</strong> A QAOA experiment is not proof of quantum advantage or guaranteed optimal hiring outcomes.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#10162F] px-5 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#14E0C8]">Our technology</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Built for an intelligent, extensible hiring platform.</h2><p className="mt-4 leading-8 text-indigo-200">The technical blueprint combines modern web infrastructure, asynchronous workloads, and quantum computing experiments.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stack.map(({ icon: Icon, label, detail }) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"><span className="rounded-xl bg-[#5145E5]/35 p-3 text-[#14E0C8]"><Icon size={22}/></span><div><p className="font-bold">{label}</p><p className="mt-1 text-xs text-indigo-200">{detail}</p></div></div>)}
          </div>
          <p className="mt-6 text-xs text-indigo-300">IBM and Qiskit are trademarks of IBM. Quantahire is not affiliated with or endorsed by IBM.</p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Looking ahead" title="Our roadmap, from foundations to frontier technology." description="These are planning milestones from the Quantahire blueprint, not claims that every feature is already available." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {roadmap.map((item) => <div key={item.period} className="rounded-2xl border border-[#E9E9F5] bg-white p-6 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><span className="font-extrabold text-[#5145E5]">{item.period}</span><span className="rounded-full bg-[#F0EFFF] px-3 py-1 text-xs font-bold text-[#5145E5]">{item.status}</span></div><h3 className="mt-5 text-lg font-bold text-[#18124A]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#302476] to-[#5145E5] px-7 py-12 text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="relative max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9BFFF1]">Join the journey</p><h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">A more thoughtful way to connect talent and opportunity.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100">Whether you're exploring your next role or building a team, discover what Quantahire is creating.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-5 py-3 text-sm font-bold text-[#10162F] hover:bg-[#85F7E7]">Find opportunities <ArrowRight size={17}/></Link><Link to="/enterprise" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10">Explore enterprise solutions <ArrowRight size={17}/></Link></div></div>
        </div>
      </section>
    </div>
  );
}