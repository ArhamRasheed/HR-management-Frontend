import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROUTE_PATHS } from "../constants/routePaths";
import { DEPARTMENTS } from "../constants/permissions";
import LoginPage from "../../pages/LoginPage";
import HRDashboard from "../../pages/HRDashboard";
import Contact from "../../pages/Contact";
import About from "../../pages/About";
import DepartmentsPage from "../../pages/DepartmentsPage";
import DesignationsPage from "../../pages/DesignationsPage";
import EmployeesPage from "../../pages/EmployeesPage";
import AttendancePage from "../../pages/AttendancePage";
import ComplaintsPage from "../../pages/ComplaintsPage";
import CandidatesPage from "../../pages/CandidatesPage";
import PayrollPage from "../../pages/PayrollPage";
import ReportsPage from "../../pages/ReportsPage";
import LeavesPage from "../../pages/LeavesPage";
import BenchmarkPage from "../../pages/BenchmarkPage";

const { PUBLIC, PROTECTED } = ROUTE_PATHS;

const AuthenticationRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path={PUBLIC.ROOT}
        element={
          <Navigate
            to={isAuthenticated ? PROTECTED.HR_DASHBOARD : PUBLIC.LOGIN}
            replace
          />
        }
      />
      <Route
        path={PUBLIC.LOGIN}
        element={
          !isAuthenticated ? (
            <LoginPage />
          ) : (
            <Navigate to={PROTECTED.HR_DASHBOARD} replace />
          )
        }
      />
      <Route
        path={PUBLIC.SUPPORT}
        element={<PublicInfoPage title="Support" description="Contact HR support for assistance." />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? PROTECTED.HR_DASHBOARD : PUBLIC.LOGIN}
            replace
          />
        }
      />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Redirect legacy /dashboard path to /hr-dashboard */}
      <Route
        path="/dashboard"
        element={<Navigate to={PROTECTED.HR_DASHBOARD} replace />}
      />
      <Route
        path={PROTECTED.HR_DASHBOARD}
        element={
          <ProtectedRoute routePath={PROTECTED.HR_DASHBOARD}>
            <HRDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={PUBLIC.ROOT}
        element={<Navigate to={PROTECTED.HR_DASHBOARD} replace />}
      />

      <Route
        path={PROTECTED.CONTACT}
        element={
          <ProtectedRoute routePath={PROTECTED.CONTACT}>
            <Contact />
          </ProtectedRoute>
        }
      />

      <Route
        path={PROTECTED.ABOUT}
        element={
          <ProtectedRoute routePath={PROTECTED.ABOUT}>
            <About />
          </ProtectedRoute>
        }
      />

      {user?.department === DEPARTMENTS.HR && (
        <>
          <Route
            path={PROTECTED.DEPARTMENTS}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.DEPARTMENTS}
              >
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.DESIGNATIONS}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.DESIGNATIONS}
              >
                <DesignationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.ATTENDANCE}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.ATTENDANCE}
              >
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.COMPLAINTS}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.COMPLAINTS}
              >
                <ComplaintsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.CANDIDATES}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.CANDIDATES}
              >
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.PAYROLL}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.PAYROLL}
              >
                <PayrollPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.RECRUITMENT}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.RECRUITMENT}
              >
                <ComingSoonPage title="Recruitment Hub" />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.PAYROLL_RUN}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR]}
                routePath={PROTECTED.PAYROLL_RUN}
              >
                <ComingSoonPage title="Payroll Generation" />
              </ProtectedRoute>
            }
          />
        </>
      )}

      {[DEPARTMENTS.HR, DEPARTMENTS.FINANCE].includes(user?.department) && (
        <>
          <Route
            path={PROTECTED.EMPLOYEES}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR, DEPARTMENTS.FINANCE]}
                routePath={PROTECTED.EMPLOYEES}
              >
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.CANDIDATES}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR, DEPARTMENTS.FINANCE]}
                routePath={PROTECTED.CANDIDATES}
              >
                <ComingSoonPage title="Candidate Pipeline" />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROTECTED.REPORTS}
            element={
              <ProtectedRoute
                allowedDepartments={[DEPARTMENTS.HR, DEPARTMENTS.FINANCE]}
                routePath={PROTECTED.REPORTS}
              >
                <ReportsPage />
              </ProtectedRoute>
            }
          />
        </>
      )}

      {user?.department === DEPARTMENTS.HR && (
        <Route
          path={PROTECTED.LEAVES}
          element={
            <ProtectedRoute
              allowedDepartments={[DEPARTMENTS.HR]}
              routePath={PROTECTED.LEAVES}
            >
              <LeavesPage />
            </ProtectedRoute>
          }
        />
      )}

      <Route
        path={PROTECTED.PAYROLL_HISTORY}
        element={
          <ProtectedRoute routePath={PROTECTED.PAYROLL_HISTORY}>
            <ComingSoonPage title="Payroll History" />
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED.BENCHMARK}
        element={
          <ProtectedRoute routePath={PROTECTED.BENCHMARK}>
            <BenchmarkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={PROTECTED.PROFILE}
        element={
          <ProtectedRoute routePath={PROTECTED.PROFILE}>
            <ComingSoonPage title="My Profile" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={PROTECTED.HR_DASHBOARD} replace />} />
    </Routes>
  );
};

export default function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);


  return <BrowserRouter>{isAuthenticated ? <ProtectedRoutes /> : <AuthenticationRoutes />}</BrowserRouter>;
}

const ComingSoonPage = ({ title }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-6">
    <div className="bg-white/80 backdrop-blur shadow-lg rounded-3xl p-10 text-center max-w-xl border border-white/60">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
        Coming Soon
      </p>
      <h1 className="mt-4 text-3xl font-black text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-600">
        This module is on the delivery roadmap. Once it is wired up, department-based access control will
        apply automatically.
      </p>
    </div>
  </div>
);

const PublicInfoPage = ({ title, description }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 px-6">
    <div className="bg-white/90 rounded-3xl shadow-xl border border-white/70 max-w-lg w-full p-10 text-center space-y-4">
      <h1 className="text-3xl font-black text-gray-900">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);


