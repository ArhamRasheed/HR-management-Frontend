/**
 * Centralized registry of backend API endpoints.
 * Keep this in sync with Django's `urls.py` definitions.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Structured collection of API endpoints grouped by domain.
 * Prefer using the provided helper functions over hard-coded strings.
 */
export const API_ENDPOINTS = {
  auth: {
    /**
     * Authenticate user credentials and begin a session.
     * @returns {string} Login endpoint.
     */
    login: () => "/api/login/",
    /**
     * Terminate the current session.
     * @returns {string} Logout endpoint.
     */
    logout: () => "/api/logout/",
    /**
     * Validate the active session and fetch the authenticated user.
     * @returns {string} Session verification endpoint.
     */
    session: () => "/api/check-session/",
  },
  employees: {
    /**
     * Fetch the employee collection with optional filters.
     * @returns {string} Employee list endpoint.
     */
    list: () => "/api/employees/all/",
    /**
     * Retrieve a single employee record.
     * @returns {string} Employee detail endpoint.
     */
    detail: () => "/api/employees/",
    /**
     * Invite a new employee to the organisation.
     * @returns {string} Employee invitation endpoint.
     */
    invite: () => "/api/employees/invite/",
    /**
     * Update onboarding state for a specific employee.
     * @param {number|string} id - Employee identifier.
     * @returns {string} Employee onboarding endpoint.
     */
    onboarding: (id) => `/api/employees/${id}/onboarding/`,
    /**
     * Update an employee record.
     * @param {number|string} id - Employee identifier.
     * @returns {string} Employee update endpoint.
     */
    update: (id) => `/api/employees/${id}/update/`,
    /**
     * Delete an employee record.
     * @param {number|string} id - Employee identifier.
     * @returns {string} Employee deletion endpoint.
     */
    delete: (id) => `/api/employees/${id}/delete/`,
    /**
     * Hire a candidate as an employee.
     * @returns {string} Employee hire endpoint.
     */
    hire: () => "/api/employees/hire/",
  },
  departments: {
    /**
     * Retrieve all departments.
     * @returns {string} Departments list endpoint.
     */
    list: () => "/api/departments/",
    /**
     * Create a new department.
     * @returns {string} Department creation endpoint.
     */
    create: () => "/api/departments/add/",
    /**
     * Update an existing department.
     * @param {string} departmentName - Department name (used in URL path).
     * @returns {string} Department update endpoint.
     */
    update: (departmentName) =>
      `/api/departments/${encodeURIComponent(departmentName)}/update/`,
    /**
     * Delete a department record.
     * @param {number|string} id - Department identifier.
     * @returns {string} Department deletion endpoint.
     */
    delete: (id) => `/api/departments/delete/${id}/`,
  },
  designations: {
    /**
     * Fetch the designations index.
     * @returns {string} Designations list endpoint.
     */
    list: () => "/api/designations/",
    /**
     * Create a new designation entry.
     * @returns {string} Designation creation endpoint.
     */
    create: () => "/api/designations/add/",
    /**
     * Update a designation entry.
     * @param {string} designationName - Designation name (used in URL path).
     * @returns {string} Designation update endpoint.
     */
    update: (designationName) =>
      `/api/designations/${encodeURIComponent(designationName)}/update/`,
    /**
     * Remove a designation entry.
     * @param {number|string} id - Designation identifier.
     * @returns {string} Designation deletion endpoint.
     */
    delete: (id) => `/api/designations/delete/${id}/`,
  },
  recruitment: {
    /**
     * Retrieve candidate submissions.
     * @returns {string} Candidates list endpoint.
     */
    candidates: () => "/api/recruitment/candidates/",
    /**
     * Fetch shortlisted candidates.
     * @returns {string} Shortlisted candidates endpoint.
     */
    shortlisted: () => "/api/shortlisted-candidates/",
    /**
     * Fetch all interviewed candidates.
     * @returns {string} Interviewed candidates endpoint.
     */
    interviewed: () => "/api/interviewed-candidates/",
    /**
     * Update candidate status.
     * @returns {string} Candidate status update endpoint.
     */
    update: () => "/api/update_candidate/",
    /**
     * Add a new interviewed candidate.
     * @returns {string} Add candidate endpoint.
     */
    add: () => "/api/add_candidate/",
    /**
     * Fetch allowed roles/positions for a department.
     * @param {number|string} departmentId - Department identifier.
     * @returns {string} Allowed roles endpoint.
     */
    allowedRoles: (departmentId) =>
      `/api/allowed-roles/?department_id=${departmentId}`,
    /**
     * Fetch a single candidate profile.
     * @param {number|string} id - Candidate identifier.
     * @returns {string} Candidate detail endpoint.
     */
    candidateDetail: (id) => `/api/recruitment/candidates/${id}/`,
    /**
     * Hire or convert a candidate into an employee.
     * @param {number|string} id - Candidate identifier.
     * @returns {string} Candidate hire endpoint.
     */
    hire: (id) => `/api/recruitment/candidates/${id}/hire/`,
  },
  payroll: {
    /**
     * Trigger a new payroll generation run.
     * @returns {string} Payroll generation endpoint.
     */
    run: () => "/api/payroll/generate/",
    /**
     * Generate payroll for employees for a specific month and year.
     * @returns {string} Payroll generation endpoint with query parameters.
     */
    generate: () => "/api/payroll-generate/employee/",
    /**
     * Retrieve payroll history entries.
     * @returns {string} Payroll history endpoint.
     */
    history: () => "/api/payroll-history/",
    /**
     * Fetch payroll details for a specific cycle.
     * @param {number|string} id - Payroll identifier.
     * @returns {string} Payroll detail endpoint.
     */
    detail: (id) => `/api/payroll/${id}/`,
  },
  dashboard: {
    /**
     * Fetch dashboard overview data for HR.
     * @returns {string} Dashboard overview endpoint.
     */
    overview: () => "/api/dashboard/",
  },
  reports: {
    /**
     * Retrieve the executive dashboard summary.
     * @returns {string} Reports summary endpoint.
     */
    summary: () => "/api/reports/summary/",
    /**
     * Fetch headcount analytics.
     * @returns {string} Headcount report endpoint.
     */
    headcount: () => "/api/reports/headcount/",
    /**
     * Download or preview payroll-specific reports.
     * @returns {string} Payroll report endpoint.
     */
    payroll: () => "/api/reports/payroll/",
  },
  attendance: {
    /**
     * View attendance records.
     * @returns {string} Attendance view endpoint.
     */
    view: () => "/api/attendance/view/",
  },
  complaints: {
    /**
     * Fetch all complaints.
     * @returns {string} Complaints list endpoint.
     */
    all: () => "/api/complain/all/",
    /**
     * Update complaint status.
     * @param {number} id - The complaint ID.
     * @returns {string} Complaint update endpoint.
     */
    update: (id) => `/api/complain/${id}/update/`,
    /**
     * Delete a complaint.
     * @param {number} id - The complaint ID.
     * @returns {string} Complaint delete endpoint.
     */
    delete: (id) => `/api/complain/${id}/delete/`,
    /**
     * Add a new complaint.
     * @returns {string} Complaint add endpoint.
     */
    add: () => "/api/add_complain/",
  },
};

export default API_ENDPOINTS;
