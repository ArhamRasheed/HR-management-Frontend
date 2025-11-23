import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComplaint, fetchComplaints } from "../store/slices/complaintSlice";

const FileComplaintModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.email || !formData.subject || !formData.description) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await dispatch(
        addComplaint({
          email: formData.email,
          title: formData.subject,
          description: formData.description,
        })
      ).unwrap();

      // Refresh the complaints list
      await dispatch(fetchComplaints());

      // Reset form and close modal on success
      setFormData({ email: "", subject: "", description: "" });
      onClose();
    } catch (err) {
      setError(err || "Failed to file complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setFormData({ email: "", subject: "", description: "" });
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
      <div className="bg-white rounded-lg p-8 w-[500px] relative z-10 shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">File New Complaint</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Employee Email Label */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Employee Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="lina.svensson@company.com"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief title of the complaint"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details of grievany portail..."
              rows="4"
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 py-2 px-4 rounded border border-gray-300 font-medium disabled:opacity-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileComplaintModal;

