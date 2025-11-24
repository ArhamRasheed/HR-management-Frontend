import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { leaveService } from "../api/leaveService";

const EmployeesOnLeaveModal = ({ isOpen, onClose, leaveTypeName, leaveTypeId, onUpdate }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && leaveTypeId) {
      fetchEmployees();
    }
  }, [isOpen, leaveTypeId]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await leaveService.fetchEmployeesOnLeave();
      
      // Filter employees by leave type if leaveTypeId is provided
      const filteredEmployees = leaveTypeId 
        ? data.leave_applications?.filter(app => app.leave_id === leaveTypeId) || []
        : data.leave_applications || [];
      
      setEmployees(filteredEmployees);
    } catch (err) {
      setError(err.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    // Capitalize first letter to handle backend returning lowercase
    const capitalizedStatus = status 
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "Pending";
      
    const statusConfig = {
      Approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved"
      },
      Pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending"
      },
      Rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected"
      }
    };

    const config = statusConfig[capitalizedStatus] || statusConfig.Pending;

    return (
      <span className={`px-3 py-1 rounded-md text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const canUpdateLeave = (status, startDate) => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status ? status.toLowerCase() : "";
    
    // Cannot update if status is Approved or Rejected
    if (normalizedStatus === "approved" || normalizedStatus === "rejected") {
      return false;
    }
    
    // Cannot update if start date is in the past or today
    if (startDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const leaveStartDate = new Date(startDate);
      leaveStartDate.setHours(0, 0, 0, 0);
      
      if (leaveStartDate <= today) {
        return false;
      }
    }
    
    return true;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleUpdate = (employee) => {
    // Pass employee data to parent to open update modal
    if (onUpdate) {
      onUpdate(employee);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Modal Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Employees on {leaveTypeName || "Leave"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Current leave requests and history
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Table */}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Loading employees...
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No employees found for this leave type.
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {employee.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            #{employee.employee_id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <div>
                              <span className="text-gray-500">Start:</span>{" "}
                              {formatDate(employee.start_date)}
                            </div>
                            <div>
                              <span className="text-gray-500">End:</span>{" "}
                              {formatDate(employee.end_date)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {getStatusBadge(employee.status)}
                            {!canUpdateLeave(employee.status, employee.start_date) && (
                              <div className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="w-3 h-3" />
                                <span>Started leaves can't be updated now</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleUpdate(employee)}
                            disabled={!canUpdateLeave(employee.status, employee.start_date)}
                            className="px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-white bg-gray-800 border-2 border-gray-900 rounded-lg hover:bg-gray-900 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeesOnLeaveModal;

