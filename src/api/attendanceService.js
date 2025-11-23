import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Service for attendance-related API calls.
 */
export const attendanceService = {
  /**
   * Fetch all attendance records.
   * @returns {Promise<{attendances: Array}>}
   */
  viewAttendance: () =>
    request(API_ENDPOINTS.attendance.view(), {
      method: "GET",
      credentials: "include",
    }),
};

