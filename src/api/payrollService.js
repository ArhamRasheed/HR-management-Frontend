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
};

