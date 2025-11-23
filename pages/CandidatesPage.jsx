import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import {
  fetchCandidates,
  setSearchQuery,
  setDepartmentFilter,
  setStatusFilter,
} from "../src/store/slices/candidateSlice";
import UpdateCandidateStatusModal from "../src/components/UpdateCandidateStatusModal";
import AddCandidateModal from "../src/components/AddCandidateModal";
import Footer from "../components/footer";

const CandidatesPage = () => {
  const dispatch = useDispatch();
  const {
    filteredCandidates,
    searchQuery,
    departmentFilter,
    statusFilter,
    loading,
    error,
  } = useSelector((state) => state.candidates);

  // For getting unique departments for the filter dropdown
  const [departments, setDepartments] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  useEffect(() => {
    // Extract unique departments from candidates
    const uniqueDepartments = [
      ...new Set(
        filteredCandidates.map((c) => c.department).filter(Boolean)
      ),
    ];
    setDepartments(uniqueDepartments);
  }, [filteredCandidates]);

  const getStatusBadge = (status) => {
    if (!status) return null;

    const statusLower = status.toLowerCase();
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      shortlisted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      hired: "bg-blue-100 text-blue-800",
    };

    // Capitalize first letter for display
    const displayStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const colorClass =
      statusColors[statusLower] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-3 py-1 rounded text-sm font-medium ${colorClass}`}
      >
        {displayStatus}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  const getInitialColor = (name) => {
    if (!name) return "bg-gray-300 text-gray-700";
    const firstChar = name.charAt(0).toUpperCase();
    const colors = {
      A: "bg-purple-200 text-purple-800",
      B: "bg-blue-200 text-blue-800",
      C: "bg-pink-200 text-pink-800",
      D: "bg-green-200 text-green-800",
      E: "bg-yellow-200 text-yellow-800",
      F: "bg-red-200 text-red-800",
    };
    return colors[firstChar] || "bg-gray-200 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString; // Already in YYYY-MM-DD format from backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as other pages */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">HR</span>
              </div>
              <h1 className="text-xl font-bold">HRMS</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/hr-dashboard" className="hover:text-gray-300">Dashboard</a>
              <a href="/employees" className="hover:text-gray-300">Employees</a>
              <a href="/recruitment/candidates" className="text-white font-semibold border-b-2 border-white pb-1">
                Candidates
              </a>
              <a href="/departments" className="hover:text-gray-300">Departments</a>
              <a href="/designations" className="hover:text-gray-300">Designations</a>
              <a href="/reports" className="hover:text-gray-300">Reports</a>
              <a href="/payroll" className="hover:text-gray-300">Payroll</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">John Doe</span>
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-6 py-8 ${isAddModalOpen ? 'blur-sm' : ''}`}>
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruitment</h1>
            <p className="text-gray-600">
              Manage interview schedules and candidate statuses
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Candidate
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            {/* Search Bar */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All Departments">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Role / Dept
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Interview Info
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Loading candidates...
                    </td>
                  </tr>
                ) : filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      {searchQuery ||
                      departmentFilter !== "All Departments" ||
                      statusFilter !== "All Statuses"
                        ? "No candidates found matching your filters."
                        : "No candidates found."}
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      {/* Candidate Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getInitialColor(
                              candidate.full_name
                            )}`}
                          >
                            {getInitials(candidate.full_name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {candidate.full_name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {candidate.email || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role / Dept Column */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {candidate.position_applied || "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidate.department || "-"}
                          </div>
                        </div>
                      </td>

                      {/* Interview Info Column */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-1 text-gray-700 mb-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(candidate.interview_date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            By: {candidate.interviewer || "-"}
                          </div>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        {getStatusBadge(candidate.status)}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowUpdateModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Update Candidate Status Modal */}
      <UpdateCandidateStatusModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
      />

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default CandidatesPage;

