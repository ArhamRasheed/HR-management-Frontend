import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Dashboard domain API service.
 */
export const dashboardService = {
  /**
   * Fetches dashboard overview data.
   *
   * @returns {Promise<{full_name: string, designation: string, ...}>} API response containing dashboard data.
   */
  fetchDashboard() {
    return request(API_ENDPOINTS.dashboard.overview(), {
      method: "GET",
    });
  },
};

