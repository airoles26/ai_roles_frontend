
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  SlidersHorizontal,
  Bell,
  ShieldCheck,
  Trash2,
  LogOut,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Settings2,
  BriefcaseBusiness,
  Eye,
  EyeOff,
} from "lucide-react";

import { workerSettingsApi } from "../../api/api";

const INITIAL_ACCOUNT = {
  first_name: "",
  last_name: "",
  email: "",
};

const INITIAL_PREFERENCES = {
  preferred_job_title: "",
  preferred_location: "",
  remote_preference: "any",
  employment_type: "any",
  minimum_salary: "",
  salary_currency: "USD",
  job_alerts: true,
  application_updates: true,
  product_emails: false,
};

const TABS = [
  { id: "account", label: "My Account", icon: UserRound },
  {
    id: "preferences",
    label: "Job Preferences",
    icon: BriefcaseBusiness,
  },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "danger", label: "Account Management", icon: Settings2 },
];

function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#18124A]">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#18124A] outline-none transition focus:border-[#5145E5] focus:ring-4 focus:ring-indigo-50"
      />
      {hint && (
        <span className="mt-1.5 block text-xs text-slate-400">
          {hint}
        </span>
      )}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#18124A]">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#18124A] outline-none focus:border-[#5145E5] focus:ring-4 focus:ring-indigo-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-5 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#18124A]">
          {label}
        </p>
        <p className="mt-1 text-xs leading-6 text-slate-500">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#5145E5]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-7 border-b border-slate-100 pb-5">
        <h2 className="text-xl font-extrabold text-[#18124A]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function SaveButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145E5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4034C8] disabled:opacity-60"
    >
      {loading ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : (
        <Save size={17} />
      )}
      {loading ? "Saving..." : "Save Changes"}
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("account");
  const [account, setAccount] = useState(INITIAL_ACCOUNT);
  const [preferences, setPreferences] = useState(
    INITIAL_PREFERENCES
  );

  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateAccount = (field, value) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
  };

  const updatePreference = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await workerSettingsApi.get();

      setAccount({
        ...INITIAL_ACCOUNT,
        ...data.account,
      });

      setPreferences({
        ...INITIAL_PREFERENCES,
        ...data.preferences,
        minimum_salary:
          data.preferences?.minimum_salary ?? "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/signin", { replace: true });
        return;
      }

      setError(
        err.response?.data?.detail ||
          "Unable to load your settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [tab]);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await workerSettingsApi.update({
        account,
        preferences: {
          ...preferences,
          minimum_salary:
            preferences.minimum_salary === ""
              ? null
              : preferences.minimum_salary,
        },
      });

      setAccount(data.account);
      setPreferences({
        ...INITIAL_PREFERENCES,
        ...data.preferences,
        minimum_salary:
          data.preferences?.minimum_salary ?? "",
      });

      setSuccess("Your settings have been saved successfully.");
    } catch (err) {
      const data = err.response?.data;

      setError(
        data?.detail ||
          JSON.stringify(data || {}) ||
          "Unable to save your settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await workerSettingsApi.changePassword(
        password
      );

      setPassword({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setSuccess(data.message || "Password updated.");
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data || {}) ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  const requestDeletion = async () => {
    if (!confirmDelete) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data } =
        await workerSettingsApi.requestDeletion(deleteReason);

      setSuccess(data.message);
      setConfirmDelete(false);
      setDeleteReason("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to submit deletion request."
      );
    } finally {
      setSaving(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");

    navigate("/signin", { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-[#5145E5]">
            <Settings2 size={14} />
            Worker Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#18124A] sm:text-4xl">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your Quantahire account, career preferences,
            and notifications.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[265px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex gap-1 overflow-x-auto lg:flex-col">
              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition lg:w-full ${
                      active
                        ? "bg-[#5145E5] text-white"
                        : "text-slate-600 hover:bg-indigo-50 hover:text-[#5145E5]"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 space-y-5">
            {error && (
              <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {success && (
              <div role="status" className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-teal-800">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl bg-white">
                <LoaderCircle
                  size={32}
                  className="animate-spin text-[#5145E5]"
                />
              </div>
            ) : (
              <>
                {tab === "account" && (
                  <Section
                    title="Personal Information"
                    description="Update your account details and contact information."
                  >
                    <form onSubmit={saveSettings} className="space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="First Name"
                          value={account.first_name}
                          onChange={(e) =>
                            updateAccount(
                              "first_name",
                              e.target.value
                            )
                          }
                        />
                        <Field
                          label="Last Name"
                          value={account.last_name}
                          onChange={(e) =>
                            updateAccount(
                              "last_name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <Field
                        label="Email Address"
                        type="email"
                        required
                        value={account.email}
                        onChange={(e) =>
                          updateAccount("email", e.target.value)
                        }
                        hint="Used for account communication and job notifications."
                      />
                      <SaveButton loading={saving} />
                    </form>
                  </Section>
                )}

                {tab === "preferences" && (
                  <Section
                    title="Job Preferences"
                    description="Personalize the opportunities you want to discover."
                  >
                    <form onSubmit={saveSettings} className="space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="Preferred Job Title"
                          placeholder="e.g. AI Engineer"
                          value={preferences.preferred_job_title}
                          onChange={(e) =>
                            updatePreference(
                              "preferred_job_title",
                              e.target.value
                            )
                          }
                        />
                        <Field
                          label="Preferred Location"
                          placeholder="e.g. Nairobi, Kenya"
                          value={preferences.preferred_location}
                          onChange={(e) =>
                            updatePreference(
                              "preferred_location",
                              e.target.value
                            )
                          }
                        />
                        <SelectField
                          label="Work Arrangement"
                          value={preferences.remote_preference}
                          onChange={(e) =>
                            updatePreference(
                              "remote_preference",
                              e.target.value
                            )
                          }
                          options={[
                            { value: "any", label: "Any" },
                            { value: "remote", label: "Remote" },
                            { value: "hybrid", label: "Hybrid" },
                            { value: "onsite", label: "On-site" },
                          ]}
                        />
                        <SelectField
                          label="Employment Type"
                          value={preferences.employment_type}
                          onChange={(e) =>
                            updatePreference(
                              "employment_type",
                              e.target.value
                            )
                          }
                          options={[
                            { value: "any", label: "Any" },
                            { value: "full_time", label: "Full-time" },
                            { value: "part_time", label: "Part-time" },
                            { value: "contract", label: "Contract" },
                            { value: "internship", label: "Internship" },
                          ]}
                        />
                        <Field
                          label="Minimum Salary"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g. 50000"
                          value={preferences.minimum_salary}
                          onChange={(e) =>
                            updatePreference(
                              "minimum_salary",
                              e.target.value
                            )
                          }
                        />
                        <SelectField
                          label="Salary Currency"
                          value={preferences.salary_currency}
                          onChange={(e) =>
                            updatePreference(
                              "salary_currency",
                              e.target.value
                            )
                          }
                          options={[
                            { value: "USD", label: "USD" },
                            { value: "KES", label: "KES" },
                            { value: "EUR", label: "EUR" },
                            { value: "GBP", label: "GBP" },
                          ]}
                        />
                      </div>
                      <SaveButton loading={saving} />
                    </form>
                  </Section>
                )}

                {tab === "notifications" && (
                  <Section
                    title="Notification Preferences"
                    description="Choose which updates you want to receive."
                  >
                    <form onSubmit={saveSettings}>
                      <Toggle
                        label="Job Alerts"
                        description="Receive notifications about new opportunities matching your interests."
                        checked={preferences.job_alerts}
                        onChange={(value) =>
                          updatePreference("job_alerts", value)
                        }
                      />
                      <Toggle
                        label="Application Updates"
                        description="Receive updates about your job applications."
                        checked={preferences.application_updates}
                        onChange={(value) =>
                          updatePreference(
                            "application_updates",
                            value
                          )
                        }
                      />
                      <Toggle
                        label="Product Emails"
                        description="Receive Quantahire product news and feature announcements."
                        checked={preferences.product_emails}
                        onChange={(value) =>
                          updatePreference("product_emails", value)
                        }
                      />
                      <div className="mt-6">
                        <SaveButton loading={saving} />
                      </div>
                    </form>
                  </Section>
                )}

                {tab === "security" && (
                  <Section
                    title="Change Password"
                    description="Keep your account secure with a strong password."
                  >
                    <form onSubmit={changePassword} className="max-w-xl space-y-5">
                      <Field
                        label="Current Password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={password.current_password}
                        onChange={(e) =>
                          setPassword((p) => ({
                            ...p,
                            current_password: e.target.value,
                          }))
                        }
                      />
                      <Field
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={password.new_password}
                        onChange={(e) =>
                          setPassword((p) => ({
                            ...p,
                            new_password: e.target.value,
                          }))
                        }
                      />
                      <Field
                        label="Confirm New Password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={password.confirm_password}
                        onChange={(e) =>
                          setPassword((p) => ({
                            ...p,
                            confirm_password: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5145E5]"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        {showPassword ? "Hide Passwords" : "Show Passwords"}
                      </button>
                      <div>
                        <SaveButton loading={saving} />
                      </div>
                    </form>
                  </Section>
                )}

                {tab === "danger" && (
                  <Section
                    title="Account Management"
                    description="Manage account access and request account deletion."
                  >
                    <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-bold text-[#18124A]">
                          Sign Out
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          End your current session.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={signOut}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <LogOut size={17} />
                        Sign Out
                      </button>
                    </div>

                    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
                      <h3 className="flex items-center gap-2 font-bold text-red-700">
                        <Trash2 size={18} />
                        Request Account Deletion
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Submit a request for your account and associated
                        data to be reviewed for deletion. Submitting
                        this request does not immediately delete
                        your account.
                      </p>

                      <textarea
                        value={deleteReason}
                        onChange={(e) =>
                          setDeleteReason(e.target.value)
                        }
                        maxLength={2000}
                        rows={3}
                        placeholder="Reason for deletion (optional)"
                        className="mt-4 w-full rounded-xl border border-red-100 bg-white p-3 text-sm outline-none focus:border-red-300"
                      />

                      <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={confirmDelete}
                          onChange={(e) =>
                            setConfirmDelete(e.target.checked)
                          }
                          className="mt-1 accent-red-600"
                        />
                        I understand this submits a deletion request.
                      </label>

                      <button
                        type="button"
                        disabled={!confirmDelete || saving}
                        onClick={requestDeletion}
                        className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {saving
                          ? "Submitting..."
                          : "Submit Deletion Request"}
                      </button>
                    </div>
                  </Section>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
