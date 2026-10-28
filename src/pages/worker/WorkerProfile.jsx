import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, Camera, CheckCircle2, FileText, Globe, Loader2, MapPin, Save, UserRound } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";


import api from "../../api/api";

const EMPTY = {
  first_name: "", last_name: "", email: "", phone: "", headline: "",
  location: "", bio: "", skills: [], experience_years: "", education: "",
  desired_job_title: "", preferred_location: "", preferred_work_mode: "any",
  linkedin_url: "", github_url: "", portfolio_url: "", resume_url: "",
  open_to_work: true,
};

const fieldStyle = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-[#5145E5] focus:ring-2 focus:ring-[#5145E5]/15";
const labelStyle = "block text-sm font-semibold text-slate-700";

function Field({ label, name, value, onChange, placeholder = "", type = "text", ...props }) {
  return (
    <label className={labelStyle}>
      {label}
      <input name={name} type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder} className={fieldStyle} {...props} />
    </label>
  );
}

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
        <span className="rounded-xl bg-indigo-50 p-2.5 text-[#5145E5]"><Icon size={20} /></span>
        <div><h2 className="text-lg font-bold text-[#10162F]">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>
      </div>
      {children}
    </section>
  );
}

export default function WorkerProfile() {
  const [form, setForm] = useState(EMPTY);
  const [skillsText, setSkillsText] = useState("");
  const [stats, setStats] = useState({ applications: 0, saved_jobs: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setError("");
      const { data } = await api.get("/worker/profile/");
      const profile = { ...EMPTY, ...data.profile };
      setForm(profile);
      setSkillsText((profile.skills || []).join(", "));
      setStats(data.stats || { applications: 0, saved_jobs: 0 });
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load your profile. Please sign in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
    setSuccess("");
  };

  

const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    setError("Only JPG, PNG and WebP images are allowed.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("Image must not exceed 5 MB.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    setUploadingImage(true);
    setError("");
    setSuccess("");

    const { data } = await api.post(
      "/worker/profile/upload-image/",
      formData
    );

    setForm((previous) => ({
      ...previous,
      profile_image: data.profile_image,
    }));

    setSuccess("Profile image updated successfully.");
  } catch (error) {
    setError(
      error.response?.data?.detail ||
      "Failed to upload image."
    );
  } finally {
    setUploadingImage(false);
    event.target.value = "";
  }
};

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = {
      ...form,
      skills: [...new Set(skillsText.split(",").map((skill) => skill.trim()).filter(Boolean))],
      experience_years: form.experience_years === "" ? null : Number(form.experience_years),
    };
    try {
      const { data } = await api.patch("/worker/profile/", payload);
      setForm({ ...EMPTY, ...data.profile });
      setSkillsText((data.profile.skills || []).join(", "));
      setSuccess("Profile updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const details = err.response?.data;
      setError(details?.detail || (details && typeof details === "object" ? Object.entries(details).map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`).join(" | ") : "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-[#5145E5]"><Loader2 className="animate-spin" size={32} /><span className="ml-3 text-slate-600">Loading profile...</span></div>;

  const initials = `${form.first_name?.[0] || ""}${form.last_name?.[0] || ""}`.toUpperCase() || "Q";

  return (
    <div className="min-h-screen bg-[#F6F7FB] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-semibold text-[#5145E5]">CANDIDATE WORKSPACE</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10162F] sm:text-4xl">My Profile</h1><p className="mt-2 text-sm text-slate-500">Keep your professional details up to date for better job recommendations.</p></div>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">Job seeker account</span>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"><CheckCircle2 size={18} />{success}</div>}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-[#18124A] via-[#5145E5] to-[#14E0C8] sm:h-32" />
          <div className="flex flex-wrap items-end justify-between gap-4 px-5 pb-6 sm:px-7">
            <div className="flex items-end gap-4">
              <div className="-mt-8 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-2xl font-black text-[#5145E5] shadow-sm sm:h-24 sm:w-24">{initials}</div>
              <div className="pb-1"><h2 className="text-xl font-bold text-[#10162F]">{[form.first_name, form.last_name].filter(Boolean).join(" ") || "Your name"}</h2><p className="text-sm text-slate-500">{form.headline || "Add your professional headline"}</p>{form.location && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} />{form.location}</p>}</div>
            </div>
            <div className="flex gap-3 text-center"><div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-xl font-extrabold text-[#5145E5]">{stats.applications}</p><p className="text-xs text-slate-500">Applications</p></div><div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-xl font-extrabold text-[#5145E5]">{stats.saved_jobs}</p><p className="text-xs text-slate-500">Saved jobs</p></div></div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <Section
  icon={UserRound}
  title="Personal information"
  subtitle="Manage your personal details and profile photo."
>
  {/* Profile image upload */}
  <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
    <div className="relative h-24 w-24 shrink-0">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100 shadow-sm">
        {form.profile_image ? (
          <img
            src={form.profile_image}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-[#5145E5]">
            {initials}
          </span>
        )}
      </div>

      <label
        htmlFor="personal-profile-image"
        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#5145E5] text-white shadow-md hover:bg-[#4338CA]"
      >
        {uploadingImage ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Camera size={16} />
        )}
      </label>
    </div>

    <div className="flex-1">
      <h3 className="font-bold text-[#10162F]">
        Profile photo
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Upload a professional photo to personalize your
        Quantahire profile. JPG, PNG or WebP, max 5 MB.
      </p>

      <label
        htmlFor="personal-profile-image"
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5145E5] hover:bg-indigo-50"
      >
        <Camera size={16} />
        {uploadingImage ? "Uploading..." : "Change photo"}
      </label>

      <input
        id="personal-profile-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageUpload}
        disabled={uploadingImage}
        className="hidden"
      />
    </div>
  </div>

  {/* Existing personal information fields */}
  <div className="grid gap-5 sm:grid-cols-2">
    <Field
      label="First name"
      name="first_name"
      value={form.first_name}
      onChange={onChange}
      required
      maxLength={150}
    />

    <Field
      label="Last name"
      name="last_name"
      value={form.last_name}
      onChange={onChange}
      required
      maxLength={150}
    />

    <Field
      label="Email address"
      name="email"
      type="email"
      value={form.email}
      onChange={onChange}
      required
    />

    <Field
      label="Phone number"
      name="phone"
      value={form.phone}
      onChange={onChange}
      placeholder="+254 7..."
    />

    <div className="sm:col-span-2">
      <Field
        label="Location"
        name="location"
        value={form.location}
        onChange={onChange}
        placeholder="Nairobi, Kenya"
      />
    </div>
  </div>
</Section>

          <Section icon={BriefcaseBusiness} title="Professional background" subtitle="Help Quantahire understand your experience and expertise.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Professional headline" name="headline" value={form.headline} onChange={onChange} placeholder="Software Engineer | React & Django" /></div>
              <label className={`${labelStyle} sm:col-span-2`}>About me<textarea name="bio" value={form.bio} onChange={onChange} rows={5} maxLength={3000} placeholder="Tell employers about your strengths, projects, and experience..." className={fieldStyle} /></label>
              <label className={`${labelStyle} sm:col-span-2`}>Skills (comma-separated)<input value={skillsText} onChange={(e) => { setSkillsText(e.target.value); setSuccess(""); }} placeholder="Python, Django, React, PostgreSQL" className={fieldStyle} />{skillsText.trim() && <div className="mt-3 flex flex-wrap gap-2">{skillsText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20).map((s, i) => <span key={`${s}-${i}`} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#5145E5]">{s}</span>)}</div>}</label>
              <Field label="Years of experience" name="experience_years" type="number" min="0" max="70" step="1" value={form.experience_years} onChange={onChange} placeholder="2" />
              <Field label="Education" name="education" value={form.education} onChange={onChange} placeholder="BSc Computer Science" />
            </div>
          </Section>

          <Section icon={MapPin} title="Job preferences" subtitle="Set the type of opportunities you want to discover.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Desired job title" name="desired_job_title" value={form.desired_job_title} onChange={onChange} placeholder="Backend Developer" />
              <Field label="Preferred location" name="preferred_location" value={form.preferred_location} onChange={onChange} placeholder="Remote / Nairobi" />
              <label className={labelStyle}>Work arrangement<select name="preferred_work_mode" value={form.preferred_work_mode} onChange={onChange} className={fieldStyle}><option value="any">Any</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></select></label>
              <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-3.5 text-sm font-semibold text-slate-700"><input type="checkbox" name="open_to_work" checked={form.open_to_work} onChange={onChange} className="h-4 w-4 accent-[#5145E5]" />Open to new opportunities</label>
            </div>
          </Section>

          <Section icon={FileText} title="Resume & online presence" subtitle="Add links to your resume and professional profiles.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field label="Resume URL" name="resume_url" type="url" value={form.resume_url} onChange={onChange} placeholder="https://example.com/resume.pdf" /></div>
              <Field label="LinkedIn URL" name="linkedin_url" type="url" value={form.linkedin_url} onChange={onChange} placeholder="https://linkedin.com/in/..." />
              <Field label="GitHub URL" name="github_url" type="url" value={form.github_url} onChange={onChange} placeholder="https://github.com/..." />
              <div className="sm:col-span-2"><Field label="Portfolio URL" name="portfolio_url" type="url" value={form.portfolio_url} onChange={onChange} placeholder="https://yourportfolio.com" /></div>
            </div>
            <p className="mt-3 text-xs text-slate-500">This version saves a resume link; it does not upload files. Use a secure upload endpoint if you want direct PDF uploads.</p>
          </Section>

          <div className="flex justify-end pb-8"><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}{saving ? "Saving changes..." : "Save profile"}</button></div>
        </form>
      </div>
    </div>
  );
}