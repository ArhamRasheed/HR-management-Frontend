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

  console.log('🛡️ PROTECTEDROUTE - Component rendering');
  console.log('🛡️ PROTECTEDROUTE - routePath:', routePath);
  console.log('🛡️ PROTECTEDROUTE - location:', location.pathname);
  console.log('🛡️ PROTECTEDROUTE - Auth state:', { isAuthenticated, initialized, loading, user });

  const targetPath = routePath || location.pathname;
  const userDepartment = user?.department;
  const departmentReady = Boolean(userDepartment);

  console.log('🛡️ PROTECTEDROUTE - userDepartment:', userDepartment);
  console.log('🛡️ PROTECTEDROUTE - departmentReady:', departmentReady);

  const isAllowed = useMemo(() => {
    console.log('🛡️ PROTECTEDROUTE - Calculating isAllowed...');
    if (!userDepartment) {
      console.log('🛡️ PROTECTEDROUTE - No department, returning false');
      return false;
    }
    if (Array.isArray(allowedDepartments) && allowedDepartments.length > 0) {
      const allowed = allowedDepartments.includes(userDepartment);
      console.log('🛡️ PROTECTEDROUTE - Checking allowedDepartments:', allowedDepartments, 'result:', allowed);
      return allowed;
    }
    const canAccess = canAccessRoute(targetPath, userDepartment);
    console.log('🛡️ PROTECTEDROUTE - canAccessRoute result:', canAccess);
    return canAccess;
  }, [allowedDepartments, targetPath, userDepartment]);

  console.log('🛡️ PROTECTEDROUTE - Final isAllowed:', isAllowed);

  useEffect(() => {
    console.log('🛡️ ProtectedRoute Debug:', {
      isAuthenticated,
      initialized,
      loading,
      user,
      userDepartment,
      departmentReady,
      isAllowed,
      targetPath
    });
    if (isAuthenticated && initialized && !loading && departmentReady && !isAllowed) {
      setToastMessage("You don't have permission to access this page");
    } else {
      setToastMessage("");
    }
  }, [isAllowed, isAuthenticated, initialized, loading, departmentReady]);

  if (!initialized || loading || !departmentReady) {
    console.log('🛡️ PROTECTEDROUTE - Rendering AppLoader', { initialized, loading, departmentReady });
    return <AppLoader message="verifying" />;
  }

  if (!isAuthenticated) {
    console.log('🛡️ PROTECTEDROUTE - Not authenticated, redirecting to login');
    return (
      <Navigate
        to={ROUTE_PATHS.PUBLIC.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!isAllowed) {
    console.log('🛡️ PROTECTEDROUTE - Not allowed, redirecting to dashboard');
    return (
      <>
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
        <Navigate to={ROUTE_PATHS.PROTECTED.HR_DASHBOARD} replace />
      </>
    );
  }

  console.log('🛡️ PROTECTEDROUTE - All checks passed, rendering children');
  return children;
}


