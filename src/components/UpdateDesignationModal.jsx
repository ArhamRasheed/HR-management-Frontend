import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDesignation, fetchDesignations } from "../store/slices/designationSlice";

const UpdateDesignationModal = ({ isOpen, onClose, designation }) => {
  const dispatch = useDispatch();
  const [newDesignationName, setNewDesignationName] = useState(designation?.designation_name || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens with new designation
  useEffect(() => {
    if (designation) {
      setNewDesignationName(designation.designation_name);
      setError("");
    }
  }, [designation]);

  const handleUpdate = async () => {
    if (!newDesignationName.trim()) {
      setError("Designation name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await dispatch(
        updateDesignation({
          oldName: designation.designation_name,
          newName: newDesignationName.trim(),
        })
      ).unwrap();

      // Refresh the list (updateDesignation already calls fetchDesignations, but calling again to be safe)
      await dispatch(fetchDesignations());

      // Close modal on success
      onClose();
    } catch (err) {
      setError(err || "Failed to update designation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setNewDesignationName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay - NOT black */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="bg-white rounded-lg p-8 w-96 relative z-10 shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Update Designation</h2>

        <p className="text-gray-600 mb-4">
          Updating: <span className="font-medium">{designation?.designation_name}</span>
        </p>

        <label className="block text-gray-700 font-medium mb-2">New Designation Name</label>

        <input
          type="text"
          value={newDesignationName}
          onChange={(e) => {
            setNewDesignationName(e.target.value);
            setError(""); // Clear error on change
          }}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new designation name"
          disabled={isLoading}
          autoFocus
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded font-medium disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading || !newDesignationName.trim()}
            className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDesignationModal;

