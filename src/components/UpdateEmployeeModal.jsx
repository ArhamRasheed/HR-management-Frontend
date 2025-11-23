import React, { useState, useEffect } from "react";
import { X, Info, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { employeeService } from "../api/employeeService";
import { designationService } from "../api/designationService";

/**
 * Update Employee Modal Component
 * Allows updating employee fields: phone, designation, status, or salary.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Function to close the modal
 * @param {object} employee - Employee data object (contains id and full_name)
 * @param {Function} onUpdateSuccess - Callback when update succeeds
 */
const UpdateEmployeeModal = ({ isOpen, onClose, employee, onUpdateSuccess }) => {
  const [fieldToUpdate, setFieldToUpdate] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);

  // Fetch designations when modal opens and field is designation
  useEffect(() => {
    if (isOpen && fieldToUpdate === "designation") {
      setLoadingDesignations(true);
      designationService
        .fetchDesignations()
        .then((response) => {
          setDesignations(response.designations || []);
        })
        .catch(() => {
          setDesignations([]);
        })
        .finally(() => {
          setLoadingDesignations(false);
        });
    }
  }, [isOpen, fieldToUpdate]);

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      setFieldToUpdate("");
      setNewValue("");
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, employee]);

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!fieldToUpdate || !newValue) {
      setError("Please select a field to update and provide a new value.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await employeeService.updateEmployee(
        employee.id,
        fieldToUpdate,
        newValue
      );
      setSuccessMessage(response.message || "Employee updated successfully!");
      
      // Close modal and refresh list after 1.5 seconds
      setTimeout(() => {
        onUpdateSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderNewValueInput = () => {
    if (!fieldToUpdate) return null;

    switch (fieldToUpdate) {
      case "phone":
        return (
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900"
            disabled={loading}
          />
        );

      case "designation":
        if (loadingDesignations) {
          return (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading designations...</span>
            </div>
          );
        }
        return (
          <select
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 bg-white"
            disabled={loading}
          >
            <option value="">Select designation</option>
            {designations.map((designation) => (
              <option key={designation.id} value={designation.designation_name || designation.name}>
                {designation.designation_name || designation.name}
              </option>
            ))}
          </select>
        );

      case "status":
        return (
          <select
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 bg-white"
            disabled={loading}
          >
            <option value="">Select status</option>
            <option value="fired">Fired</option>
            <option value="terminated">Terminated</option>
            <option value="resigned">Resigned</option>
          </select>
        );

      case "salary":
        return (
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new salary"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900"
            disabled={loading}
          />
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay - NOT black */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={handleOverlayClick}
      />
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-900">Update Employee</h2>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Info Banner */}
        {employee && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Updating <span className="font-semibold">{employee.full_name}</span>
            </p>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Field to Update */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field to Update <span className="text-red-500">*</span>
            </label>
            <select
              value={fieldToUpdate}
              onChange={(e) => {
                setFieldToUpdate(e.target.value);
                setNewValue(""); // Reset new value when field changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 bg-white"
              disabled={loading}
              required
            >
              <option value="">Select field to update</option>
              <option value="phone">Phone</option>
              <option value="designation">Designation</option>
              <option value="status">Status</option>
              <option value="salary">Salary</option>
            </select>
          </div>

          {/* New Value */}
          {fieldToUpdate && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Value <span className="text-red-500">*</span>
              </label>
              {renderNewValueInput()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !fieldToUpdate || !newValue}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployeeModal;

