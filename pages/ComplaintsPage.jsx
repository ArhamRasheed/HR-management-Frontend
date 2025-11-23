import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter } from "lucide-react";
import {
  fetchComplaints,
  setSearchQuery,
  setStatusFilter,
} from "../src/store/slices/complaintSlice";
import PageHeader from "../src/components/PageHeader";
import UpdateComplaintStatusModal from "../src/components/UpdateComplaintStatusModal";
import DeleteComplaintModal from "../src/components/DeleteComplaintModal";
import FileComplaintModal from "../src/components/FileComplaintModal";
import Footer from "../components/footer";

const ComplaintsPage = () => {
  const dispatch = useDispatch();
  const {
    filteredComplaints,
    searchQuery,
    statusFilter,
    loading,
    error,
  } = useSelector((state) => state.complaints);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    if (!status) return null;

    // Normalize status to lowercase for lookup
    const statusLower = status.toLowerCase();

    const statusColors = {
      open: "bg-blue-100 text-blue-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-200 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    };

    // Capitalize first letter for display
    const displayStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const colorClass =
      statusColors[statusLower] || "bg-gray-100 text-gray-600";

    return (
      <span
        className={`px-3 py-1 rounded text-sm font-medium ${colorClass}`}
      >
        {displayStatus}
      </span>
    );
  };

  const getEmployeeInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complaint Management
            </h1>
            <p className="text-gray-600">Manage and track employee grievances</p>
          </div>
          <button
            onClick={() => setShowFileModal(true)}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span>
            File Complaint
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            {/* Search Bar */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, employee or title..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All Complaint">All Complaint</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Date
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
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Loading complaints...
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      {searchQuery || statusFilter !== "All Complaint"
                        ? "No complaints found matching your filters."
                        : "No complaints found."}
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-indigo-600 font-semibold">
                          #{complaint.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                            {getEmployeeInitials(complaint.employee_name)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {complaint.employee_name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            {complaint.title || "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {truncateText(complaint.description)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(complaint.created_at)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(complaint.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {/* Edit Button - Blue for Open, Gray for others */}
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowUpdateModal(true);
                            }}
                            className={`hover:opacity-80 transition-opacity ${
                              complaint.status?.toLowerCase() === "open"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                            title="Edit"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Delete Button - Always Red */}
                          <button
                            onClick={() => {
                              setComplaintToDelete(complaint);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:opacity-80 transition-opacity"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Update Complaint Status Modal */}
      <UpdateComplaintStatusModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
      />

      {/* Delete Complaint Modal */}
      <DeleteComplaintModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setComplaintToDelete(null);
        }}
        complaint={complaintToDelete}
      />

      {/* File Complaint Modal */}
      <FileComplaintModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
      />

      <Footer />
    </div>
  );
};

export default ComplaintsPage;

