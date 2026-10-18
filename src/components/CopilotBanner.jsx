import { Bot, Check } from "lucide-react";

import { DISPLAY_FONT } from "./Navbar";

export default function CopilotBanner({ onActivate, busy = false, subscribed = false, className = "" }) {
  if (subscribed) return null;

  return (
    <aside className={`rounded-3xl bg-[#10162F] p-6 text-white ${className}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14E0C8]/15 text-[#14E0C8]">
        <Bot size={22} />
      </div>
      <h2 className={`${DISPLAY_FONT} mt-5 text-2xl font-bold leading-tight`}>
        Stop applying to hundreds of jobs by hand
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The Quantum Talent Copilot tailors your resume to each role and submits
        applications in the background.
      </p>

      <ul className="mt-5 space-y-2 text-sm text-slate-200">
        {["Resume tailored per job", "Applies while you're busy", "Every application on your board"].map((item) => (
          <li key={item} className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-[#14E0C8]" />
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onActivate}
        disabled={busy}
        className="mt-6 w-full rounded-xl bg-[#14E0C8] px-4 py-3 text-sm font-extrabold text-[#10162F] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14E0C8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10162F] disabled:opacity-60"
      >
        {busy ? "Opening checkout…" : "Activate auto-apply, $9.99 for 7 days"}
      </button>
      <p className="mt-2.5 text-xs leading-5 text-slate-400">
        Then $39.99/month from day 8. Cancel anytime.
      </p>

      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">
        Pay by card, M-Pesa or mobile money, secured by Paystack.
      </p>
    </aside>
  );
}