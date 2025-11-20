import { request } from "./config";

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
    return request("/api/login/", {
      method: "POST",
      body: { email, password },
    });
  },

  /**
   * Logout current user session.
   *
   * @returns {Promise<object>} API response.
   */
  logout() {
    return request("/api/logout/", {
      method: "POST",
    });
  },

  /**
   * Verify whether the session is still active.
   *
   * @returns {Promise<object>} API response.
   */
  checkSession() {
    return request("/api/check-session/", {
      method: "GET",
    });
  },
};

