import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Contact from "../pages/Contact";
import About from "../pages/About";
import DesignationsPage from "../pages/DesignationsPage";
import DepartmentsPage from "../pages/DepartmentsPage";
import { checkSession } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(checkSession());
    }
  }, [dispatch, initialized]);

  if (!initialized && loading) {
    return <AppLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard/" replace />}
        />
        <Route
          path="/dashboard/"
          element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/contact"
          element={isAuthenticated ? <Contact user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <About user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/designation"
          element={
            isAuthenticated ? <DesignationsPage user={user} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/department"
          element={
            isAuthenticated ? <DepartmentsPage user={user} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
    <div className="bg-white/80 px-10 py-8 rounded-3xl shadow-xl backdrop-blur">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-sm font-semibold text-emerald-800 tracking-wide uppercase text-center">
        Securing your session...
      </p>
    </div>
  </div>
);

export default App;
