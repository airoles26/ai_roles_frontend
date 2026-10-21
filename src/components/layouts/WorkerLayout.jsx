import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import WorkerSidebar from "../worker/WorkerSidebar";
import WorkerTopbar from "../worker/WorkerTopbar";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function WorkerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const user = useMemo(getStoredUser, [location.pathname]);

  useEffect(() => { closeSidebar(); }, [location.pathname, closeSidebar]);
  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#18124A]">
      <WorkerSidebar open={sidebarOpen} onClose={closeSidebar} user={user} />
      <div className="min-h-screen lg:pl-[272px]">
        <WorkerTopbar onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}