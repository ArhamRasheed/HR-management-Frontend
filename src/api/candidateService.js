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
};

