import { useCallback, useEffect, useState } from "react";
import {
  Bell, CheckCircle2, Eye, EyeOff, KeyRound, Loader2,
  LockKeyhole, Mail, MapPin, Phone, RefreshCw, Save,
  ShieldCheck, UserRound, AlertCircle, Building2,
} from "lucide-react";
import api from "../../api/api";

const ENDPOINT = "/employer/settings/";
const TABS = [
  { id: "account", label: "My account", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];
const initialAccount = {
  full_name: "", username: "", email: "", phone_number: "",
  bio: "", location: "", country: "", profile_image: "",
};
const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50";

function Field({ label, hint, children }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{children}{hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}</label>;
}
function Message({ message }) {
  if (!message?.text) return null;
  return <div role="alert" className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
    {message.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}{message.text}
  </div>;
}
function getError(err) {
  const data = err?.response?.data;
  return data?.message || data?.detail || data?.error || (Array.isArray(data?.errors) ? data.errors.join(" ") : null) || "Something went wrong. Please try again.";
}

export default function CompanySettings() {
  const [tab, setTab] = useState("account");
  const [account, setAccount] = useState(initialAccount);
  const [original, setOriginal] = useState(initialAccount);
  const [verified, setVerified] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [showPasswords, setShowPasswords] = useState(false);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await api.get(ENDPOINT, { signal });
      const a = data.account || {};
      const values = Object.fromEntries(Object.keys(initialAccount).map(key => [key, a[key] ?? ""]));
      setAccount(values);
      setOriginal(values);
      setVerified({ email: Boolean(a.email_verified), phone: Boolean(a.phone_verified) });
      setNotifications(Boolean(a.preferences?.email_notifications ?? true));
    } catch (err) {
      if (err.code !== "ERR_CANCELED") setMessage({ type: "error", text: getError(err) });
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const update = (key, value) => setAccount(prev => ({ ...prev, [key]: value }));
  const changed = Object.fromEntries(Object.keys(account).filter(key => account[key] !== original[key] && !["username", "email"].includes(key)).map(key => [key, account[key]]));
  const isDirty = Object.keys(changed).length > 0;

  const saveAccount = async (e) => {
    e.preventDefault();
    if (!isDirty) return;
    setSaving("account"); setMessage(null);
    try {
      const { data } = await api.patch(ENDPOINT, changed);
      const values = Object.fromEntries(Object.keys(initialAccount).map(key => [key, data.account?.[key] ?? ""]));
      setAccount(values); setOriginal(values);
      setMessage({ type: "success", text: data.message || "Account saved." });
    } catch (err) { setMessage({ type: "error", text: getError(err) }); }
    finally { setSaving(""); }
  };
  const saveNotifications = async () => {
    setSaving("notifications"); setMessage(null);
    try {
      const { data } = await api.patch(`${ENDPOINT}notifications/`, { email_notifications: notifications });
      setMessage({ type: "success", text: data.message || "Preferences saved." });
    } catch (err) { setMessage({ type: "error", text: getError(err) }); }
    finally { setSaving(""); }
  };
  const changePassword = async (e) => {
    e.preventDefault(); setSaving("password"); setMessage(null);
    try {
      const { data } = await api.post(`${ENDPOINT}password/`, password);
      setPassword({ current_password: "", new_password: "", confirm_password: "" });
      setMessage({ type: "success", text: data.message || "Password changed." });
    } catch (err) { setMessage({ type: "error", text: getError(err) }); }
    finally { setSaving(""); }
  };

  return <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-900 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm font-semibold text-indigo-600">Employer dashboard</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1><p className="mt-2 text-sm text-slate-500">Manage your account, notifications and security.</p></div>
        <button type="button" onClick={() => load()} disabled={loading || Boolean(saving)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"><RefreshCw size={16} /> Refresh</button>
      </header>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="flex h-fit gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:flex-col">
          {TABS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => { setTab(id); setMessage(null); }} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${tab === id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={18} />{label}</button>)}
          <a href="/company/company-profile" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Building2 size={18} />Company profile</a>
        </nav>
        <div className="space-y-4">
          <Message message={message} />
          {loading ? <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white"><Loader2 className="animate-spin text-indigo-600" size={26} /><span className="ml-3 text-sm text-slate-500">Loading settings...</span></div> : <>
            {tab === "account" && <form onSubmit={saveAccount} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div><h2 className="text-lg font-bold">Personal information</h2><p className="mt-1 text-sm text-slate-500">These details belong to your employer account.</p></div>
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <img src={account.profile_image || "https://placehold.co/80x80?text=User"} alt="Profile" className="h-16 w-16 rounded-full border border-slate-200 object-cover" onError={e => { e.currentTarget.style.visibility = "hidden"; }} />
                <div className="min-w-0"><p className="truncate font-semibold">{account.full_name || account.username}</p><p className="truncate text-sm text-slate-500">@{account.username}</p></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name"><input className={inputClass} value={account.full_name} onChange={e => update("full_name", e.target.value)} maxLength={150} required /></Field>
                <Field label="Username" hint="Username cannot be changed here."><input className={inputClass} value={account.username} disabled /></Field>
                <Field label="Email address" hint={verified.email ? "Email verified" : "Email not verified"}><div className="relative"><Mail size={16} className="absolute left-3 top-4 text-slate-400" /><input className={`${inputClass} pl-10`} value={account.email} disabled /></div></Field>
                <Field label="Phone number" hint={verified.phone ? "Phone verified" : "Phone not verified"}><div className="relative"><Phone size={16} className="absolute left-3 top-4 text-slate-400" /><input type="tel" className={`${inputClass} pl-10`} value={account.phone_number} onChange={e => update("phone_number", e.target.value)} maxLength={20} /></div></Field>
                <Field label="Location"><div className="relative"><MapPin size={16} className="absolute left-3 top-4 text-slate-400" /><input className={`${inputClass} pl-10`} value={account.location} onChange={e => update("location", e.target.value)} maxLength={255} placeholder="City or region" /></div></Field>
                <Field label="Country"><input className={inputClass} value={account.country} onChange={e => update("country", e.target.value)} maxLength={100} /></Field>
              </div>
              <Field label="Profile image URL" hint="Use an HTTPS image URL."><input type="url" className={inputClass} value={account.profile_image} onChange={e => update("profile_image", e.target.value)} placeholder="https://..." /></Field>
              <Field label="Bio"><textarea className={inputClass} rows={4} value={account.bio} onChange={e => update("bio", e.target.value)} placeholder="A little about yourself..." /></Field>
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => setAccount(original)} disabled={!isDirty || Boolean(saving)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-40">Discard</button><button disabled={!isDirty || Boolean(saving)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">{saving === "account" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}Save changes</button></div>
            </form>}
            {tab === "notifications" && <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div><h2 className="text-lg font-bold">Notification preferences</h2><p className="mt-1 text-sm text-slate-500">Choose how Quantahire can contact you.</p></div>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"><div className="flex items-start gap-3"><Bell className="mt-0.5 shrink-0 text-indigo-600" size={20} /><div><p className="font-semibold">Email notifications</p><p className="mt-1 text-sm text-slate-500">Allow account and platform email updates. Essential security emails may still be sent.</p></div></div><input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="h-5 w-5 shrink-0 accent-indigo-600" /></label>
              <div className="flex justify-end"><button type="button" onClick={saveNotifications} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving === "notifications" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}Save preferences</button></div>
            </section>}
            {tab === "security" && <form onSubmit={changePassword} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><LockKeyhole size={22} /></div><div><h2 className="text-lg font-bold">Change password</h2><p className="text-sm text-slate-500">Protect your employer account.</p></div></div>
              {[["current_password", "Current password"], ["new_password", "New password"], ["confirm_password", "Confirm new password"]].map(([key, label]) => <Field key={key} label={label}><input className={inputClass} type={showPasswords ? "text" : "password"} autoComplete={key === "current_password" ? "current-password" : "new-password"} value={password[key]} onChange={e => setPassword(p => ({ ...p, [key]: e.target.value }))} required /></Field>)}
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={showPasswords} onChange={e => setShowPasswords(e.target.checked)} className="accent-indigo-600" />{showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}Show passwords</label>
              <p className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">Use a strong, unique password. After updating, sign in again to refresh your session.</p>
              <div className="flex justify-end"><button disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving === "password" ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}Update password</button></div>
            </form>}
          </>}
        </div>
      </div>
    </div>
  </main>;
}