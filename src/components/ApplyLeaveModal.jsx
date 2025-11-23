import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { leaveService } from "../api/leaveService";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiEndpoints";

const ApplyLeaveModal = ({ isOpen, onClose, leaveType, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.employees.list()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.employee_id) {
      setError("Please select an employee");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError("Please select start and end dates");
      return;
    }

    setLoading(true);

    try {
      await leaveService.applyLeave(formData.employee_id, {
        leave_type: leaveType?.leave_type_name || "",
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      });

      // Reset form
      setFormData({
        employee_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      });

      // Call success callback
      onSuccess("Leave application submitted successfully!");
    } catch (err) {
      setError(err.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      employee_id: "",
      start_date: "",
      end_date: "",
      reason: "",
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Modal Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  Apply Leave
                </h2>
                <p className="text-lg text-gray-500">
                  {leaveType?.leave_type_name || "Leave"}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Employee Selection */}
              <div className="mb-6">
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Employee
                </label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Start Date */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    min={formData.start_date}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Reason for Leave */}
              <div className="mb-8">
                <label className="block text-base font-semibold text-gray-900 mb-3">
                  Reason for Leave
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter reason for leave..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-8 py-3 border border-gray-300 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#1e40af] text-white text-base font-medium rounded-lg hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Confirm Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyLeaveModal;

