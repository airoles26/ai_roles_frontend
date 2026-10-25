import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Bot, BrainCircuit, Check, ChevronDown, CircleCheck,
  ClipboardList, FileText, Fingerprint, LockKeyhole, Radar,
  SearchCheck, ShieldCheck, Sparkles, Target, Workflow, Zap,
} from "lucide-react";
import { startCheckout } from "../components/checkout/Checkout";

const features = [
  { icon: Target, title: "Compatibility scoring", status: "In development", description: "Evaluate role fit using skills, experience, preferences and job requirements, with a transparent score rather than keyword matching alone." },
  { icon: BrainCircuit, title: "QAOA-assisted shortlisting", status: "Prototype tested", description: "Explore candidate–job optimization with Qiskit, combining classical scoring with quantum-inspired selection and comparison against classical baselines." },
  { icon: FileText, title: "ATS-aware resume tailoring", status: "Planned", description: "Generate role-specific resume suggestions that reflect your actual experience without inventing qualifications." },
  { icon: Bot, title: "Assisted applications", status: "Planned", description: "Use supervised browser workflows to help complete repetitive application steps, with review before submission." },
  { icon: ClipboardList, title: "Application tracker", status: "Planned", description: "Organize saved jobs, submitted applications, interview stages and follow-up actions in one workspace." },
  { icon: SearchCheck, title: "Listing freshness checks", status: "Planned", description: "Help identify unavailable or outdated listings using employer-source verification signals, without claiming perfect accuracy." },
];

const steps = [
  { number: "01", title: "Build your profile", description: "Add your skills, experience, preferred locations and target roles." },
  { number: "02", title: "Discover relevant roles", description: "Explore jobs and compare how your profile aligns with each opportunity." },
  { number: "03", title: "Optimize your shortlist", description: "Use QAOA experiments and classical benchmarks to evaluate candidate job selections." },
  { number: "04", title: "Prepare and track", description: "As Copilot tools become available, tailor materials and manage applications in one place." },
];

const faqs = [
  { q: "Is Quantum Talent already fully automated?", a: "No. Quantahire has tested Qiskit-based matching prototypes. Resume tailoring, browser-assisted applications and expanded tracking are roadmap features, and availability may change." },
  { q: "Does quantum matching guarantee a job?", a: "No. Matching scores and optimization results are decision-support tools. Hiring decisions depend on employers and many factors outside Quantahire's control." },
  { q: "Will the Copilot apply without my approval?", a: "The planned application workflow emphasizes user controls and review before submission. Exact automation features will depend on supported employer systems and platform policies." },
  { q: "What does the 7-day access cost?", a: "The project blueprint proposes $9.99 for seven days and a $39.99 monthly tier. Check the checkout page for actual availability, current pricing and terms before paying." },
];

