import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateComplaintStatus,
  fetchComplaints,
} from "../store/slices/complaintSlice";

const UpdateComplaintStatusModal = ({ isOpen, onClose, complaint }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState("Resolved");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens with new complaint
  useEffect(() => {
    if (complaint) {
      setSelectedStatus("Resolved");
      setError("");
    }
  }, [complaint]);

  const handleUpdate = async () => {
    if (!selectedStatus) {
      setError("Please select a status");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await dispatch(
        updateComplaintStatus({
          complaintId: complaint.id,
          status: selectedStatus.toLowerCase(),
        })
      ).unwrap();

      // Refresh the complaints list
      await dispatch(fetchComplaints());

      // Close modal on success
      onClose();
    } catch (err) {
      setError(err || "Failed to update complaint status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSelectedStatus("Resolved");
    onClose();
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay - NOT black */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="bg-white rounded-lg p-8 w-96 relative z-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Update Complaint Status
        </h2>

        <div className="mb-4">
          <p className="text-gray-700 mb-1">
            <span className="font-medium">ID:</span> {complaint.id}{" "}
            {complaint.employee_name}
          </p>
        </div>

        {/* Subject Dropdown (read-only display) */}
        <div className="mb-4">
          <select
            disabled
            value={complaint.title || ""}
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 text-gray-700"
          >
            <option>{complaint.title || "-"}</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded font-medium disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateComplaintStatusModal;

