import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// layouts
import CompanyLayout from "./components/layouts/CompanyLayout";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

// auth
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

// company
import CompanyDashboard from "./pages/company/Dashboard";
import PostJob from "./pages/company/PostJob";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:slug"
          element={<JobDetails />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* company */}
        <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<Navigate to="dashboard" replace />}/>
            <Route path="dashboard" element={<CompanyDashboard />}/>
            <Route path="jobs/new" element={<PostJob />} />

        </Route>




      </Routes>
    </BrowserRouter>
  );
}