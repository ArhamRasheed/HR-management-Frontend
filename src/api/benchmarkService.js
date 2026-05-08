import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Service for the live performance benchmark API.
 */
export const benchmarkService = {
  /**
   * Run the benchmark suite and return the latest results.
   *
   * @returns {Promise<{benchmark_results: object, summary: object}>}
   */
  runBenchmark: () =>
    request(API_ENDPOINTS.benchmark.run(), {
      method: "GET",
      credentials: "include",
    }),
};

export default benchmarkService;
