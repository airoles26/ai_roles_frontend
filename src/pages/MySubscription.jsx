import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3,
  CreditCard, Crown, ExternalLink, LoaderCircle, RefreshCw,
  ShieldCheck, Sparkles, Wallet, XCircle,
} from "lucide-react";
import api from "../api/api";

const fmtDate = (v) => v ? new Date(v).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
const fmtMoney = (amount, currency = "KES") => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${currency} ${amount}`;
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n); }
  catch { return `${currency} ${n.toLocaleString()}`; }
};
const daysLeft = (date) => date ? Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)) : 0;
const Badge = ({ status }) => {
  const colors = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    successful: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    expired: "bg-red-50 text-red-700 ring-red-200",
    inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
    past_due: "bg-orange-50 text-orange-700 ring-orange-200",
    failed: "bg-red-50 text-red-700 ring-red-200",
    refunded: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ${colors[status] || colors.inactive}`}>{(status || "none").replaceAll("_", " ")}</span>;
};

export default function MySubscription() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [companyId, setCompanyId] = useState(params.get("company_id") || "");
  const [cycle, setCycle] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async (selectedId = "") => {
    setLoading(true); setError("");
    try {
      const response = await api.get("/billing/my-subscription/", {
        params: selectedId ? { company_id: selectedId } : {},
      });
      setData(response.data);
      if (response.data.role === "employer") setCompanyId(String(response.data.selected_company_id || ""));
    } catch (err) {
      if (err.response?.status === 401) setError("Session expired. Please sign in again.");
      else setError(err.response?.data?.detail || "Unable to load subscription details.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(params.get("company_id") || ""); }, [load]);

  const checkout = async (plan, billingCycle = cycle) => {
    const key = String(plan);
    setPaying(key); setError(""); setNotice("");
    try {
      const body = data?.role === "employer"
        ? { company_id: companyId, plan_id: plan, billing_cycle: billingCycle }
        : { plan };
      const response = await api.post("/billing/checkout/", body);
      const url = response.data.authorization_url;
      if (!url || !/^https:\/\//.test(url)) throw new Error("Invalid checkout URL returned.");
      window.location.assign(url);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Unable to start payment.");
      setPaying("");
    }
  };

  const changeCompany = (id) => {
    setCompanyId(id);
    setParams(id ? { company_id: id } : {});
    load(id);
  };

  const sub = data?.subscription;
  const role = data?.role;
  const employer = role === "employer";
  const expiry = employer ? sub?.current_period_end : sub?.expires_at;
  const planName = sub?.plan_name || "No subscription";
  const payments = data?.payments || [];

  return (
    <main className="min-h-screen min-w-0 bg-[#F8F9FF] px-4 py-6 text-[#18124A] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl min-w-0 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#5145E5]">Quantahire billing</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">My Subscription</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your plan, renew access, and review payments.</p>
          </div>
          <button type="button" onClick={() => load(companyId)} disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-indigo-300 disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </header>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} {error.includes("sign in") && <button className="ml-2 font-bold underline" onClick={() => navigate("/signin")}>Sign in</button>}</div>}
        {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</div>}
        {loading && !data ? (
          <div className="flex min-h-[50vh] items-center justify-center gap-2 text-[#5145E5]"><LoaderCircle className="animate-spin" /> Loading subscription...</div>
        ) : data ? <>
          {employer && (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <label htmlFor="billing-company" className="mb-2 block text-sm font-bold">Company</label>
              {data.companies?.length ? (
                <select id="billing-company" value={companyId} onChange={e => changeCompany(e.target.value)}
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#5145E5]">
                  {data.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : <p className="text-sm text-slate-500">Create your company profile to purchase an employer plan.</p>}
            </section>
          )}

          <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0 rounded-2xl bg-[#18124A] p-5 text-white sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14E0C8]"><Crown size={17} /> Current plan</p>
                  <h2 className="mt-3 break-words text-2xl font-extrabold sm:text-3xl">{planName}</h2>
                </div>
                <Badge status={sub?.status || "inactive"} />
              </div>
              <div className="mt-7 grid grid-cols-1 gap-4 border-t border-white/15 pt-5 sm:grid-cols-2">
                <div><p className="text-xs text-white/60">{sub?.active ? "Next expiry" : "Expiry date"}</p><p className="mt-1 flex items-center gap-2 text-sm font-bold"><CalendarDays size={16} /> {fmtDate(expiry)}</p></div>
                <div><p className="text-xs text-white/60">Time remaining</p><p className="mt-1 text-lg font-extrabold">{sub?.active ? `${daysLeft(expiry)} days` : "No active access"}</p></div>
                {employer ? <div><p className="text-xs text-white/60">Billing cycle</p><p className="mt-1 text-sm font-bold capitalize">{sub?.billing_cycle || "—"}</p></div>
                  : <div><p className="text-xs text-white/60">Application credits</p><p className="mt-1 text-lg font-extrabold">{sub?.application_credits ?? 0}</p></div>}
              </div>
              <p className="mt-5 text-xs leading-5 text-white/65">Payments on this page are manual prepaid renewals. Automatic recurring billing is not enabled.</p>
            </div>
            <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div>
                <span className="inline-flex rounded-xl bg-indigo-50 p-3 text-[#5145E5]"><ShieldCheck size={23} /></span>
                <h3 className="mt-4 text-lg font-extrabold">Your billing is secure</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Checkout is handled by Paystack. Subscription access is updated only after successful server-side payment verification.</p>
              </div>
              <a href="#available-plans" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#5145E5]">View renewal options <ArrowRight size={16} /></a>
            </div>
          </section>

          <section id="available-plans" className="scroll-mt-24 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-xl font-extrabold">Available plans</h2><p className="mt-1 text-sm text-slate-500">Renew your current plan or select another.</p></div>
              {employer && <div className="flex w-fit rounded-xl border border-slate-200 bg-white p-1 text-sm">
                {["monthly", "yearly"].map(v => <button key={v} onClick={() => setCycle(v)} className={`rounded-lg px-4 py-2 font-bold capitalize ${cycle === v ? "bg-[#5145E5] text-white" : "text-slate-500"}`}>{v}</button>)}
              </div>}
            </div>
            {!data.plans?.length ? <div className="rounded-xl bg-white p-5 text-sm text-slate-500">No plans are currently available.</div> :
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.plans.map(plan => {
                  const id = employer ? plan.id : plan.code;
                  const same = employer ? sub?.plan_id === plan.id : sub?.plan === plan.code;
                  const amount = employer ? (cycle === "monthly" ? plan.price_monthly : plan.price_yearly) : plan.amount;
                  const disabled = Boolean(employer && (!companyId || plan.is_free)) || Boolean(paying);
                  return <article key={id} className={`flex min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${same ? "border-[#5145E5]" : "border-slate-200"}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-extrabold">{plan.name}</h3>{same && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-[#5145E5]">Current plan</span>}</div>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{plan.description || (employer ? "Employer recruitment tools" : "Access Quantahire Copilot features")}</p>
                    <p className="mt-5 break-words text-2xl font-extrabold sm:text-3xl">{fmtMoney(amount, plan.currency)}<span className="ml-1 text-xs font-medium text-slate-500">/{employer ? (cycle === "yearly" ? "year" : "month") : plan.days === 7 ? "7 days" : "30 days"}</span></p>
                    {employer ? <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-600" /> Active jobs: {plan.max_active_jobs === 0 ? "Unlimited" : plan.max_active_jobs}</p>
                      <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-600" /> Featured jobs: {plan.max_featured_jobs}</p>
                      <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-600" /> Applicant management: {plan.allow_applicant_management ? "Included" : "Not included"}</p>
                    </div> : <div className="mt-4 text-xs text-slate-600"><p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-600" /> {plan.credits} application credits</p></div>}
                    <button type="button" disabled={disabled} onClick={() => checkout(id)}
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-4 py-3 text-sm font-bold text-white hover:bg-[#4236c6] disabled:cursor-not-allowed disabled:opacity-50" style={{ marginTop: "24px" }}>
                      {paying === String(id) ? <><LoaderCircle size={17} className="animate-spin" /> Redirecting...</> : <><CreditCard size={17} /> {same ? "Renew plan" : "Choose plan"}</>}
                    </button>
                  </article>;
                })}
              </div>}
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5 sm:p-6"><h2 className="flex items-center gap-2 text-lg font-extrabold"><Wallet size={20} className="text-[#5145E5]" /> Payment history</h2><p className="mt-1 text-sm text-slate-500">Your recent subscription transactions</p></div>
            {!payments.length ? <p className="p-8 text-center text-sm text-slate-500">No payments recorded yet.</p> : <>
              <div className="space-y-3 p-4 md:hidden">
                {payments.map(p => <div key={p.id} className="min-w-0 rounded-xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{p.plan}</strong><Badge status={p.status} /></div>
                  <p className="mt-2 text-sm font-bold">{fmtMoney(p.amount, p.currency)}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">{p.reference || "No reference"}</p>
                  <p className="mt-2 text-xs text-slate-500">{fmtDate(p.paid_at || p.created_at)}</p>
                </div>)}
              </div>
              <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[660px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Plan</th><th className="px-6 py-4">Reference</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th></tr></thead>
                <tbody>{payments.map(p => <tr key={p.id} className="border-t border-slate-100"><td className="whitespace-nowrap px-6 py-4">{fmtDate(p.paid_at || p.created_at)}</td><td className="px-6 py-4 font-medium">{p.plan}</td><td className="max-w-[180px] truncate px-6 py-4 font-mono text-xs text-slate-500" title={p.reference}>{p.reference || "—"}</td><td className="whitespace-nowrap px-6 py-4 font-semibold">{fmtMoney(p.amount, p.currency)}</td><td className="px-6 py-4"><Badge status={p.status} /></td></tr>)}</tbody>
              </table></div>
            </>}
          </section>
        </> : null}
      </div>
    </main>
  );
}