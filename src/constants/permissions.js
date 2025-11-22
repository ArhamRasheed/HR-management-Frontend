import { ROUTE_PATHS } from "./routePaths";

/**
 * Supported departments from the backend.
 * These match the department values returned in the user object.
 */
export const DEPARTMENTS = Object.freeze({
  HR: "HR",
  FINANCE: "Finance",
  IT: "IT",
  OPERATIONS: "Operations",
});

const { PROTECTED } = ROUTE_PATHS;

/**
 * Mapping of route paths to the departments that may access them.
 * Absence of an entry implies that all authenticated users can view the route.
 */
export const ROUTE_PERMISSIONS = {
  [PROTECTED.DEPARTMENTS]: [DEPARTMENTS.HR],
  [PROTECTED.DESIGNATIONS]: [DEPARTMENTS.HR],
  [PROTECTED.RECRUITMENT]: [DEPARTMENTS.HR],
  [PROTECTED.PAYROLL_RUN]: [DEPARTMENTS.HR],
  [PROTECTED.EMPLOYEES]: [DEPARTMENTS.HR, DEPARTMENTS.FINANCE],
  [PROTECTED.CANDIDATES]: [DEPARTMENTS.HR, DEPARTMENTS.FINANCE],
  [PROTECTED.REPORTS]: [DEPARTMENTS.HR, DEPARTMENTS.FINANCE],
  [PROTECTED.PAYROLL_HISTORY]: [
    DEPARTMENTS.HR,
    DEPARTMENTS.FINANCE,
    DEPARTMENTS.IT,
    DEPARTMENTS.OPERATIONS,
  ],
  [PROTECTED.HR_DASHBOARD]: [
    DEPARTMENTS.HR,
    DEPARTMENTS.FINANCE,
    DEPARTMENTS.IT,
    DEPARTMENTS.OPERATIONS,
  ],
  [PROTECTED.PROFILE]: [
    DEPARTMENTS.HR,
    DEPARTMENTS.FINANCE,
    DEPARTMENTS.IT,
    DEPARTMENTS.OPERATIONS,
  ],
};

/**
 * Determine if a department may access the provided route path.
 *
 * @param {string} routePath - Path taken from ROUTE_PATHS.
 * @param {string} userDepartment - Department from the user object (e.g., "HR", "Finance", "IT").
 * @returns {boolean} True when the department has access.
 */
export function canAccessRoute(routePath, userDepartment) {
  if (!routePath || !userDepartment) {
    return false;
  }

  // HR department always has access to all routes.
  if (userDepartment === DEPARTMENTS.HR) {
    return true;
  }

  const allowedDepartments = ROUTE_PERMISSIONS[routePath];
  if (!allowedDepartments || allowedDepartments.length === 0) {
    return true;
  }

  return allowedDepartments.includes(userDepartment);
}


