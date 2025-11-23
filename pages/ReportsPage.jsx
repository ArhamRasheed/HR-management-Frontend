import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Download, FileText } from "lucide-react";
import {
  fetchReports,
  setSearchQuery,
  setDocType,
  setPeriod,
  setCurrentPage,
} from "../src/store/slices/reportSlice";
import PageHeader from "../src/components/PageHeader";
import GenerateReportModal from "../src/components/GenerateReportModal";
import Footer from "../components/footer";
import { reportService } from "../src/api/reportService";
import MonthYearPicker from "../src/components/MonthYearPicker";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, filters, currentPage, itemsPerPage } =
    useSelector((state) => state.reports);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchReports({
        docType: filters.docType,
        month: filters.month,
        year: filters.year,
      })
    );
  }, [dispatch, filters.docType, filters.month, filters.year]);

  // Format reference ID
  const formatReferenceId = (id) => {
    return `#RPT-${String(id).padStart(4, "0")}`;
  };

  // Format period
  const formatPeriod = (month, year) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[month - 1]} ${year}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(
      2,
      "0"
    )}, ${date.getFullYear()}`;
  };

  // Get type badge
  const getTypeBadge = (type) => {
    if (type === "Company") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          Company
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
        Employee
      </span>
    );
  };

  // Filter reports based on search
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Apply search filter
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((report) => {
        const reportName = (report.report_name || "").toLowerCase();
        const reportFile = (report.report_file || "").toLowerCase();
        return reportName.includes(query) || reportFile.includes(query);
      });
    }

    return filtered;
  }, [reports, filters.searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleTypeFilter = (e) => {
    dispatch(setDocType(e.target.value));
  };

  const handleDownload = async (report) => {
    try {
      // Extract file path - use report_file if available, otherwise construct from file_path
      const filePath = report.report_file || report.file_path;

      if (!filePath) {
        alert("File path not available for this report");
        return;
      }

      // Extract filename for download
      const fileName = report.report_file
        ? report.report_file.split("/").pop()
        : report.report_name || "report.pdf";

      // Call the download service
      await reportService.downloadReport(filePath, fileName);

      console.log("Download started:", fileName);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  const handleGenerateReport = () => {
    setIsGenerateModalOpen(true);
  };

  const handleGenerateSuccess = () => {
    setIsGenerateModalOpen(false);
    // Refresh reports list
    dispatch(
      fetchReports({
        docType: filters.docType,
        month: filters.month,
        year: filters.year,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reports Management
            </h1>
            <p className="text-gray-600">
              View history and download monthly reports
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Generate Report
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search report name..."
                value={filters.searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.docType}
              onChange={handleTypeFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-900 outline-none"
            >
              <option>All Types</option>
              <option>Company</option>
              <option>Employee</option>
            </select>

            {/* Period Filter */}
            <MonthYearPicker
              value={
                filters.month && filters.year
                  ? { month: filters.month, year: filters.year }
                  : null
              }
              onChange={({ month, year }) => {
                dispatch(setPeriod({ month, year }));
              }}
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Report Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Period
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Generated On
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Loading reports...
                  </td>
                </tr>
              ) : paginatedReports.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No reports found.
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatReferenceId(report.id)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {report.report_file
                          ? report.report_file.split("/").pop()
                          : report.report_name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {report.report_file
                          ? report.report_file.substring(
                              0,
                              report.report_file.lastIndexOf("/")
                            )
                          : report.file_path || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(report.type)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatPeriod(report.month, report.year)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {report.generated_at
                        ? new Date(report.generated_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDownload(report)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {!loading && filteredReports.length > 0 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredReports.length)} of{" "}
                {filteredReports.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => dispatch(setCurrentPage(i + 1))}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === i + 1
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSuccess={handleGenerateSuccess}
      />

      <Footer />
    </div>
  );
};

export default ReportsPage;

