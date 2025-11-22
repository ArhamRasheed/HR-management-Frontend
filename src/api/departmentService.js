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
   * Update a department name.
   *
   * @param {string} currentName - Current department name (used in URL).
   * @param {string} newName - New department name.
   * @returns {Promise<object>} API response.
   */
  updateDepartment(currentName, newName) {
    return request(API_ENDPOINTS.departments.update(currentName), {
      method: "PUT",
      body: {
        to_update: "department_name",
        new_val: newName,
      },
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

