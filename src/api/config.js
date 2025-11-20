/**
 * Shared API configuration and request helper utilities.
 *
 * @module api/config
 */

import { API_BASE_URL } from "../constants/apiEndpoints";

/**
 * Perform a fetch request with sensible defaults for the project.
 *
 * @template T
 * @param {string} endpoint - API endpoint starting with `/api`.
 * @param {RequestInit & { parseJson?: boolean }} [options] - Fetch options.
 * @returns {Promise<T>} Parsed JSON response.
 * @throws {Error} When the response is not OK or the network fails.
 */
export async function request(endpoint, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    parseJson = true,
    ...rest
  } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body !== undefined
        ? { body: typeof body === "string" ? body : JSON.stringify(body) }
        : {}),
      ...rest,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = parseJson && isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        (payload && typeof payload === "object" && payload.message) ||
        "Something went wrong. Please try again.";
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

