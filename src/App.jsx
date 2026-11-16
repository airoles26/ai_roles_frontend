
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import CompanyLayout from "./components/layouts/CompanyLayout";
import WorkerLayout from "./components/layouts/WorkerLayout";
import MainLayout from "./layouts/MainLayout";

// Route protection
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import RequireAuth from "./components/RequireAuth";

// Public pages
import Home from "./pages/Home";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import About from "./pages/About";
import Enterprise from "./pages/Enterprise";
import Copilot from "./pages/Copilot";
import LinkedInCallback from "./pages/LinkedInCallback";
import Plans from "./pages/Plans";
import MySubscription from "./pages/MySubscription";
import PaymentCallback from "./pages/PaymentCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Authentication
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";

// Employer pages
import CompanyDashboard from "./pages/company/Dashboard";
import PostJob from "./pages/company/PostJob";
import Applicants from "./pages/company/Applicants";
import Analytics from "./pages/company/Analytics";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanySettings from "./pages/company/CompanySettings";

// Job seeker pages
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import MyApplications from "./pages/worker/MyApplications";
import QuantumMatches from "./pages/worker/QuantumMatches";
import WorkerProfile from "./pages/worker/WorkerProfile";
import FindJobs from "./pages/worker/FindJobs";
import FindJobDetails from "./pages/worker/FindJobDetails";
import SavedJobs from "./pages/worker/SavedJobs";
import AutoApply from "./pages/worker/AutoApply";
import Settings from "./pages/worker/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC WEBSITE
            Accessible without authentication
        ========================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />

          <Route path="/home" element={<Home />} />

          <Route path="/jobs" element={<Jobs />} />

          <Route path="/about" element={<About />} />

          <Route path="/enterprise" element={<Enterprise />} />

          <Route path="/copilot" element={<Copilot />} />

          <Route path="/plans" element={<Plans />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />

          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected job details */}
          <Route
            path="/jobs/:slug"
            element={
              <RequireAuth>
                <JobDetails />
              </RequireAuth>
            }
          />

          {/* Protected subscription page */}
          <Route
            path="/subscription"
            element={
              <RequireAuth
                allowedRoles={["employer", "job_seeker"]}
              >
                <MySubscription />
              </RequireAuth>
            }
          />
        </Route>

        {/* =========================================
            AUTHENTICATION
        ========================================= */}
        <Route path="/signup" element={<Signup />} />

        <Route path="/signin" element={<Signin />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/auth/linkedin/callback"
          element={<LinkedInCallback />}
        />

        {/* Payment callback handles its own
            payment/session verification */}
        <Route
          path="/payment/callback"
          element={<PaymentCallback />}
        />

        {/* =========================================
            EMPLOYER ROUTES
            Only role = employer
        ========================================= */}
        <Route
          element={
            <RoleProtectedRoute
              allowedRoles={["employer"]}
            />
          }
        >
          <Route
            path="/company"
            element={<CompanyLayout />}
          >
            <Route
              index
              element={
                <Navigate to="dashboard" replace />
              }
            />

            <Route
              path="dashboard"
              element={<CompanyDashboard />}
            />

            <Route
              path="jobs/new"
              element={<PostJob />}
            />

            <Route
              path="plans"
              element={<Plans />}
            />

            <Route
              path="subscription"
              element={<MySubscription />}
            />

            <Route
              path="applicants"
              element={<Applicants />}
            />

            <Route
              path="analytics"
              element={<Analytics />}
            />

            <Route
              path="company-profile"
              element={<CompanyProfile />}
            />

            <Route
              path="settings"
              element={<CompanySettings />}
            />
          </Route>
        </Route>

        {/* =========================================
            JOB SEEKER ROUTES
            Only role = job_seeker
        ========================================= */}
        <Route
          element={
            <RoleProtectedRoute
              allowedRoles={["job_seeker"]}
            />
          }
        >
          <Route
            path="/worker"
            element={<WorkerLayout />}
          >
            <Route
              index
              element={
                <Navigate to="dashboard" replace />
              }
            />

            <Route
              path="dashboard"
              element={<WorkerDashboard />}
            />

            <Route
              path="applications"
              element={<MyApplications />}
            />

            <Route
              path="find-jobs"
              element={<FindJobs />}
            />

            <Route
              path="find-jobs/:slug"
              element={<FindJobDetails />}
            />

            <Route
              path="quantum-matches"
              element={<QuantumMatches />}
            />

            <Route
              path="profile"
              element={<WorkerProfile />}
            />

            <Route
              path="saved-jobs"
              element={<SavedJobs />}
            />

            <Route
              path="auto-apply"
              element={<AutoApply />}
            />

            <Route
              path="subscription"
              element={<MySubscription />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />
          </Route>
        </Route>

        {/* =========================================
            UNKNOWN ROUTES
        ========================================= */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
