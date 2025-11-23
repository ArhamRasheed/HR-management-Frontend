import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Service for candidate-related API calls.
 */
export const candidateService = {
  /**
   * Fetch shortlisted candidates.
   * @returns {Promise<{candidates: Array}>}
   */
  fetchShortlistedCandidates: () =>
    request(API_ENDPOINTS.recruitment.shortlisted(), {
      method: "GET",
      credentials: "include",
    }),

  /**
   * Fetch all candidates.
   * @returns {Promise<{candidates: Array}>}
   */
  fetchCandidates: () =>
    request(API_ENDPOINTS.recruitment.candidates(), {
      method: "GET",
      credentials: "include",
    }),

  /**
   * Fetch all interviewed candidates.
   * @returns {Promise<{all_candidates: Array}>}
   */
  getAllCandidates: () =>
    request(API_ENDPOINTS.recruitment.interviewed(), {
      method: "GET",
      credentials: "include",
    }),

  /**
   * Update candidate status.
   * @param {number} candidateId - The candidate ID.
   * @param {string} status - The new status (shortlisted or rejected).
   * @returns {Promise<{message: string}>}
   */
  updateCandidateStatus: (candidateId, status) =>
    request(API_ENDPOINTS.recruitment.update(), {
      method: "PUT",
      credentials: "include",
      body: {
        candidate_id: candidateId,
        status: status,
      },
    }),

  /**
   * Add a new interviewed candidate.
   * @param {{full_name: string, email: string, phone?: string, department_id: number, position_id: number, applied_position_id: number, remarks?: string}} candidateData - The candidate data.
   * @returns {Promise<{message: string, candidate: Object}>}
   */
  addCandidate: (candidateData) =>
    request(API_ENDPOINTS.recruitment.add(), {
      method: "POST",
      credentials: "include",
      body: candidateData,
    }),

  /**
   * Fetch allowed roles/positions for a department.
   * @param {number|string} departmentId - Department identifier.
   * @returns {Promise<{roles: Array}|Array>} API response containing allowed roles/positions.
   */
  getAllowedRoles: (departmentId) =>
    request(API_ENDPOINTS.recruitment.allowedRoles(departmentId), {
      method: "GET",
      credentials: "include",
    }),
};