function Pill({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${className}`}>{children}</span>;
}

export default function Copilot() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  async function handleTrial() {
    if (busy) return;
    setBusy(true);
    try {
      await startCheckout("trial", navigate);
    } catch (error) {
      console.error("Checkout could not be started", error);
      navigate("/signup?plan=trial");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden bg-[#F8F9FE] text-[#18124A]">
      <section className="relative isolate overflow-hidden bg-[#10162F] px-5 py-20 text-white sm:px-6 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[450px] w-[450px] rounded-full bg-[#5145E5]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-[#14E0C8]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <Pill className="border-[#14E0C8]/30 bg-[#14E0C8]/10 text-[#8FF9ED]"><Sparkles size={14} /> Introducing Quantum Talent</Pill>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">A smarter way to <span className="text-[#14E0C8]">find your next opportunity.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">Quantum Talent is Quantahire's evolving AI career copilot—bringing together job compatibility insights, Qiskit-powered matching experiments and a roadmap for resume tailoring and application assistance.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={handleTrial} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3.5 text-sm font-bold text-[#10162F] transition hover:bg-[#8FF9ED] disabled:cursor-wait disabled:opacity-60">{busy ? "Opening checkout…" : "Explore 7-day access — $9.99"}<ArrowRight size={17} /></button>
              <Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Explore jobs <ArrowRight size={17} /></Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">Some Copilot capabilities are planned or in development. Pricing is proposed and subject to checkout availability.</p>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-lg sm:p-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div className="flex items-center gap-3"><div className="rounded-2xl bg-[#14E0C8]/15 p-3 text-[#14E0C8]"><Bot size={26} /></div><div><p className="font-bold">Quantum Talent</p><p className="text-xs text-slate-300">Matching workflow preview</p></div></div>
                <Pill className="border-white/20 bg-white/10 text-slate-200">Concept UI</Pill>
              </div>
              <div className="mt-6 space-y-3">
                {[{ name: "Profile compatibility", desc: "Skills · preferences · role fit", icon: Fingerprint }, { name: "Shortlist optimization", desc: "QAOA prototype + classical baseline", icon: Radar }, { name: "Resume assistance", desc: "Planned personalized suggestions", icon: FileText }, { name: "Application workflow", desc: "Planned review and tracking", icon: Workflow }].map(({ name, desc, icon: Icon }, i) => <div key={name} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5145E5]/50 text-[#14E0C8]"><Icon size={20} /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold">{name}</p><p className="mt-1 text-xs text-slate-300">{desc}</p></div>{i < 2 ? <CircleCheck size={18} className="shrink-0 text-[#14E0C8]" /> : <span className="shrink-0 text-[11px] text-slate-400">Roadmap</span>}</div>)}
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-300"><ShieldCheck size={16} className="text-[#14E0C8]" /> Designed for transparent, user-controlled matching</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:py-24" id="features">
        <div className="max-w-3xl"><Pill className="border-[#5145E5]/15 bg-[#5145E5]/5 text-[#5145E5]"><Zap size={14} /> Copilot capabilities</Pill><h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">One workspace for a more focused job search</h2><p className="mt-4 text-base leading-7 text-slate-600">From understanding job fit to preparing stronger applications, we're building tools around the candidate's entire journey.</p></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{features.map(({ icon: Icon, title, status, description }) => <article key={title} className="rounded-3xl border border-[#E7E7F3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-2"><div className="rounded-2xl bg-[#F0EFFF] p-3 text-[#5145E5]"><Icon size={23} /></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{status}</span></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{description}</p></article>)}</div>
      </section>

      <section className="bg-white py-20 lg:py-24" id="how-it-works"><div className="mx-auto max-w-7xl px-5 sm:px-6"><div className="max-w-2xl"><Pill className="border-[#5145E5]/15 bg-[#5145E5]/5 text-[#5145E5]">How it works</Pill><h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">From profile to opportunity</h2><p className="mt-4 text-slate-600">A practical journey combining matching technology with candidate control.</p></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(step => <div key={step.number} className="rounded-3xl border border-slate-200 p-6"><span className="text-3xl font-black text-[#5145E5]">{step.number}</span><h3 className="mt-5 text-lg font-bold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p></div>)}</div></div></section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:py-24" id="quantum-technology"><div><Pill className="border-[#5145E5]/15 bg-[#5145E5]/5 text-[#5145E5]"><BrainCircuit size={14} /> The technology</Pill><h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Classical intelligence meets quantum experimentation.</h2><p className="mt-5 leading-8 text-slate-600">Quantahire's technical approach uses classical compatibility scores as inputs to optimization problems. Our QAOA prototype explores candidate selections with Qiskit, and we compare outcomes with classical methods.</p><p className="mt-4 leading-8 text-slate-600">Quantum hardware tests demonstrate technical feasibility, not proven speed or quality advantages. Production-scale enterprise matching remains part of our development roadmap.</p><Link to="/enterprise" className="mt-7 inline-flex items-center gap-2 font-bold text-[#5145E5] hover:underline">Explore enterprise sourcing <ArrowRight size={17} /></Link></div><div className="rounded-3xl bg-[#18124A] p-7 text-white sm:p-9"><div className="flex items-center gap-3 text-[#14E0C8]"><BrainCircuit size={26} /><span className="font-bold">Hybrid matching pipeline</span></div><div className="mt-7 space-y-3">{["Candidate profile and job requirements", "Classical compatibility scoring", "QUBO / QAOA optimization experiments", "Classical benchmark and result review"].map((s, i) => <div key={s} className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5145E5] text-sm font-bold">{i + 1}</span><span className="text-sm text-slate-100">{s}</span>{i === 3 && <Check size={18} className="ml-auto text-[#14E0C8]" />}</div>)}</div><p className="mt-5 text-xs leading-6 text-slate-300">Built around IBM Qiskit tooling. IBM and Qiskit are trademarks of IBM Corp.; Quantahire is not affiliated with or endorsed by IBM.</p></div></section>

      <section className="bg-[#F0EFFF] py-20"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-2"><div><Pill className="border-[#5145E5]/20 bg-white text-[#5145E5]">Proposed plans</Pill><h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">Start small. Grow with your search.</h2><p className="mt-4 leading-7 text-slate-600">The project roadmap proposes flexible access for short-term and ongoing job searches. Confirm the actual product features and billing terms at checkout.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl bg-white p-6 shadow-sm"><p className="font-bold">7-day access</p><p className="mt-3 text-3xl font-extrabold">$9.99</p><p className="mt-2 text-xs text-slate-500">Proposed 7-day plan</p><button onClick={handleTrial} disabled={busy} className="mt-6 w-full rounded-xl bg-[#5145E5] px-4 py-3 text-sm font-bold text-white hover:bg-[#4338CA] disabled:opacity-60">{busy ? "Opening…" : "Check availability"}</button></div><div className="rounded-3xl bg-[#18124A] p-6 text-white shadow-sm"><p className="font-bold">Monthly Pro</p><p className="mt-3 text-3xl font-extrabold">$39.99<span className="text-sm font-medium text-slate-300"> / mo</span></p><p className="mt-2 text-xs text-slate-300">Proposed subscription tier</p><Link to="/pricing" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-white/30 px-4 py-3 text-sm font-bold hover:bg-white/10">Explore plans</Link></div></div></div></section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-6 lg:py-24"><div className="text-center"><Pill className="border-[#5145E5]/15 bg-[#5145E5]/5 text-[#5145E5]">FAQ</Pill><h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">Frequently asked questions</h2></div><div className="mt-10 space-y-3">{faqs.map(({ q, a }, i) => <div key={q} className="overflow-hidden rounded-2xl border border-[#E7E7F3] bg-white"><button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-bold"><span>{q}</span><ChevronDown size={19} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></button>{openFaq === i && <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{a}</p>}</div>)}</div></section>

      <section className="px-5 pb-20 sm:px-6"><div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-[#18124A] to-[#5145E5] px-6 py-12 text-center text-white sm:px-12 sm:py-16"><LockKeyhole size={30} className="mx-auto text-[#14E0C8]" /><h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">Your next opportunity starts with discovery.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-indigo-100">Explore relevant jobs today and follow Quantum Talent as our matching and application tools evolve.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/jobs" className="inline-flex items-center gap-2 rounded-xl bg-[#14E0C8] px-6 py-3 font-bold text-[#10162F] hover:bg-[#8FF9ED]">Find jobs <ArrowRight size={17} /></Link><Link to="/about" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-bold hover:bg-white/10">About Quantahire</Link></div></div></section>
    </div>
  );
}