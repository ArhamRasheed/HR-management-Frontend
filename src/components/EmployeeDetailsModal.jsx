import React from "react";
import { X, Loader2, AlertCircle } from "lucide-react";

/**
 * Employee Details Modal Component
 * Displays detailed information about an employee in a modal popup.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Function to close the modal
 * @param {object} employee - Employee data object
 * @param {boolean} loading - Whether employee data is being fetched
 * @param {string} error - Error message if fetch failed
 */
const EmployeeDetailsModal = ({ isOpen, onClose, employee, loading, error }) => {
  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      Active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      fired: { bg: "bg-orange-100", text: "text-yellow-800", label: "Fired" },
      Fired: { bg: "bg-orange-100", text: "text-yellow-800", label: "Fired" },
      terminated: { bg: "bg-red-100", text: "text-red-800", label: "Terminated" },
      Terminated: { bg: "bg-red-100", text: "text-red-800", label: "Terminated" },
      resigned: { bg: "bg-yellow-100", text: "text-red-800", label: "Resigned" },
      Resigned: { bg: "bg-yellow-100", text: "text-red-800", label: "Resigned" }
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay - NOT black */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={handleOverlayClick}
      />
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                <span className="text-gray-600">Loading employee details...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-medium">Error loading employee details</span>
              </div>
            ) : employee ? (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{employee.full_name || "N/A"}</h2>
                    <p className="text-lg text-gray-600 mt-1">{employee.designation || "N/A"}</p>
                  </div>
                  <div className="ml-4">{getStatusBadge(employee.employment_status)}</div>
                </div>
              </>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          ) : employee ? (
            <div className="space-y-6">
              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[80px]">Email:</span>
                    <span className="text-gray-900">{employee.email || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[80px]">Phone:</span>
                    <span className="text-gray-900">{employee.phone_number || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Employment Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[120px]">Department:</span>
                    <span className="text-gray-900">{employee.department || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[120px]">Joining Date:</span>
                    <span className="text-gray-900">{employee.joining_date || "N/A"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-medium min-w-[120px]">Termination Date:</span>
                    <span className="text-gray-900">{employee.termination_date || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">No employee data available</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;

