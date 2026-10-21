import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, CircleAlert, Clock3, FileText, Globe2, LoaderCircle, MapPin, Plus, Search, Send, Sparkles, Wallet, X } from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
const initialForm = { title: "", category: "", description: "", employment_type: "full_time", location: "", country: "Kenya", remote: false, salary_min: "", salary_max: "", currency: "KES", skills: [], apply_url: "", application_deadline: "" };
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#18124A] outline-none transition placeholder:text-slate-400 focus:border-[#5145E5] focus:ring-4 focus:ring-[#5145E5]/10 disabled:bg-slate-50 disabled:text-slate-400";
const types = [{ value: "full_time", label: "Full-time" }, { value: "part_time", label: "Part-time" }, { value: "contract", label: "Contract" }, { value: "internship", label: "Internship" }, { value: "temporary", label: "Temporary" }, { value: "freelance", label: "Freelance" }];
const asResults = (data) => Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : Array.isArray(data?.data) ? data.data : [];
const getToken = () => localStorage.getItem("access") || sessionStorage.getItem("access");

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = data.errors || data;
    const detail = typeof data.detail === "string" ? data.detail : typeof data.message === "string" ? data.message : "";
    const fieldMessage = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : ""}`).join("; ");
    const error = new Error(detail || fieldMessage || "Unable to complete request.");
    error.fields = data.errors || (typeof data === "object" ? data : {});
    throw error;
  }
  return data;
}

function Field({ label, required, hint, error, children }) {
  return <div className="space-y-2"><div className="flex items-center justify-between gap-2"><label className="text-sm font-semibold text-[#18124A]">{label}{required && <span className="ml-1 text-rose-500">*</span>}</label>{!required && <span className="text-[11px] text-slate-400">Optional</span>}</div>{children}{error ? <p className="text-xs text-rose-600">{error}</p> : hint ? <p className="text-xs leading-5 text-slate-500">{hint}</p> : null}</div>;
}
function Section({ number, icon: Icon, title, description, children }) {
  return <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-7"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5145E5]/10 text-[#5145E5]"><Icon size={21}/></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5145E5]">Section {number}</p><h2 className="mt-1 text-base font-extrabold text-[#18124A]">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div><div className="space-y-5 p-5 sm:p-7">{children}</div></section>;
}

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [submitting, setSubmitting] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [skillSearch, setSkillSearch] = useState("");
  const [skillPickerOpen, setSkillPickerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadOptions() {
      try {
        const [categoriesResponse, skillsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories/`, { signal: controller.signal, headers: { Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/skills/`, { signal: controller.signal, headers: { Accept: "application/json" } }),
        ]);
        const [categoriesData, skillsData] = await Promise.all([readResponse(categoriesResponse), readResponse(skillsResponse)]);
        if (!controller.signal.aborted) { setCategories(asResults(categoriesData)); setSkills(asResults(skillsData)); }
      } catch (err) { if (!controller.signal.aborted) setOptionsError(`Could not load categories or skills: ${err.message}`); }
      finally { if (!controller.signal.aborted) setLoadingOptions(false); }
    }
    loadOptions();
    return () => controller.abort();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((old) => ({ ...old, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((old) => ({ ...old, [name]: undefined }));
  };
  const toggleSkill = (id) => {
    const key = String(id);
    setForm((old) => ({ ...old, skills: old.skills.map(String).includes(key) ? old.skills.filter((v) => String(v) !== key) : [...old.skills, key] }));
  };
  const visibleSkills = useMemo(() => skills.filter((skill) => (skill.name || "").toLowerCase().includes(skillSearch.toLowerCase())).slice(0, 100), [skills, skillSearch]);
  const selectedSkills = skills.filter((skill) => form.skills.map(String).includes(String(skill.id)));
  const selectedCategory = categories.find((item) => String(item.id) === String(form.category));
  const selectedType = types.find((item) => item.value === form.employment_type)?.label || "Full-time";

  async function handleSubmit(event, publish) {
    event.preventDefault();
    if (submitting) return;
    setError(""); setFieldErrors({});
    const token = getToken();
    if (!token) { setError("Your session has expired. Please sign in again."); return; }
    if (form.salary_min !== "" && form.salary_max !== "" && Number(form.salary_max) < Number(form.salary_min)) {
      setFieldErrors({ salary_max: "Maximum salary must be at least the minimum salary." }); return;
    }
    if (form.application_deadline && form.application_deadline < new Date().toLocaleDateString("en-CA")) {
      setFieldErrors({ application_deadline: "Choose today or a future date." }); return;
    }
    const payload = { ...form, title: form.title.trim(), description: form.description.trim(), location: form.location.trim(), country: form.country.trim(), apply_url: form.apply_url.trim(), salary_min: form.salary_min === "" ? null : Number(form.salary_min), salary_max: form.salary_max === "" ? null : Number(form.salary_max), application_deadline: form.application_deadline || null, is_active: publish };
    setSubmitting(publish ? "publish" : "draft");
    try {
      const response = await fetch(`${API_BASE_URL}/employer/jobs/`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      await readResponse(response);
      navigate("/company/jobs", { replace: true, state: { notice: publish ? "Job published successfully." : "Job draft saved successfully." } });
    } catch (err) {
      setError(err.message || "Unable to save this job.");
      if (err.fields && typeof err.fields === "object") setFieldErrors(err.fields);
    } finally { setSubmitting(""); }
  }

  return <div className="min-h-full bg-[#F8F9FF] px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><Link to="/company/jobs" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#5145E5]"><ArrowLeft size={15}/> Back to jobs</Link><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5145E5] text-white shadow-lg shadow-indigo-500/20"><BriefcaseBusiness size={22}/></div><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5145E5]">Employer workspace</p><h1 className="text-2xl font-extrabold tracking-tight text-[#18124A] sm:text-3xl">Post a new job</h1></div></div><p className="mt-3 max-w-2xl text-sm text-slate-500">Create a compelling opportunity and connect with candidates on Quantahire.</p></div><button type="button" onClick={() => setShowPreview((value) => !value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5145E5] hover:bg-indigo-50">{showPreview ? "Hide" : "Show"} preview</button></div>
    {optionsError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><CircleAlert size={18} className="shrink-0"/>{optionsError}</div>}
    {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><CircleAlert size={18} className="shrink-0"/>{error}</div>}
    <div className={`grid items-start gap-6 ${showPreview ? "xl:grid-cols-[minmax(0,1fr)_320px]" : ""}`}><form id="post-job-form" onSubmit={(event) => handleSubmit(event, event.nativeEvent.submitter?.value === "publish")} className="min-w-0 space-y-6">
      <Section number="01" icon={FileText} title="Job details" description="Tell candidates about the opportunity and the work involved.">
        <Field label="Job title" required error={fieldErrors.title}><input className={inputClass} name="title" value={form.title} onChange={updateField} placeholder="e.g. Senior Full Stack Developer" maxLength={250} required/></Field>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Job category" required error={fieldErrors.category}><select className={inputClass} name="category" value={form.category} onChange={updateField} disabled={loadingOptions} required><option value="">{loadingOptions ? "Loading categories..." : "Select category"}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field><Field label="Employment type" required error={fieldErrors.employment_type}><select className={inputClass} name="employment_type" value={form.employment_type} onChange={updateField}>{types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></Field></div>
        <Field label="Job description" required hint="Include responsibilities, required experience, qualifications and benefits." error={fieldErrors.description}><textarea className={`${inputClass} min-h-52 resize-y`} name="description" rows={9} value={form.description} onChange={updateField} placeholder="What will the successful candidate do? What skills and experience are required?" required/></Field>
        <Field label="Required skills" hint="Search and select the skills relevant to this role." error={fieldErrors.skills}><div className="relative"><button type="button" onClick={() => setSkillPickerOpen((value) => !value)} disabled={loadingOptions} className={`${inputClass} flex items-center justify-between text-left`}><span className="text-slate-500">{loadingOptions ? "Loading skills..." : selectedSkills.length ? `${selectedSkills.length} skills selected` : "Choose skills"}</span><ChevronDown size={16}/></button>{skillPickerOpen && !loadingOptions && <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><div className="relative"><Search size={15} className="absolute left-3 top-3 text-slate-400"/><input autoFocus value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} placeholder="Search skills..." className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#5145E5]"/></div><div className="mt-2 max-h-48 overflow-y-auto">{visibleSkills.map((skill) => { const selected = form.skills.map(String).includes(String(skill.id)); return <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-indigo-50"><span>{skill.name}</span>{selected && <Check size={16} className="text-[#5145E5]"/>}</button>; })}{visibleSkills.length === 0 && <p className="p-3 text-sm text-slate-500">No matching skills.</p>}</div><button type="button" onClick={() => setSkillPickerOpen(false)} className="mt-2 w-full rounded-lg bg-[#5145E5]/10 py-2 text-xs font-semibold text-[#5145E5]">Done</button></div>}</div>{selectedSkills.length > 0 && <div className="flex flex-wrap gap-2 pt-2">{selectedSkills.map((skill) => <button type="button" key={skill.id} onClick={() => toggleSkill(skill.id)} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-[#5145E5]">{skill.name}<X size={12}/></button>)}</div>}</Field>
      </Section>
      <Section number="02" icon={MapPin} title="Workplace & location" description="Set expectations about where the candidate will work."><label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-[#F8F9FF] p-4"><span><span className="block text-sm font-bold text-[#18124A]">Remote position</span><span className="mt-1 block text-xs text-slate-500">Candidates can work remotely.</span></span><input type="checkbox" name="remote" checked={form.remote} onChange={updateField} className="h-5 w-5 accent-[#5145E5]"/></label><div className="grid gap-5 sm:grid-cols-2"><Field label="City / location" required={!form.remote} error={fieldErrors.location}><input className={inputClass} name="location" value={form.location} onChange={updateField} placeholder="e.g. Nairobi" required={!form.remote}/></Field><Field label="Country" required error={fieldErrors.country}><input className={inputClass} name="country" value={form.country} onChange={updateField} required/></Field></div></Section>
      <Section number="03" icon={Wallet} title="Salary & compensation" description="Share a salary range to help candidates assess the opportunity."><div className="grid gap-5 sm:grid-cols-3"><Field label="Currency"><select className={inputClass} name="currency" value={form.currency} onChange={updateField}><option value="KES">KES</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option></select></Field><Field label="Minimum salary" error={fieldErrors.salary_min}><input className={inputClass} type="number" min="0" name="salary_min" value={form.salary_min} onChange={updateField} placeholder="30000"/></Field><Field label="Maximum salary" error={fieldErrors.salary_max}><input className={inputClass} type="number" min="0" name="salary_max" value={form.salary_max} onChange={updateField} placeholder="60000"/></Field></div><p className="text-xs text-slate-500">Use the same pay period for minimum and maximum salary.</p></Section>
      <Section number="04" icon={Globe2} title="Application settings" description="Decide how candidates should apply and when applications close."><div className="grid gap-5 sm:grid-cols-2"><Field label="External application URL" hint="Leave empty to use your platform's application flow." error={fieldErrors.apply_url}><input className={inputClass} type="url" name="apply_url" value={form.apply_url} onChange={updateField} placeholder="https://company.com/careers"/></Field><Field label="Application deadline" error={fieldErrors.application_deadline}><input className={inputClass} type="date" name="application_deadline" value={form.application_deadline} onChange={updateField} min={new Date().toLocaleDateString("en-CA")}/></Field></div></Section>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><p className="text-xs text-slate-500">Fields marked * are required.</p><div className="flex flex-col gap-3 sm:flex-row"><button type="submit" name="action" value="draft" disabled={!!submitting || loadingOptions} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#18124A] hover:bg-slate-50 disabled:opacity-50">{submitting === "draft" && <LoaderCircle size={16} className="animate-spin"/>}Save draft</button><button type="submit" name="action" value="publish" disabled={!!submitting || loadingOptions} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-[#4338CA] disabled:opacity-50">{submitting === "publish" ? <LoaderCircle size={16} className="animate-spin"/> : <Send size={16}/>}Publish job</button></div></div>
    </form>
    {showPreview && <aside className="space-y-5 xl:sticky xl:top-24"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="bg-gradient-to-br from-[#18124A] to-[#5145E5] p-5 text-white"><div className="flex items-center gap-2 text-xs font-semibold text-[#14E0C8]"><Sparkles size={15}/> Live preview</div><h2 className="mt-3 text-lg font-extrabold">How candidates see your job</h2><p className="mt-1 text-xs text-white/70">Updates as you complete the form.</p></div><div className="space-y-4 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-[#5145E5]"><BriefcaseBusiness size={21}/></div><div><h3 className="break-words text-lg font-extrabold text-[#18124A]">{form.title.trim() || "Your job title"}</h3><p className="mt-1 text-xs text-slate-500">{selectedCategory?.name || "Job category"}</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-[#5145E5]">{selectedType}</span>{form.remote && <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">Remote</span>}</div><p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={15}/>{[form.location, form.country].filter(Boolean).join(", ") || "Location not set"}</p>{(form.salary_min || form.salary_max) && <p className="flex items-center gap-2 text-sm font-semibold text-[#18124A]"><Wallet size={15}/>{form.currency} {form.salary_min || "0"} – {form.salary_max || "Open"}</p>}{form.application_deadline && <p className="flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14}/> Deadline: {form.application_deadline}</p>}<div className="border-t border-slate-100 pt-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</p><p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{form.description.trim() || "Your job description will appear here."}</p></div>{selectedSkills.length > 0 && <div className="flex flex-wrap gap-1.5">{selectedSkills.map((skill) => <span key={skill.id} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{skill.name}</span>)}</div>}</div></div><div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4"><div className="flex gap-2"><CheckCircle2 size={18} className="shrink-0 text-[#5145E5]"/><div><h3 className="text-sm font-bold text-[#18124A]">Posting checklist</h3><p className="mt-1 text-xs leading-5 text-slate-500">A clear title, responsibilities and relevant skills make your listing easier to understand.</p></div></div></div></aside>}
    </div>
  </div></div>;
}