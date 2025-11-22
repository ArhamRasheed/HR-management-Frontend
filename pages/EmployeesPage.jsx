import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, ChevronLeft, ChevronRight, Filter, MoreVertical } from "lucide-react";
import { fetchEmployees, setSearchQuery, setCurrentPage } from "../src/store/slices/employeeSlice";
import { employeeService } from "../src/api/employeeService";
import EmployeeDetailsModal from "../src/components/EmployeeDetailsModal";
import UpdateEmployeeModal from "../src/components/UpdateEmployeeModal";
import DeleteEmployeeModal from "../src/components/DeleteEmployeeModal";
import HireEmployeeModal from "../src/components/HireEmployeeModal";
import Footer from "../components/footer";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const { employees, loading, error, searchQuery, currentPage, itemsPerPage } = useSelector(
    (state) => state.employees
  );
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetailLoading, setEmployeeDetailLoading] = useState(false);
  const [employeeDetailError, setEmployeeDetailError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId].contains(event.target)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenuId]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.full_name?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.phone_number?.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      on_leave: { bg: "bg-yellow-100", text: "text-yellow-800", label: "On Leave" },
      terminated: { bg: "bg-red-100", text: "text-red-800", label: "Terminated" },
    };
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleSeeDetails = async (employeeId) => {
    console.log("handleSeeDetails called with ID:", employeeId);
    setEmployeeDetailLoading(true);
    setEmployeeDetailError(null);
    setIsModalOpen(true);
    setSelectedEmployee(null);

    try {
      const employeeData = await employeeService.fetchEmployeeDetail(employeeId);
      setSelectedEmployee(employeeData);
    } catch (error) {
      setEmployeeDetailError(error.message || "Failed to load employee details.");
    } finally {
      setEmployeeDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setEmployeeDetailError(null);
  };

  const handleUpdateClick = (employee) => {
    setEmployeeToUpdate(employee);
    setIsUpdateModalOpen(true);
    setOpenMenuId(null); // Close the dropdown menu
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalOpen(false);
    setEmployeeToUpdate(null);
    dispatch(fetchEmployees()); // Refresh the list
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null); // Close the dropdown menu
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
    dispatch(fetchEmployees()); // Refresh the list
  };

  const handleAddEmployeeClick = () => {
    setIsHireModalOpen(true);
  };

  const handleHireSuccess = () => {
    setIsHireModalOpen(false);
    dispatch(fetchEmployees()); // Refresh the list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as DepartmentsPage */}
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
              <a href="/employees" className="text-white font-semibold border-b-2 border-white pb-1">
                Employees
              </a>
              <a href="/recruitment/candidates" className="hover:text-gray-300">Candidates</a>
              <a href="/departments" className="hover:text-gray-300">Departments</a>
              <a href="/designations" className="hover:text-gray-300">Designations</a>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Employees</h1>
          <button
            onClick={handleAddEmployeeClick}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Add Employee
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Employees Table Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-gray-900"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center">
              <p className="text-gray-600">Loading employees...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredEmployees.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-600">
                {searchQuery ? "No employees found matching your search." : "No employees yet."}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && paginatedEmployees.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Joining Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Termination Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span>📧</span>
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📞</span>
                            <span>{employee.phone_number}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(employee.employment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.joining_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.termination_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSeeDetails(employee.id)}
                          className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800"
                        >
                          See Details
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div ref={(el) => (menuRefs.current[employee.id] = el)}>
                          <button
                            onClick={() => toggleMenu(employee.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          {openMenuId === employee.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => handleUpdateClick(employee)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                ✏️ Update
                              </button>
                              <button
                                onClick={() => handleDeleteClick(employee)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredEmployees.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of{" "}
                {filteredEmployees.length} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        loading={employeeDetailLoading}
        error={employeeDetailError}
      />

      {/* Update Employee Modal */}
      <UpdateEmployeeModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        employee={employeeToUpdate}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Delete Employee Modal */}
      <DeleteEmployeeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        employee={employeeToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Hire Employee Modal */}
      <HireEmployeeModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onHireSuccess={handleHireSuccess}
      />

      <Footer />
    </div>
  );
};

export default EmployeesPage;

