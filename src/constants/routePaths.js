/**
 * Frontend route path definitions grouped by access level.
 */
export const ROUTE_PATHS = Object.freeze({
  PUBLIC: {
    ROOT: "/",
    LOGIN: "/login",
    SUPPORT: "/support",
  },
  PROTECTED: {
    HR_DASHBOARD: "/hr-dashboard",
    DEPARTMENTS: "/departments",
    DESIGNATIONS: "/designations",
    EMPLOYEES: "/employees",
    EMPLOYEE_DETAIL: (id = ":id") => `/employees/${id}`,
    ATTENDANCE: "/attendance",
    COMPLAINTS: "/complaints",
    CANDIDATES: "/recruitment/candidates",
    RECRUITMENT: "/recruitment",
    PAYROLL: "/payroll",
    PAYROLL_RUN: "/payroll/run",
    PAYROLL_HISTORY: "/payroll/history",
    REPORTS: "/reports",
    LEAVES: "/leaves",
    PROFILE: "/profile",
    CONTACT: "/contact",
    ABOUT: "/about",
    BENCHMARK: "/benchmark",
  },
});

export default ROUTE_PATHS;


