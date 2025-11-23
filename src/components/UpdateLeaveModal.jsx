import React, { useState } from "react";
import { X } from "lucide-react";
import { leaveService } from "../api/leaveService";

const UpdateLeaveModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!status) {
      setError("Please select a status");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await leaveService.updateLeave(employee.employee_id, {
        leave_application_id: employee.id,
        status: status,
      });

      // Get the updated status from backend response and capitalize it
      const updatedStatus = data?.leave?.status 
        ? data.leave.status.charAt(0).toUpperCase() + data.leave.status.slice(1).toLowerCase()
        : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

      // Reset form
      setStatus("");
      
      // Call success callback with capitalized status and leave ID
      onSuccess("Leave updated successfully!", updatedStatus, employee.id);
    } catch (err) {
      setError(err.message || "Failed to update leave");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStatus("");
    setError("");
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          {/* Modal Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Update Leave Status
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Employee Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Employee:</span>
                  <p className="font-semibold text-gray-900">{employee.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">ID:</span>
                  <p className="font-semibold text-gray-900">#{employee.employee_id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Leave Type:</span>
                  <p className="font-semibold text-gray-900">{employee.leave_type_name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Current Status:</span>
                  <p className="font-semibold text-gray-900 capitalize">{employee.status}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-500 text-sm">Duration:</span>
                <p className="font-semibold text-gray-900 text-sm">
                  {employee.start_date ? new Date(employee.start_date).toLocaleDateString() : "N/A"} - {employee.end_date ? new Date(employee.end_date).toLocaleDateString() : "N/A"}
                  {employee.total_days && (
                    <span className="text-gray-500 ml-2">({employee.total_days} days)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Update Status
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="approved"
                      checked={status === "approved"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      Approve Leave
                    </span>
                  </label>
                  
                  <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="rejected"
                      checked={status === "rejected"}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      Reject Leave
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !status}
                  className="flex-1 px-4 py-2.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateLeaveModal;

