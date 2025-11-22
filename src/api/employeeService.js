import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Service for employee-related API calls.
 */
export const employeeService = {
  /**
   * Fetch all employees.
   * @returns {Promise<{employees: Array}>}
   */
  fetchEmployees: () =>
    request(API_ENDPOINTS.employees.list(), {
      method: "GET",
      credentials: "include",
    }),

  /**
   * Fetch single employee details.
   * @param {number} employeeId - Employee ID.
   * @returns {Promise<object>}
   */
  fetchEmployeeDetail: (employeeId) =>
    request(`${API_ENDPOINTS.employees.detail()}?employee_id=${employeeId}`, {
      method: "GET",
      credentials: "include",
    }),

  /**
   * Update an employee field.
   * @param {number} employeeId - Employee ID.
   * @param {string} fieldToUpdate - Field name to update (phone, designation, status, salary).
   * @param {string|number} newValue - New value for the field.
   * @returns {Promise<object>}
   */
  updateEmployee: (employeeId, fieldToUpdate, newValue) =>
    request(API_ENDPOINTS.employees.update(employeeId), {
      method: "PUT",
      credentials: "include",
      body: {
        to_update: fieldToUpdate,
        new_val: newValue,
      },
    }),

  /**
   * Delete an employee.
   * @param {number} employeeId - Employee ID.
   * @returns {Promise<object>}
   */
  deleteEmployee: (employeeId) =>
    request(API_ENDPOINTS.employees.delete(employeeId), {
      method: "DELETE",
      credentials: "include",
    }),

  /**
   * Hire a candidate as an employee.
   * @param {number} candidateId - Candidate ID.
   * @returns {Promise<object>}
   */
  hireEmployee: (candidateId) =>
    request(API_ENDPOINTS.employees.hire(), {
      method: "POST",
      credentials: "include",
      body: {
        candidate_id: candidateId,
      },
    }),
};
