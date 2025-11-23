import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import {
  fetchAttendance,
  setSearchQuery,
  setStartDate,
  setEndDate,
  clearFilters,
} from "../src/store/slices/attendanceSlice";
import Footer from "../components/footer";

const AttendancePage = () => {
  const dispatch = useDispatch();
  const {
    filteredAttendances,
    searchQuery,
    startDate,
    endDate,
    loading,
    error,
  } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const statusColors = {
      present: "bg-green-100 text-green-800",
      Present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      Absent: "bg-red-100 text-red-800",
      Late: "bg-yellow-100 text-yellow-800",
      late: "bg-yellow-100 text-yellow-800",
      "On Leave": "bg-blue-100 text-blue-800",
    };

    // Capitalize first letter for display
    const displayStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const colorClass =
      statusColors[status] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        {displayStatus}
      </span>
    );
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time; // Already in HH:MM:SS format from backend
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
              <a href="/designations" className="hover:text-gray-300">Designations</a>
              <a href="/attendance" className="text-white font-semibold border-b-2 border-white pb-1">
                Attendance
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Attendance</h1>
        </div>

        {/* Search and Date Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            {/* Search Bar */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Date */}
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => dispatch(setStartDate(e.target.value))}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => dispatch(setEndDate(e.target.value))}
                className="bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || startDate || endDate) && (
              <button
                onClick={() => dispatch(clearFilters())}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Check Out
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      {searchQuery || startDate || endDate
                        ? "No attendance records found matching your filters."
                        : "No attendance records found."}
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((attendance, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {attendance.employee_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {attendance.employee_id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {attendance.date}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(attendance.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatTime(attendance.check_in_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatTime(attendance.check_out_time)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AttendancePage;

