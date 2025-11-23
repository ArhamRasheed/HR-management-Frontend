import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Service responsible for authentication-related API calls.
 */
export const authService = {
  /**
   * Login user with email and password.
   *
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<object>} API response.
   */
  login(email, password) {
    return request(API_ENDPOINTS.auth.login(), {
      method: "POST",
      body: { email, password },
      credentials: "include",
    });
  },

  /**
   * Logout current user session.
   *
   * @returns {Promise<object>} API response.
   */
  logout() {
    return request(API_ENDPOINTS.auth.logout(), {
      method: "POST",
      credentials: "include",
    });
  },  

  /**
   * Verify whether the session is still active.
   *
   * @returns {Promise<object>} API response.
   */
  checkSession() {
    return request(API_ENDPOINTS.auth.session(), {
      method: "GET",
      credentials: "include",
    });
  },
};
