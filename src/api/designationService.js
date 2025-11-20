import { request } from "./config";

/**
 * Designation domain API service mirroring the department service contract.
 */
export const designationService = {
  /**
   * Fetch all designations.
   *
   * @returns {Promise<object>} API response containing designations.
   */
  fetchDesignations() {
    return request("/api/designations/", {
      method: "GET",
    });
  },

  /**
   * Create a new designation.
   *
   * @param {{ name: string }} payload - Designation payload.
   * @returns {Promise<object>} API response.
   */
  addDesignation(payload) {
    return request("/api/designations/add/", {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Update an existing designation.
   *
   * @param {number|string} id - Designation identifier.
   * @param {{ name: string }} payload - Updated payload.
   * @returns {Promise<object>} API response.
   */
  updateDesignation(id, payload) {
    return request(`/api/designations/update/${id}/`, {
      method: "PUT",
      body: payload,
    });
  },

  /**
   * Delete a designation by id.
   *
   * @param {number|string} id - Designation identifier.
   * @returns {Promise<object>} API response.
   */
  deleteDesignation(id) {
    return request(`/api/designations/delete/${id}/`, {
      method: "DELETE",
    });
  },
};

