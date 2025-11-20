import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Toast from "../../components/toast";
import AppLoader from "./AppLoader";
import { ROUTE_PATHS } from "../constants/routePaths";
import { DEPARTMENTS, canAccessRoute } from "../constants/permissions";

/**
 * Guard component that ensures the user is authenticated and authorized.
 *
 * @param {{
 *  children: React.ReactNode;
 *  allowedDepartments?: string[];
 *  routePath?: string;
 * }} props
 */
export default function ProtectedRoute({ children, allowedDepartments, routePath }) {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState("");

  const { isAuthenticated, user, loading, initialized } = useSelector((state) => state.auth);

  const targetPath = routePath || location.pathname;
  const userDepartment = user?.department;
  const departmentReady = Boolean(userDepartment);

  const isAllowed = useMemo(() => {
    if (!userDepartment) return false;
    if (Array.isArray(allowedDepartments) && allowedDepartments.length > 0) {
      return allowedDepartments.includes(userDepartment);
    }
    return canAccessRoute(targetPath, userDepartment);
  }, [allowedDepartments, targetPath, userDepartment]);

  useEffect(() => {
    if (isAuthenticated && initialized && !loading && departmentReady && !isAllowed) {
      setToastMessage("You don't have permission to access this page");
    } else {
      setToastMessage("");
    }
  }, [isAllowed, isAuthenticated, initialized, loading, departmentReady]);

  if (!initialized || loading || !departmentReady) {
    return <AppLoader message="verifying" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.PUBLIC.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isAllowed) {
    return (
      <>
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
        <Navigate to={ROUTE_PATHS.PROTECTED.DASHBOARD} replace />
      </>
    );
  }

  return children;
}


