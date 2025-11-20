import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Department domain API service.
 */
export const departmentService = {
  /**
   * Fetch all departments.
   *
   * @returns {Promise<object>} API response containing departments.
   */
  fetchDepartments() {
    return request(API_ENDPOINTS.departments.list(), {
      method: "GET",
    });
  },

  /**
   * Add a new department.
   *
   * @param {{ name: string }} payload - Department data.
   * @returns {Promise<object>} API response.
   */
  addDepartment(payload) {
    return request(API_ENDPOINTS.departments.create(), {
      method: "POST",
      body: payload,
    });
  },

  /**
   * Update an existing department.
   *
   * @param {number|string} id - Department identifier.
   * @param {{ name: string }} payload - Updated data.
   * @returns {Promise<object>} API response.
   */
  updateDepartment(id, payload) {
    return request(API_ENDPOINTS.departments.update(id), {
      method: "PUT",
      body: payload,
    });
  },

  /**
   * Delete a department.
   *
   * @param {number|string} id - Department identifier.
   * @returns {Promise<object>} API response.
   */
  deleteDepartment(id) {
    return request(API_ENDPOINTS.departments.delete(id), {
      method: "DELETE",
    });
  },
};

