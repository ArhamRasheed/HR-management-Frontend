import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteComplaint, fetchComplaints } from "../store/slices/complaintSlice";

const DeleteComplaintModal = ({ isOpen, onClose, complaint }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");

    try {
      await dispatch(deleteComplaint(complaint.id)).unwrap();

      // Refresh the complaints list
      await dispatch(fetchComplaints());

      // Close modal on success
      onClose();
    } catch (err) {
      setError(err || "Failed to delete complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
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
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Confirm Deletion</h2>

        <p className="text-gray-700 mb-6">
          Are sure to Ion want to delete this complaint? This action cannot o undoe.
        </p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 py-2 px-4 rounded border border-gray-300 font-medium disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteComplaintModal;

