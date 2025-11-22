import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { employeeService } from "../api/employeeService";

/**
 * Delete Employee Modal Component
 * Confirmation modal for deleting an employee.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Function to close the modal
 * @param {object} employee - Employee data object (contains id and full_name)
 * @param {Function} onDeleteSuccess - Callback when deletion succeeds
 */
const DeleteEmployeeModal = ({ isOpen, onClose, employee, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset error when modal opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen, employee]);

  const handleDelete = async () => {
    if (!employee || !employee.id) {
      setError("Invalid employee data");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await employeeService.deleteEmployee(employee.id);
      onDeleteSuccess();
    } catch (err) {
      setError(err.message || "Failed to delete employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">Delete Employee</h2>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-900 font-medium">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{employee?.full_name || "this employee"}</span>?
                </p>
                <p className="text-sm text-red-800 mt-1">
                  This action cannot be undone and will remove all associated data.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || !employee}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal;

