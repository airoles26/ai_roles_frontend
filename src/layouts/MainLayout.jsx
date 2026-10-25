
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Automatically scroll to the top when navigating between pages.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToSection = () => {
        const element = document.getElementById(
          decodeURIComponent(hash.slice(1))
        );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };

      // Wait for the page to render.
      const timeout = setTimeout(scrollToSection, 100);
      return () => clearTimeout(timeout);
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname, hash]);

  return null;
}

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />

      {/* Fixed navigation */}
      <Navbar />

      {/* Main page content */}
      <main
        id="main-content"
        className="flex-1 pt-20 sm:pt-24"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
