import React, { useState } from "react";
import { X } from "lucide-react";
import { leaveService } from "../api/leaveService";

const AddLeaveTypeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    leave_type_name: "",
    max_days_allowed: "",
    is_paid: true,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await leaveService.addLeave({
        leave_type_name: formData.leave_type_name,
        description: formData.description,
        max_days_allowed: formData.max_days_allowed ? parseInt(formData.max_days_allowed) : null,
        is_paid: formData.is_paid,
      });

      // Reset form
      setFormData({
        leave_type_name: "",
        max_days_allowed: "",
        is_paid: true,
        description: "",
      });

      // Call success callback
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to add leave type");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      leave_type_name: "",
      max_days_allowed: "",
      is_paid: true,
      description: "",
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Add Leave Type
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Leave Type Name */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Leave Type Name
                </label>
                <input
                  type="text"
                  name="leave_type_name"
                  value={formData.leave_type_name}
                  onChange={handleChange}
                  placeholder="e.g. Annual Leave"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Max Days/Year and Is Paid Checkbox */}
              <div className="mb-6 flex gap-6 items-start">
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    Max Days/Year
                  </label>
                  <input
                    type="number"
                    name="max_days_allowed"
                    value={formData.max_days_allowed}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-3 mt-12">
                  <input
                    type="checkbox"
                    name="is_paid"
                    id="is_paid"
                    checked={formData.is_paid}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_paid"
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    Is Paid Leave?
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Policy details..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white text-lg font-semibold rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLeaveTypeModal;

