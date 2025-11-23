import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDesignations } from "../src/store/slices/designationSlice";
import UpdateDesignationModal from "../src/components/UpdateDesignationModal";
import Footer from "../components/footer";

const DesignationsPage = () => {
  const dispatch = useDispatch();
  const { designations, loading, error } = useSelector((state) => state.designations);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  useEffect(() => {
    dispatch(fetchDesignations());
  }, [dispatch]);

  // Format ID to display as "DES001", "DES002", etc.
  const formatDesignationId = (id) => {
    return `DES${String(id).padStart(3, "0")}`;
  };

  const handleOpenUpdateModal = (designation) => {
    setSelectedDesignation(designation);
    setShowUpdateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as EmployeesPage */}
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
              <a href="/recruitment/candidates" className="hover:text-gray-300">Candidates</a>
              <a href="/departments" className="hover:text-gray-300">Departments</a>
              <a href="/designations" className="text-white font-semibold border-b-2 border-white pb-1">
                Designations
              </a>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Designations</h1>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Designations Table Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Designations</h2>

            {/* Loading State */}
            {loading && (
              <div className="p-12 text-center">
                <p className="text-gray-600">Loading designations...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && designations.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-600">No designations found.</p>
              </div>
            )}

            {/* Table */}
            {!loading && designations.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Designation Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {designations.map((designation) => (
                      <tr key={designation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDesignationId(designation.id)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {designation.designation_name}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleOpenUpdateModal(designation)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
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
        </div>
      </main>

      {/* Update Designation Modal */}
      <UpdateDesignationModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedDesignation(null);
        }}
        designation={selectedDesignation}
      />

      <Footer />
    </div>
  );
};

export default DesignationsPage;
