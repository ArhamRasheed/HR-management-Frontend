import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Payroll domain API service.
 */
export const payrollService = {
  /**
   * Fetch payroll history.
   *
   * @returns {Promise<object>} API response containing payroll history.
   */
  getPayrollHistory: async () => {
    const response = await request(API_ENDPOINTS.payroll.history(), {
      method: "GET",
      credentials: "include",
    });
    return response;
  },
  /**
   * Generate payroll for a specific month and year.
   *
   * @param {number} month - Month number (1-12).
   * @param {number} year - Year (YYYY).
   * @returns {Promise<object>} API response containing generated payrolls.
   */
  generatePayroll: async (month, year) => {
    const response = await request(
      `${API_ENDPOINTS.payroll.generate()}?month=${month}&year=${year}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return response;
  },
};

