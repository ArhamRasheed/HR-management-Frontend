import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateCandidateStatus,
  fetchCandidates,
} from "../store/slices/candidateSlice";

const UpdateCandidateStatusModal = ({ isOpen, onClose, candidate }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setIsLoading(true);
    setError("");

    try {
      await dispatch(
        updateCandidateStatus({
          candidateId: candidate.id,
          status: newStatus,
        })
      ).unwrap();

      // Refresh the candidates list
      await dispatch(fetchCandidates());

      // Close modal on success
      onClose();
    } catch (err) {
      setError(err || "Failed to update candidate status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay - NOT black */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="bg-white rounded-lg p-8 w-[480px] relative z-10 shadow-2xl">
        {/* Header with icon */}
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Update Application Status
            </h2>
            <p className="text-gray-600">
              Decision for{" "}
              <span className="font-semibold text-gray-900">
                {candidate.full_name}
              </span>{" "}
              applied for {candidate.position_applied || "position"}.
            </p>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Shortlist Button */}
          <button
            onClick={() => handleStatusUpdate("shortlisted")}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            {isLoading ? "Updating..." : "Shortlist Candidate"}
          </button>

          {/* Reject Button */}
          <button
            onClick={() => handleStatusUpdate("rejected")}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {isLoading ? "Updating..." : "Reject Candidate"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCandidateStatusModal;

