import { useState } from "react";
import { Outlet } from "react-router-dom";

import CompanySidebar from "../company/CompanySidebar";
import CompanyTopbar from "../company/CompanyTopbar";

export default function CompanyLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <CompanySidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <CompanyTopbar onMenuClick={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>

        <footer className="mx-auto flex max-w-[1600px] flex-col justify-between gap-2 border-t border-slate-200 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Quantahire. Connecting talent with
            opportunity.
          </p>

          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-[#147C91]">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#147C91]">
              Terms
            </a>
            <a href="/contact" className="hover:text-[#147C91]">
              Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}