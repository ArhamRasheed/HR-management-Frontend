import { request } from "./config";
import { API_ENDPOINTS, API_BASE_URL } from "../constants/apiEndpoints";

export const reportService = {
  fetchReports: (docType, month, year) => {
    let url = API_ENDPOINTS.reports.list();
    const params = new URLSearchParams();

    // Map docType to API format
    if (docType === "Company") {
      params.append("doc_type", "company_report");
    } else if (docType === "Employee") {
      params.append("doc_type", "employee_report");
    } else {
      // All Types - send both
      params.append("doc_type", "company_report,employee_report");
    }

    if (month) params.append("month", month);
    if (year) params.append("year", year);

    return request(`${url}?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });
  },

  downloadReport: async (filePath, fileName) => {
    try {
      const url = `${API_ENDPOINTS.reports.download()}?file_path=${encodeURIComponent(filePath)}`;

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || "report.pdf";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  },

  generateReport: (reportType, month, year) => {
    return request(
      `${API_ENDPOINTS.reports.generate()}?report_type=${reportType}&month=${month}&year=${year}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },
};

