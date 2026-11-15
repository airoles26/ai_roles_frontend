import { useCallback, useEffect, useState } from "react";
import api from "../../api/api";

const EMPTY = {
  name: "", website: "", logo_url: "", description: "", location: "",
  country: "", industry: "", company_size: "",
};

const fields = [
  ["name", "Company name", "text", true],
  ["website", "Website URL", "url"],
  ["logo_url", "Logo image URL", "url"],
  ["industry", "Industry", "text"],
  ["company_size", "Company size", "text"],
  ["location", "City / location", "text"],
  ["country", "Country", "text"],
];

function getError(error) {
  return error?.response?.data?.message || error?.response?.data?.detail ||
    "Something went wrong. Please try again.";
}

export default function CompanyProfile() {
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createMode, setCreateMode] = useState(false);

  const selected = companies.find((company) => String(company.id) === String(selectedId));

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/employer/companies/", { signal });
      const list = data.results || [];
      setCompanies(list);
      setSelectedId((previous) => list.some((c) => String(c.id) === String(previous))
        ? previous : String(list[0]?.id || ""));
      if (!list.length) setCreateMode(true);
    } catch (err) {
      if (err.code !== "ERR_CANCELED") setError(getError(err));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    if (!createMode && selected) {
      setForm(Object.fromEntries(Object.keys(EMPTY).map((key) => [key, selected[key] || ""])));
    }
  }, [selectedId, selected, createMode]);

  const startCreate = () => {
    setCreateMode(true);
    setForm({ ...EMPTY });
    setError("");
    setNotice("");
  };

  const cancelCreate = () => {
    setCreateMode(false);
    setError("");
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = createMode
        ? await api.post("/employer/companies/", form)
        : await api.patch(`/employer/companies/${selectedId}/`, form);
      const updated = data.company;
      setCompanies((previous) => createMode
        ? [...previous, updated]
        : previous.map((c) => c.id === updated.id ? updated : c));
      setSelectedId(String(updated.id));
      setCreateMode(false);
      setNotice(data.message || "Company profile saved successfully.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Employer dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Company profile</h1>
            <p className="mt-2 text-sm text-slate-500">Manage the company information candidates see on Quantahire.</p>
          </div>
          <button type="button" onClick={startCreate}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            + Add company
          </button>
        </header>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
        {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</div>}
        {loading ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500">Loading company profiles...</div> : (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold">Your companies</h2>
                {!companies.length && <p className="text-sm text-slate-500">No company profiles yet.</p>}
                <div className="space-y-2">
                  {companies.map((company) => (
                    <button key={company.id} type="button" onClick={() => { setCreateMode(false); setSelectedId(String(company.id)); setNotice(""); }}
                      className={`w-full rounded-xl border p-3 text-left text-sm ${!createMode && String(selectedId) === String(company.id) ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <span className="block font-semibold">{company.name}</span>
                      <span className="mt-1 block text-xs text-slate-500">{company.industry || "Industry not specified"}</span>
                    </button>
                  ))}
                </div>
              </div>
              {!createMode && selected && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border bg-white p-4"><p className="text-xs text-slate-500">Total jobs</p><p className="mt-2 text-2xl font-bold">{selected.total_jobs}</p></div>
                  <div className="rounded-2xl border bg-white p-4"><p className="text-xs text-slate-500">Active jobs</p><p className="mt-2 text-2xl font-bold">{selected.active_jobs}</p></div>
                </div>
              )}
            </aside>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {!createMode && selected?.logo_url ? (
                    <img src={selected.logo_url} alt="Company logo" className="h-14 w-14 rounded-xl border object-contain" />
                  ) : <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700">{(form.name || "C").charAt(0).toUpperCase()}</div>}
                  <div><h2 className="text-xl font-bold">{createMode ? "Create company profile" : selected?.name || "Company details"}</h2>
                    {!createMode && selected && <p className="mt-1 text-xs text-slate-500">{selected.is_verified ? "Verified company" : "Not yet verified"} · {selected.is_active ? "Active" : "Inactive"}</p>}
                  </div>
                </div>
                {createMode && companies.length > 0 && <button type="button" onClick={cancelCreate} className="text-sm font-semibold text-slate-600 hover:underline">Cancel</button>}
              </div>
              <form onSubmit={save} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map(([key, label, type, required]) => (
                    <label key={key} className="block text-sm font-medium text-slate-700">
                      {label}
                      <input type={type} required={Boolean(required)} maxLength={key === "name" ? 255 : undefined}
                        value={form[key]} onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-medium text-slate-700">About the company
                  <textarea rows={7} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Describe your company, mission, culture and what makes it a great place to work..."
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500" />
                </label>
                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <button type="submit" disabled={saving || (!createMode && !selected)}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                    {saving ? "Saving..." : createMode ? "Create company" : "Save changes"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}