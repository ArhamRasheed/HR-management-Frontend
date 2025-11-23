import React, { useState } from "react";
import { X, Play, CheckCircle2 } from "lucide-react";
import { payrollService } from "../api/payrollService";

const GeneratePayrollModal = ({ isOpen, onClose, onSuccess }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate year options (current year ± 2 years)
  const years = [];
  for (let i = currentDate.getFullYear() - 2; i <= currentDate.getFullYear() + 2; i++) {
    years.push(i);
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      await payrollService.generatePayroll(selectedMonth, selectedYear);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to generate payroll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30" onClick={handleClose} />

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-2xl w-[600px] relative z-10 overflow-hidden">
        {/* Header - Green background */}
        <div className="bg-green-600 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Run Payroll</h2>
              <p className="text-green-100 text-sm">Calculate salaries for active employees</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Select Payroll Period */}
          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              SELECT PAYROLL PERIOD
            </label>
            <div className="flex gap-4">
              {/* Month Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                disabled={loading}
                className="flex-1 border border-gray-700 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value} className="text-gray-900">
                    {month.label}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                disabled={loading}
                className="flex-1 border border-gray-700 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="text-gray-900">
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pre-Run Checklist */}
          <div className="mb-6">
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              PRE-RUN CHECKLIST
            </label>
            <div className="space-y-3">
              {/* Checklist Item 1 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Attendances Marked</p>
                  <p className="text-sm text-gray-600">
                    All attendance records for the month are finalized.
                  </p>
                </div>
              </div>

              {/* Checklist Item 2 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Insurances Updated</p>
                  <p className="text-sm text-gray-600">
                    Policy deductions are up to date.
                  </p>
                </div>
              </div>

              {/* Checklist Item 3 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Leaves Reconciled</p>
                  <p className="text-sm text-gray-600">
                    Approved leaves are accounted for.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-white hover:bg-gray-50 text-white-900 border border-gray-300 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm & Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayrollModal;

