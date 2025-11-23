import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Service for complaint-related API calls.
 */
export const complaintService = {
  /**
   * Fetch all complaints.
   * @returns {Promise<{complaints: Array}>}
   */
  getAllComplaints: () =>
    request(API_ENDPOINTS.complaints.all(), {
      method: "GET",
      credentials: "include",
    }),

  /**
   * Update complaint status.
   * @param {number} complaintId - The complaint ID.
   * @param {string} status - The new status (resolved or closed).
   * @returns {Promise<{message: string, complaint_id: number, new_status: string}>}
   */
  updateComplaintStatus: (complaintId, status) =>
    request(API_ENDPOINTS.complaints.update(complaintId), {
      method: "PUT",
      credentials: "include",
      body: {
        status: status,
      },
    }),

  /**
   * Delete a complaint.
   * @param {number} complaintId - The complaint ID.
   * @returns {Promise<{message: string}>}
   */
  deleteComplaint: (complaintId) =>
    request(API_ENDPOINTS.complaints.delete(complaintId), {
      method: "DELETE",
      credentials: "include",
    }),

  /**
   * Add a new complaint.
   * @param {{email: string, title: string, description: string}} complaintData - The complaint data.
   * @returns {Promise<{message: string, complaint: Object}>}
   */
  addComplaint: (complaintData) =>
    request(API_ENDPOINTS.complaints.add(), {
      method: "POST",
      credentials: "include",
      body: complaintData,
    }),
};

