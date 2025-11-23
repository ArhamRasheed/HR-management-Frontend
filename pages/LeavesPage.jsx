import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter } from "lucide-react";
import {
  fetchLeaves,
  setSearchQuery,
  setStatusFilter,
} from "../src/store/slices/leaveSlice";
import PageHeader from "../src/components/PageHeader";
import Footer from "../components/footer";
import AddLeaveTypeModal from "../src/components/AddLeaveTypeModal";
import EmployeesOnLeaveModal from "../src/components/EmployeesOnLeaveModal";
import UpdateLeaveModal from "../src/components/UpdateLeaveModal";
import ApplyLeaveModal from "../src/components/ApplyLeaveModal";

const LeavesPage = () => {
  const dispatch = useDispatch();
  const { leaves, loading, error, searchQuery, statusFilter } = useSelector(
    (state) => state.leaves
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLeaveForApply, setSelectedLeaveForApply] = useState(null);

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  // Filter leaves based on search
  const filteredLeaves = useMemo(() => {
    let filtered = [...leaves];

    // Apply search filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((leave) =>
        leave.leave_type_name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [leaves, searchQuery]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleStatusFilter = (e) => {
    dispatch(setStatusFilter(e.target.value));
  };

  const handleAddLeaveType = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    // Refresh the leaves list
    dispatch(fetchLeaves());
  };

  const handleViewEmployees = (leave) => {
    setSelectedLeave(leave);
    setIsEmployeesModalOpen(true);
  };

  const handleApplyLeave = (leave) => {
    setSelectedLeaveForApply(leave);
    setIsApplyModalOpen(true);
  };

  const handleApplySuccess = (message) => {
    setIsApplyModalOpen(false);
    setSelectedLeaveForApply(null);
    alert(message || "Leave application submitted successfully!");
    // Optionally refresh the leaves list or show a success notification
  };

  const handleUpdateLeave = (employee) => {
    setSelectedEmployee(employee);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = (message, newStatus, leaveId) => {
    setIsUpdateModalOpen(false);
    setSelectedEmployee(null);
    
    // Show success message
    alert(message || "Leave updated successfully!");
    
    // Increment refresh key to force re-render
    // This will cause EmployeesOnLeaveModal to remount and fetch fresh data
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaves</h1>
          <p className="text-gray-600">
            Manage and track employee leave types
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Status:</span>
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-gray-900 outline-none"
                >
                  <option>All Leave Type</option>
                </select>
              </div>
            </div>

            {/* Add Leave Type Button */}
            <button
              onClick={handleAddLeaveType}
              className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Leave Type
            </button>
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Max Days/Year
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Effective Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Is Paid
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
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
                    Loading leaves...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No leaves found.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-blue-600">
                        #{leave.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                          {leave.leave_type_name?.substring(0, 2).toUpperCase() || "LT"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {leave.leave_type_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leave.description || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {leave.max_days_allowed === -1 ||
                        leave.max_days_allowed === null
                          ? "Unlimited"
                          : leave.max_days_allowed}
                      </div>
                      {leave.max_days_allowed !== -1 &&
                        leave.max_days_allowed !== null && (
                          <div className="text-xs text-gray-500">
                            days per year
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {/* Placeholder - add effective date if available */}
                      {leave.effective_date || "2025-10-20"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {leave.is_paid ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewEmployees(leave)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          View All Employees
                        </button>
                        <button
                          onClick={() => handleApplyLeave(leave)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                        >
                          Apply Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Leave Type Modal */}
      <AddLeaveTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Employees on Leave Modal */}
      <EmployeesOnLeaveModal
        key={`employees-modal-${refreshKey}`}
        isOpen={isEmployeesModalOpen}
        onClose={() => {
          setIsEmployeesModalOpen(false);
          setSelectedLeave(null);
        }}
        leaveTypeName={selectedLeave?.leave_type_name}
        leaveTypeId={selectedLeave?.id}
        onUpdate={handleUpdateLeave}
      />

      {/* Update Leave Modal */}
      <UpdateLeaveModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSuccess={handleUpdateSuccess}
      />

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedLeaveForApply(null);
        }}
        leaveType={selectedLeaveForApply}
        onSuccess={handleApplySuccess}
      />

      <Footer />
    </div>
  );
};

export default LeavesPage;

