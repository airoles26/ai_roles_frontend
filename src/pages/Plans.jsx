import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, CheckCircle2, Crown, LoaderCircle, RefreshCw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import api from "../api/api";

function money(value, currency = "KES") {
  const number = Number(value);
  if (value === null || value === undefined || !Number.isFinite(number)) return "Price unavailable";
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(number); }
  catch { return `${currency} ${number.toLocaleString()}`; }
}

function PlanCard({ plan, role, cycle, subscription, onSubscribe, busy, disabled }) {
  const employer = role === "employer";
  const price = employer ? (cycle === "yearly" ? plan.price_yearly : plan.price_monthly) : plan.amount;
  const isFree = employer && plan.is_free;
  const isCurrent = employer
    ? subscription?.active && String(subscription?.plan_id) === String(plan.id) && subscription?.billing_cycle === cycle
    : subscription?.active && subscription?.plan === plan.code;
  const benefits = employer ? [
    plan.max_active_jobs === 0 ? "Unlimited active job posts" : `${plan.max_active_jobs} active job ${plan.max_active_jobs === 1 ? "post" : "posts"}`,
    `${plan.max_featured_jobs} featured job posts`,
    plan.allow_applicant_management ? "Applicant management" : "Basic posting tools",
    ...(plan.allow_company_analytics ? ["Company analytics"] : []),
    ...(plan.allow_featured_jobs ? ["Featured listings enabled"] : []),
  ] : [
    `${plan.days} days of access`,
    `${plan.credits} application credits`,
    "Quantum matching and Copilot access",
    "Track applications in your workspace",
  ];
  const unavailable = !isFree && (price == null || Number(price) <= 0 || (role === "job_seeker" && !plan.available));
  return (
    <article className={`flex min-w-0 flex-col rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${isCurrent ? "border-[#5145E5] ring-2 ring-indigo-100" : "border-slate-200"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-xl bg-indigo-50 p-2.5 text-[#5145E5]">{isCurrent ? <CheckCircle2 size={21} /> : <Crown size={21} />}</span>
        {isCurrent && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Current plan</span>}
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-[#18124A]">{plan.name}</h3>
      <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.description || "Everything you need to grow with Quantahire."}</p>
      <div className="mt-5 flex flex-wrap items-end gap-2">
        <span className="break-words text-3xl font-black tracking-tight text-[#18124A] sm:text-4xl">{isFree ? "Free" : money(price, plan.currency)}</span>
        {!isFree && price != null && <span className="pb-1 text-sm text-slate-500">/{employer ? (cycle === "yearly" ? "year" : "month") : `${plan.days} days`}</span>}
      </div>
      <div className="my-5 h-px bg-slate-100" />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Included</p>
      <ul className="mt-4 flex-1 space-y-3">
        {benefits.map((benefit) => <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-700"><Check size={17} className="mt-0.5 shrink-0 text-emerald-600"/><span>{benefit}</span></li>)}
      </ul>
      <button type="button" disabled={disabled || busy || unavailable || isFree} onClick={() => onSubscribe(plan)}
        className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#4035cb] disabled:cursor-not-allowed disabled:bg-slate-300">
        {busy ? <><LoaderCircle size={17} className="animate-spin"/> Starting checkout...</> : isFree ? "Free plan — contact support" : unavailable ? "Currently unavailable" : isCurrent ? <>Renew plan <ArrowRight size={17}/></> : <>Subscribe now <ArrowRight size={17}/></>}
      </button>
    </article>
  );
}

export default function Plans() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [companyId, setCompanyId] = useState(searchParams.get("company_id") || "");
  const [cycle, setCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

 const load = useCallback(async (id = "") => {
  setLoading(true);
  setError("");

  try {
    const response = await api.get("/billing/plans/", {
      params: id ? { company_id: id } : {},
    });

    console.log("FULL RESPONSE:", response.data);
    console.log("USER ROLE:", response.data.role);
    console.log("PLANS:", response.data.plans);

    setData(response.data);

    if (response.data.role === "employer") {
      setCompanyId(String(response.data.selected_company_id ?? ""));
    }
  } catch (err) {
    console.error("PLANS ERROR:", err);
    setError(
      err.response?.data?.detail ||
      "Unable to load subscription plans."
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { load(searchParams.get("company_id") || ""); }, [load]);

  const changeCompany = (id) => {
    setCompanyId(id);
    setSearchParams(id ? { company_id: id } : {});
    load(id);
  };

  const subscribe = async (plan) => {
    const key = String(plan.id ?? plan.code);
    setBusy(key); setError("");
    try {
      const payload = data.role === "employer"
        ? { company_id: companyId, plan_id: plan.id, billing_cycle: cycle }
        : { plan: plan.code };
      const response = await api.post("/billing/checkout/", payload);
      const url = response.data.authorization_url;
      if (!url || !/^https:\/\//i.test(url)) throw new Error("Invalid payment URL returned.");
      window.location.assign(url);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Could not initialize payment.");
      setBusy("");
    }
  };

  const employer = data?.role === "employer";
  const noCompany = employer && !companyId;
  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8F9FF] px-4 py-7 text-[#18124A] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#5145E5]"><Sparkles size={16}/> Quantahire pricing</div>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Choose your plan</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Explore available plans, compare benefits, and subscribe securely using Paystack.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/subscription" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#5145E5]">My subscription</Link>
            <button type="button" onClick={() => load(companyId)} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh</button>
          </div>
        </header>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {loading && !data ? <div className="flex min-h-64 items-center justify-center gap-3 text-[#5145E5]"><LoaderCircle className="animate-spin"/> Loading plans...</div> : data && <>
          {employer && <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <label htmlFor="plans-company" className="mb-2 block text-sm font-bold">Choose your company</label>
            {data.companies?.length ? <select id="plans-company" value={companyId} onChange={e => changeCompany(e.target.value)} className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#5145E5]">
              {data.companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
            </select> : <p className="text-sm text-slate-500">You need to create a company before subscribing to an employer plan.</p>}
          </div>}

          {data.subscription?.active && <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18}/><span>You have an active <strong>{data.subscription.plan_name}</strong> subscription. You can renew it or choose another plan.</span></div>}

          {employer && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div><h2 className="font-bold">Billing cycle</h2><p className="mt-1 text-xs text-slate-500">Select how frequently to purchase access.</p></div>
            <div className="inline-flex max-w-full rounded-xl bg-slate-100 p-1">
              {["monthly", "yearly"].map(value => <button type="button" key={value} onClick={() => setCycle(value)} className={`rounded-lg px-4 py-2 text-sm font-bold capitalize transition ${cycle === value ? "bg-white text-[#5145E5] shadow-sm" : "text-slate-500"}`}>{value}</button>)}
            </div>
          </div>}

          {data.plans?.length ? <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.plans.map(plan => <PlanCard key={plan.id ?? plan.code} plan={plan} role={data.role} cycle={cycle} subscription={data.subscription} onSubscribe={subscribe} busy={busy === String(plan.id ?? plan.code)} disabled={!!busy || noCompany}/>) }
          </div> : <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">No plans are currently available.</div>}
        </>}
        <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500"><ShieldCheck size={17} className="text-emerald-600"/> Payments are verified by Quantahire before subscription access is activated. <Zap size={16} className="text-[#5145E5]"/> Manual renewals; no automatic charges.</footer>
      </div>
    </main>
  );
}