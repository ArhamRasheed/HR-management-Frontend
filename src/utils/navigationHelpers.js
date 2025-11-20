import { ROUTE_PATHS } from "../constants/routePaths";
import { DEPARTMENTS, canAccessRoute } from "../constants/permissions";

const NAV_ITEMS = [
  { key: "DASHBOARD", label: "Dashboard", path: ROUTE_PATHS.PROTECTED.DASHBOARD },
  { key: "EMPLOYEES", label: "Employees", path: ROUTE_PATHS.PROTECTED.EMPLOYEES },
  { key: "CANDIDATES", label: "Candidates", path: ROUTE_PATHS.PROTECTED.CANDIDATES },
  { key: "DEPARTMENTS", label: "Departments", path: ROUTE_PATHS.PROTECTED.DEPARTMENTS },
  { key: "DESIGNATIONS", label: "Designations", path: ROUTE_PATHS.PROTECTED.DESIGNATIONS },
  { key: "REPORTS", label: "Reports", path: ROUTE_PATHS.PROTECTED.REPORTS },
  { key: "PAYROLL", label: "Payroll", path: ROUTE_PATHS.PROTECTED.PAYROLL_HISTORY },
  { key: "PROFILE", label: "My Profile", path: ROUTE_PATHS.PROTECTED.PROFILE },
];

/**
 * Return the navigation items that the provided department can access.
 *
 * @param {string} userDepartment - Department from the user object (e.g., "HR", "Finance", "IT").
 * @returns {{ key: string, label: string, path: string }[]} Accessible links.
 */
export function getAccessibleRoutes(userDepartment) {
  if (!userDepartment) {
    return [];
  }
  return NAV_ITEMS.filter((item) => canAccessRoute(item.path, userDepartment));
}

/**
 * Check if the provided department may access the given route.
 *
 * @param {string} routePath - Route path constant.
 * @param {string} userDepartment - Department from the user object (e.g., "HR", "Finance", "IT").
 * @returns {boolean} True when accessible.
 */
export function canAccess(routePath, userDepartment) {
  return canAccessRoute(routePath, userDepartment);
}

/**
 * Resolve the best landing route after login for the provided department.
 *
 * @param {string} userDepartment - Department from the user object (e.g., "HR", "Finance", "IT").
 * @returns {string} Route path constant.
 */
export function getDefaultRoute(userDepartment) {
  switch (userDepartment) {
    case DEPARTMENTS.HR:
      return ROUTE_PATHS.PROTECTED.DASHBOARD;
    case DEPARTMENTS.FINANCE:
      return ROUTE_PATHS.PROTECTED.EMPLOYEES;
    case DEPARTMENTS.IT:
    case DEPARTMENTS.OPERATIONS:
      return ROUTE_PATHS.PROTECTED.PAYROLL_HISTORY;
    default:
      return ROUTE_PATHS.PROTECTED.DASHBOARD;
  }
}


