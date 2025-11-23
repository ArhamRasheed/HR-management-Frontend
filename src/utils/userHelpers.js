/**
 * Utility functions for user-related operations.
 */

/**
 * Get user initials from full name.
 *
 * @param {string|null|undefined} fullName - User's full name.
 * @param {number} maxLength - Maximum length of initials (default: 2).
 * @returns {string} User initials (e.g., "YT" for "Yuki Tanaka").
 */
export const getUserInitials = (fullName, maxLength = 2) => {
  if (!fullName || typeof fullName !== "string") {
    return "U";
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) {
    return "U";
  }

  const initials = parts
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, maxLength);

  return initials || "U";
};

/**
 * Get user display name with fallback.
 *
 * @param {string|null|undefined} fullName - User's full name.
 * @param {string} fallback - Fallback name if fullName is not available.
 * @returns {string} User display name.
 */
export const getUserDisplayName = (fullName, fallback = "User") => {
  return fullName || fallback;
};

