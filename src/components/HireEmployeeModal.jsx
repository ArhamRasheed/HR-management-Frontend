import React, { useState, useEffect } from "react";
import { UserPlus, User, Phone, Folder, Edit, Loader2, AlertCircle } from "lucide-react";
import { employeeService } from "../api/employeeService";
import { candidateService } from "../api/candidateService";

/**
 * Hire Employee Modal Component
 * Allows selecting a shortlisted candidate to officially onboard them as an employee.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Function to close the modal
 * @param {Function} onHireSuccess - Callback when hire succeeds
 */
const HireEmployeeModal = ({ isOpen, onClose, onHireSuccess }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch shortlisted candidates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchShortlistedCandidates();
      // Reset form
      setSelectedCandidateId("");
      setSelectedCandidate(null);
      setError(null);
    }
  }, [isOpen]);

  const fetchShortlistedCandidates = async () => {
    setCandidatesLoading(true);
    setError(null);
    try {
      const response = await candidateService.fetchShortlistedCandidates();
      // Handle different response formats
      const candidatesList = response.shortlisted_candidates || response || [];
      setCandidates(candidatesList);
    } catch (err) {
      // If shortlisted endpoint doesn't exist, try fetching all candidates and filter
      try {
        const response = await candidateService.fetchCandidates();
        const allCandidates = response.candidates || response || [];
        // Filter for shortlisted candidates (status === 'shortlisted' or similar)
        const shortlisted = allCandidates.filter(
          (c) => c.status === "shortlisted" || c.status === "Shortlisted" || c.is_shortlisted
        );
        setCandidates(shortlisted);
      } catch (fallbackErr) {
        setError("Failed to load candidates. Please try again.");
        setCandidates([]);
      }
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidateId(candidateId);
    const candidate = candidates.find((c) => c.id === parseInt(candidateId));
    setSelectedCandidate(candidate || null);
    setError(null);
  };

  const handleHire = async () => {
    if (!selectedCandidateId) {
      setError("Please select a candidate to hire.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await employeeService.hireEmployee(parseInt(selectedCandidateId));
      onHireSuccess();
    } catch (err) {
      setError(err.message || "Failed to hire employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hire Employee</h2>
              <p className="text-sm text-gray-600 mt-1">
                Select a shortlisted candidate to officially onboard them.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Select Candidate */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Shortlisted Candidate <span className="text-red-500">*</span>
            </label>
            {candidatesLoading ? (
              <div className="flex items-center gap-2 text-gray-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading candidates...</span>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-sm text-gray-500 py-2">
                No shortlisted candidates available.
              </div>
            ) : (
              <select
                value={selectedCandidateId}
                onChange={(e) => handleCandidateSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 bg-white"
                disabled={loading}
                required
              >
                <option value="">Select a candidate</option>
                {candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.full_name || candidate.name || "Unknown"} -{" "}
                    {candidate.position_applied || candidate.position || "N/A"}
                    {selectedCandidateId === String(candidate.id) ? " (Selected)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Candidate Preview */}
          {selectedCandidate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-gray-900 font-semibold mb-3">Candidate Preview</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCandidate.full_name || selectedCandidate.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Folder className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCandidate.department || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCandidate.phone || selectedCandidate.phone_number || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Edit className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Applied Position</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedCandidate.position_applied || selectedCandidate.position || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleHire}
            disabled={loading || !selectedCandidateId || candidatesLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hiring...
              </>
            ) : (
              "Confirm Hire"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HireEmployeeModal;

