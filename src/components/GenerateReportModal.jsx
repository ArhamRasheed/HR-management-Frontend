import React, { useState } from "react";
import { X, Building2, Users, Info } from "lucide-react";
import { reportService } from "../api/reportService";

const GenerateReportModal = ({ isOpen, onClose, onSuccess }) => {
  const currentDate = new Date();
  const [selectedType, setSelectedType] = useState(null); // "company" or "employee"
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Generate year options (current year and previous 5 years)
  const years = [];
  for (let i = 0; i <= 5; i++) {
    years.push(currentDate.getFullYear() - i);
  }

  // Check if selected date is in the future
  const isFutureDate = () => {
    const selected = new Date(selectedYear, selectedMonth - 1);
    const current = new Date(currentDate.getFullYear(), currentDate.getMonth());
    return selected > current;
  };

  const handleGenerate = async () => {
    // Validation
    if (!selectedType) {
      setError("Please select a report type.");
      return;
    }

    if (isFutureDate()) {
      setError("Cannot generate reports for future dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reportService.generateReport(selectedType, selectedMonth, selectedYear);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedType(null);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  const futureDate = isFutureDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-white/30"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 relative z-10">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select report type and period below.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Report Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Company Report */}
            <button
              onClick={() => {
                setSelectedType("company");
                setError(null);
              }}
              disabled={loading}
              style={{
                backgroundColor: selectedType === "company" ? "#f0fdf4" : "#ffffff",
                borderColor: selectedType === "company" ? "#16a34a" : "#e5e7eb",
              }}
              className="p-6 rounded-lg border-2 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Building2
                className={`w-12 h-12 mx-auto mb-3 ${
                  selectedType === "company" ? "text-green-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-semibold ${
                  selectedType === "company" ? "text-green-900" : "text-gray-700"
                }`}
              >
                Company Report
              </p>
            </button>

            {/* Employee Report */}
            <button
              onClick={() => {
                setSelectedType("employee");
                setError(null);
              }}
              disabled={loading}
              style={{
                backgroundColor: selectedType === "employee" ? "#faf5ff" : "#ffffff",
                borderColor: selectedType === "employee" ? "#9333ea" : "#e5e7eb",
              }}
              className="p-6 rounded-lg border-2 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users
                className={`w-12 h-12 mx-auto mb-3 ${
                  selectedType === "employee" ? "text-purple-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-semibold ${
                  selectedType === "employee" ? "text-purple-900" : "text-gray-700"
                }`}
              >
                Employee Report
              </p>
            </button>
          </div>

          {/* Report Period */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Report Period
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Month */}
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(parseInt(e.target.value));
                  setError(null);
                }}
                disabled={loading}
                className="px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-50"
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value));
                  setError(null);
                }}
                disabled={loading}
                className="px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none disabled:opacity-50"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Message for Employee Report */}
          {selectedType === "employee" && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                All active employees' reports will be generated for the selected
                period. This may take a few moments.
              </p>
            </div>
          )}

          {/* Future Date Warning */}
          {futureDate && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-900">
                Cannot generate reports for future dates. Please select a past or
                current period.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedType || futureDate}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;

