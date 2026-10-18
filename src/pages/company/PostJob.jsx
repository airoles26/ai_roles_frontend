import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileText,
  LoaderCircle,
  MapPin,
  Send,
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const initialForm = {
  title: "",
  category: "",
  description: "",
  employment_type: "full_time",
  location: "",
  country: "Kenya",
  remote: false,
  salary_min: "",
  salary_max: "",
  currency: "KES",
  skills: [],
  apply_url: "",
  application_deadline: "",
};

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errors = data.errors || data;
    const message =
      typeof data.detail === "string"
        ? data.detail
        : typeof data.message === "string"
          ? data.message
          : Object.entries(errors)
              .map(([field, value]) => {
                const text = Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "string"
                    ? value
                    : "";

                return text ? `${field}: ${text}` : "";
              })
              .filter(Boolean)
              .join(" ");

    throw new Error(message || "Something went wrong. Please try again.");
  }

  return data;
}

function getResults(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#071A3D] outline-none transition placeholder:text-slate-400 focus:border-[#1699A4] focus:ring-4 focus:ring-[#1699A4]/10";

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      setLoadingOptions(true);

      try {
        const [categoryResponse, skillResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories/`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/skills/`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        const [categoryData, skillData] = await Promise.all([
          readResponse(categoryResponse),
          readResponse(skillResponse),
        ]);

        if (!cancelled) {
          setCategories(getResults(categoryData));
          setSkills(getResults(skillData));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            `Unable to load job categories and skills. ${err.message}`
          );
        }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  }

  function updateSkills(event) {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setForm((previous) => ({ ...previous, skills: selected }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const token =
      localStorage.getItem("access") ||
      sessionStorage.getItem("access");

    if (!token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    if (
      form.salary_min !== "" &&
      form.salary_max !== "" &&
      Number(form.salary_max) < Number(form.salary_min)
    ) {
      setFieldErrors({
        salary_max: "Maximum salary must be at least the minimum salary.",
      });
      return;
    }

    const submitter = event.nativeEvent.submitter;
    const publish = submitter?.value === "publish";

    const payload = {
      ...form,
      category: form.category,
      skills: form.skills,
      salary_min: form.salary_min === "" ? null : Number(form.salary_min),
      salary_max: form.salary_max === "" ? null : Number(form.salary_max),
      application_deadline: form.application_deadline || null,
      is_active: publish,
    };

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/employer/jobs/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      setSuccess(data.message || "Your job has been saved.");

      // Give the employer a moment to see the confirmation.
      window.setTimeout(() => {
        navigate("/company/jobs");
      }, 700);
    } catch (err) {
      setError(err.message || "Unable to save the job.");

      if (err.message.includes("session has expired")) {
        // The employer can sign in again from the login page.
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFC] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-7">
          <Link
            to="/employer/jobs"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#147C91]"
          >
            <ArrowLeft size={16} />
            Back to manage jobs
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071A3D] text-white">
                  <BriefcaseBusiness size={21} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#071A3D] sm:text-3xl">
                    Post a new job
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Find the right people for your team.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-600 sm:flex">
              <Building2 size={16} className="text-[#1699A4]" />
              Employer workspace
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic details */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-[#1699A4]/10 p-2.5 text-[#147C91]">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-bold text-[#071A3D]">
                  Job details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Introduce the role and what the successful candidate will do.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <FormField label="Job title" required>
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  placeholder="e.g. Full Stack Software Developer"
                  className={inputClass}
                  maxLength={250}
                  required
                />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Job category" required>
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className={inputClass}
                    required
                    disabled={loadingOptions}
                  >
                    <option value="">
                      {loadingOptions
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id ?? category.slug}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Employment type" required>
                  <select
                    name="employment_type"
                    value={form.employment_type}
                    onChange={updateField}
                    className={inputClass}
                    required
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="temporary">Temporary</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </FormField>
              </div>

              <FormField
                label="Job description"
                required
                hint="Include responsibilities, required qualifications, experience and benefits."
              >
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={8}
                  placeholder="Describe the role, responsibilities, requirements and what your company offers..."
                  className={`${inputClass} min-h-48 resize-y`}
                  required
                />
              </FormField>

              <FormField
                label="Required skills"
                hint="Select one or more skills. Hold Ctrl (Windows/Linux) or Command (Mac) to select multiple options."
              >
                <select
                  multiple
                  name="skills"
                  value={form.skills}
                  onChange={updateSkills}
                  className={`${inputClass} min-h-36`}
                  disabled={loadingOptions}
                >
                  {skills.map((skill) => (
                    <option
                      key={skill.id ?? skill.slug}
                      value={skill.id}
                    >
                      {skill.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-blue-50 p-2.5 text-[#071A3D]">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="font-bold text-[#071A3D]">
                  Workplace and location
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tell candidates where and how they will work.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#1699A4]">
                <input
                  type="checkbox"
                  name="remote"
                  checked={form.remote}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 accent-[#1699A4]"
                />
                <span>
                  <span className="block text-sm font-semibold text-[#071A3D]">
                    Remote position
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Candidates can work remotely. Leave unchecked for on-site or hybrid work.
                  </span>
                </span>
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="City or location" required={!form.remote}>
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="e.g. Meru or Nairobi"
                    className={inputClass}
                    required={!form.remote}
                  />
                </FormField>

                <FormField label="Country" required>
                  <input
                    name="country"
                    value={form.country}
                    onChange={updateField}
                    placeholder="e.g. Kenya"
                    className={inputClass}
                    required
                  />
                </FormField>
              </div>
            </div>
          </section>

          {/* Compensation */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                <BriefcaseBusiness size={20} />
              </div>
              <div>
                <h2 className="font-bold text-[#071A3D]">
                  Salary and compensation
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Help candidates understand the compensation offered.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <FormField label="Currency">
                <select
                  name="currency"
                  value={form.currency}
                  onChange={updateField}
                  className={inputClass}
                >
                  <option value="KES">KES — Kenyan Shilling</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </FormField>

              <FormField label="Minimum salary">
                <input
                  type="number"
                  name="salary_min"
                  min="0"
                  value={form.salary_min}
                  onChange={updateField}
                  placeholder="e.g. 30000"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Maximum salary"
                hint={
                  fieldErrors.salary_max ||
                  "Use the same pay period for both amounts."
                }
              >
                <input
                  type="number"
                  name="salary_max"
                  min="0"
                  value={form.salary_max}
                  onChange={updateField}
                  placeholder="e.g. 60000"
                  className={`${inputClass} ${
                    fieldErrors.salary_max ? "border-red-400" : ""
                  }`}
                />
              </FormField>
            </div>
          </section>

          {/* Application details */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                <CalendarDays size={20} />
              </div>
              <div>
                <h2 className="font-bold text-[#071A3D]">
                  Application details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose how and when candidates should apply.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Application URL"
                hint="Optional external link where candidates can submit applications."
              >
                <input
                  type="url"
                  name="apply_url"
                  value={form.apply_url}
                  onChange={updateField}
                  placeholder="https://yourcompany.com/careers"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Application deadline"
                hint="Leave empty if the position has no fixed deadline."
              >
                <input
                  type="date"
                  name="application_deadline"
                  value={form.application_deadline}
                  onChange={updateField}
                  min={new Date().toLocaleDateString("en-CA")}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-xs leading-5 text-slate-500">
              Fields marked with <span className="text-red-500">*</span> are required.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="submit"
                name="action"
                value="draft"
                disabled={submitting || loadingOptions}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save draft
              </button>

              <button
                type="submit"
                name="action"
                value="publish"
                disabled={submitting || loadingOptions}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#071A3D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#102b59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Publish job
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}