import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/footer";
import {
  addDepartment,
  clearDepartmentStatus,
  deleteDepartment,
  fetchDepartments,
  updateDepartment,
} from "../src/store/slices/departmentSlice";
import PageHeader from "../src/components/PageHeader";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function DepartmentsPage() {
  const dispatch = useDispatch();
  const { departments, loading, error, lastActionMessage } = useSelector(
    (state) => state.departments
  );

  // Update modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
    return () => {
      dispatch(clearDepartmentStatus());
    };
  }, [dispatch]);

  // Keep these functions for potential future use, but not actively used
  const onAdd = async (name, toast) => {
    const action = await dispatch(addDepartment({ name }));
    if (addDepartment.fulfilled.match(action)) {
      toast(action.payload?.message || "Department created successfully.");
    } else {
      toast(action.payload || "Unable to add department.");
    }
  };

  const onUpdate = async (id, name, toast) => {
    const action = await dispatch(updateDepartment({ id, name }));
    if (updateDepartment.fulfilled.match(action)) {
      toast(action.payload?.message || "Department updated successfully.");
    } else {
      toast(action.payload || "Unable to update department.");
    }
  };

  const onDelete = async (id, toast) => {
    const action = await dispatch(deleteDepartment({ id }));
    if (deleteDepartment.fulfilled.match(action)) {
      toast(action.payload?.message || "Department deleted successfully.");
    } else {
      toast(action.payload || "Unable to delete department.");
    }
  };

  /**
   * Open update modal and populate with selected department data
   */
  const handleOpenUpdateModal = (department) => {
    setSelectedDepartment(department);
    setUpdatedName(department.department_name);
    setModalError("");
    setIsUpdateModalOpen(true);
  };

  /**
   * Close modal and reset state
   */
  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedDepartment(null);
    setUpdatedName("");
    setModalError("");
    setIsSubmitting(false);
  };

  /**
   * Validate department name uniqueness
   */
  const validateDepartmentName = (name) => {
    if (!name || name.trim() === "") {
      return "Department name cannot be empty";
    }

    const trimmedName = name.trim();

    // Check if another department (different name) has the same name
    const duplicate = departments.find(
      (dept) =>
        dept.department_name !== selectedDepartment?.department_name &&
        dept.department_name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      return `Department name "${trimmedName}" is already used by another department (ID: ${duplicate.id})`;
    }

    return null; // No error
  };

  /**
   * Handle update submission
   */
  const handleUpdateSubmit = async () => {
    // Validate name
    const validationError = validateDepartmentName(updatedName);
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setIsSubmitting(true);
    setModalError("");

    try {
      // Dispatch Redux action
      const action = await dispatch(
        updateDepartment({
          currentName: selectedDepartment.department_name,
          newName: updatedName.trim(),
        })
      );

      if (updateDepartment.fulfilled.match(action)) {
        // Success - data is already refreshed by the thunk
        // Close modal
        handleCloseModal();

        // Success message will be shown via lastActionMessage from Redux
      } else {
        // Failed - show error in modal
        setModalError(action.payload || "Unable to update department");
      }
    } catch (error) {
      setModalError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmpty = !loading && departments.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Departments</h1>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Error loading departments</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchDepartments())}
              className="text-sm text-red-700 font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success message */}
        {lastActionMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800 font-medium">{lastActionMessage}</p>
          </div>
        )}

        {/* Departments card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Card header with title */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
          </div>

          {/* Loading state */}
          {loading && <SimpleSkeletonLoader />}

          {/* Empty state */}
          {isEmpty && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">No departments found</p>
            </div>
          )}

          {/* Table */}
          {!loading && departments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.department_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleOpenUpdateModal(dept)}
                          className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Update Department</h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Department ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department ID
                </label>
                <input
                  type="text"
                  value={selectedDepartment?.id || ""}
                  readOnly
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Department Name (Editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => {
                    setUpdatedName(e.target.value);
                    setModalError(""); // Clear error on change
                  }}
                  placeholder="Enter department name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900 bg-white placeholder-gray-400"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {/* Error Message */}
              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{modalError}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={isSubmitting || !updatedName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

const SimpleSkeletonLoader = () => (
  <div className="px-6 py-4 space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    ))}
  </div>
);
