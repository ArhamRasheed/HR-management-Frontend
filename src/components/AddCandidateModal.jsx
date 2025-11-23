import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { departmentService } from "../api/departmentService";
import { candidateService } from "../api/candidateService";
import { fetchCandidates } from "../store/slices/candidateSlice";

const AddCandidateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department_id: "",
    position_name: "",
    remarks: "",
  });
  const [departments, setDepartments] = useState([]);
  const [availablePositions, setAvailablePositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      resetForm();
    }
  }, [isOpen]);

  // Fetch positions when department changes
  useEffect(() => {
    if (formData.department_id) {
      fetchAllowedRoles(parseInt(formData.department_id));
    } else {
      setAvailablePositions([]);
      // Reset position_name when department is cleared
      setFormData((prev) => ({ ...prev, position_name: "" }));
    }
  }, [formData.department_id]);

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const response = await departmentService.fetchDepartments();
      setDepartments(response.departments || response || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchAllowedRoles = async (departmentId) => {
    setLoadingPositions(true);
    setAvailablePositions([]);
    try {
      const response = await candidateService.getAllowedRoles(departmentId);
      
      // Extract the designations array
      let raw = response.designations || response.roles || response.positions || response.allowed_roles;
      
      if (!raw) {
        if (Array.isArray(response)) raw = response;
        else raw = [];
      }
      
      // Transform string array to object array
      const positions = raw.map((item, index) => {
        if (typeof item === "string") {
          return {
            id: item,  // Use designation name as ID
            designation_name: item,
          };
        }
        return item;
      });
      
      setAvailablePositions(positions);
    } catch (err) {
      console.error("Failed to fetch allowed roles:", err);
      setAvailablePositions([]);
      setError("Failed to load positions for this department. Please try again.");
    } finally {
      setLoadingPositions(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      department_id: "",
      position_name: "",
      remarks: "",
    });
    setAvailablePositions([]);
    setError("");
    setSuccess("");
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If department changes, reset position_name
    if (name === "department_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        position_name: "", // Reset position when department changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) {
      errors.full_name = "Full Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.department_id) {
      errors.department_id = "Department is required";
    }
    if (!formData.position_name) {
      errors.position_name = "Applied Position is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        department_id: parseInt(formData.department_id),
        position_name: formData.position_name.trim(),
      };

      // Add optional fields if provided
      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }
      if (formData.remarks.trim()) {
        payload.remarks = formData.remarks.trim();
      }

      await candidateService.addCandidate(payload);

      setSuccess("Candidate added successfully!");

      // Refresh candidates list
      await dispatch(fetchCandidates());

      // Reset form and close after 1.5 seconds
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to add candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background overlay - NOT black */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-white/20"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Add Interviewed Candidate
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Row 1: Full Name | Email Address */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.full_name
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
                disabled={loading}
              />
              {validationErrors.full_name && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.full_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full border rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.email
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
                disabled={loading}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Phone Number | Department */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.department_id
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
                disabled={loading || loadingDepartments}
              >
                <option value="" className="text-gray-900" style={{ color: '#111827' }}>
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option
                    key={dept.id}
                    value={dept.id}
                    className="text-gray-900"
                    style={{ color: '#111827' }}
                  >
                    {dept.department_name || dept.name}
                  </option>
                ))}
              </select>
              {validationErrors.department_id && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.department_id}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Applied Position (full width) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applied Position <span className="text-red-500">*</span>
            </label>
            <select
              name="position_name"
              value={formData.position_name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.position_name
                ? "border-red-500"
                : "border-gray-300"
                } ${!formData.department_id || loadingPositions ? "bg-gray-100 cursor-not-allowed" : ""}`}
              disabled={loading || loadingPositions || !formData.department_id}
            >
              <option value="" className="text-gray-900" style={{ color: '#111827' }}>
                {!formData.department_id
                  ? "Select Department First"
                  : loadingPositions
                    ? "Loading positions..."
                    : availablePositions.length === 0
                      ? "No positions available"
                      : "Select Position"}
              </option>
              {availablePositions.map((pos) => {
                const positionName = pos.designation_name || pos.name || pos.role_name || pos.title || pos.id;
                return (
                  <option
                    key={pos.id || positionName}
                    value={positionName}
                    className="text-gray-900"
                    style={{ color: '#111827' }}
                  >
                    {positionName}
                  </option>
                );
              })}
            </select>
            {validationErrors.position_name && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.position_name}
              </p>
            )}
          </div>

          {/* Row 4: Remarks / Feedback (full width) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks / Feedback
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remarks / Feedback"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Candidate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;

