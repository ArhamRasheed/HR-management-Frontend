import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

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
    return request(API_ENDPOINTS.designations.list(), {
      method: "GET",
    });
  },

  /**
   * Fetch designations filtered by department.
   *
   * @param {number} departmentId - Department identifier.
   * @returns {Promise<object>} API response containing designations.
   */
  fetchDesignationsByDepartment(departmentId) {
    return request(`${API_ENDPOINTS.designations.list()}?department_id=${departmentId}`, {
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
    return request(API_ENDPOINTS.designations.create(), {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Update an existing designation.
   *
   * @param {string} designationName - Current designation name (used in URL).
   * @param {string} newName - New designation name.
   * @returns {Promise<object>} API response.
   */
  updateDesignation(designationName, newName) {
    return request(API_ENDPOINTS.designations.update(designationName), {
      method: "PUT",
      body: {
        to_update: "designation_name",
        new_val: newName,
      },
    });
  },

  /**
   * Delete a designation by id.
   *
   * @param {number|string} id - Designation identifier.
   * @returns {Promise<object>} API response.
   */
  deleteDesignation(id) {
    return request(API_ENDPOINTS.designations.delete(id), {
      method: "DELETE",
    });
  },
};

