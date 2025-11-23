import React, { useEffect, useState, useMemo } from "react";
import { Search, Calendar, CheckCircle2, Clock, XCircle, Play } from "lucide-react";
import { payrollService } from "../src/api/payrollService";
import Footer from "../components/footer";

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  useEffect(() => {
    fetchPayrollHistory();
  }, []);

  const fetchPayrollHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await payrollService.getPayrollHistory();
      // Handle different response structures
      const payrollData = response.Payrolls || response.payrolls || response.data || [];
      setPayrolls(payrollData);
    } catch (err) {
      console.error("Failed to fetch payroll history:", err);
      setError(err.message || "Failed to load payroll history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format month number to month name
  const formatMonth = (monthNum) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNum - 1] || `Month ${monthNum}`;
  };

  // Format period (month and year)
  const formatPeriod = (month, year) => {
    if (!month || !year) return "N/A";
    return `${formatMonth(month)} ${year}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "$0.00";
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();
    
    if (statusLower === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-4 h-4" />
          Paid
        </span>
      );
    } else if (statusLower === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4" />
          Pending
        </span>
      );
    } else if (statusLower === "failed") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="w-4 h-4" />
          Failed
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        {status || "Unknown"}
      </span>
    );
  };

  // Filter payrolls
  const filteredPayrolls = useMemo(() => {
    let filtered = [...payrolls];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((payroll) => {
        const employeeName = (payroll.employee || "").toLowerCase();
        const employeeId = (payroll.employee_id || payroll.id || "").toString().toLowerCase();
        return employeeName.includes(query) || employeeId.includes(query);
      });
    }

    // Month filter
    if (monthFilter !== "All Months") {
      const monthNum = parseInt(monthFilter);
      filtered = filtered.filter((payroll) => payroll.month === monthNum);
    }

    // Status filter
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter(
        (payroll) => (payroll.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [payrolls, searchQuery, monthFilter, statusFilter]);

  // Generate unique ID for each payroll (if not provided)
  const getPayrollId = (index, payroll) => {
    return payroll.id || payroll.payroll_id || `#${1001 + index}`;
  };

  // Get employee ID (if not provided, generate from index)
  const getEmployeeId = (index, payroll) => {
    return payroll.employee_id || `ID: ${String(index + 1).padStart(2, "0")}`;
  };

  // Get payment date (if not provided, use period)
  const getPaymentDate = (payroll) => {
    if (payroll.payment_date) return payroll.payment_date;
    if (payroll.year && payroll.month) {
      const date = new Date(payroll.year, payroll.month - 1, 15);
      return date.toISOString().split("T")[0];
    }
    return "N/A";
  };

  // Get bonuses and deductions (mock for now, as API may not provide)
  const getBonusDeduction = (payroll) => {
    if (payroll.bonus && payroll.deduction) {
      return `+${payroll.bonus} Bns -${payroll.deduction} Ded`;
    }
    if (payroll.bonus) {
      return `+${payroll.bonus} Bns`;
    }
    if (payroll.deduction) {
      return `-${payroll.deduction} Ded`;
    }
    return null;
  };

  const handleGeneratePayroll = () => {
    // TODO: Implement payroll generation
    alert("Payroll generation feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded">
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold">HRMS</h1>
          </div>

          <nav className="flex gap-6">
            <a href="/hr-dashboard" className="hover:text-gray-300">Dashboard</a>
            <a href="/employees" className="hover:text-gray-300">Employees</a>
            <a href="/payroll" className="text-white font-semibold">Payroll</a>
            <a href="/departments" className="hover:text-gray-300">Departments</a>
            <a href="/designations" className="hover:text-gray-300">Designations</a>
            <a href="/reports" className="hover:text-gray-300">Reports</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm">John Doe</span>
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payroll Management</h1>
            <p className="text-gray-600">View history and generate monthly payrolls</p>
          </div>
          <button
            onClick={handleGeneratePayroll}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            Generate Payroll
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by employee or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Month Filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All Months">All Months</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                  EMPLOYEE
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                  PERIOD
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                  NET SALARY
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                  STATUS
                </th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                  PAYMENT DATE
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Loading payroll data...
                  </td>
                </tr>
              ) : filteredPayrolls.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No payroll records found.
                  </td>
                </tr>
              ) : (
                filteredPayrolls.map((payroll, index) => {
                  const payrollId = getPayrollId(index, payroll);
                  const employeeId = getEmployeeId(index, payroll);
                  const netSalary = payroll["net salary"] || payroll.net_salary || payroll.netSalary || 0;
                  const bonusDeduction = getBonusDeduction(payroll);

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      {/* ID Column */}
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-bold">
                          {typeof payrollId === "string" && payrollId.startsWith("#")
                            ? payrollId
                            : `#${payrollId}`}
                        </span>
                      </td>

                      {/* Employee Column */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payroll.employee || "Unknown Employee"}
                          </div>
                          <div className="text-sm text-gray-500">{employeeId}</div>
                        </div>
                      </td>

                      {/* Period Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatPeriod(payroll.month, payroll.year)}
                        </div>
                      </td>

                      {/* Net Salary Column */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900">
                            {formatCurrency(netSalary)}
                          </div>
                          {bonusDeduction && (
                            <div className="text-sm text-gray-500">{bonusDeduction}</div>
                          )}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">{getStatusBadge(payroll.status)}</td>

                      {/* Payment Date Column */}
                      <td className="px-6 py-4 text-gray-700">{getPaymentDate(payroll)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PayrollPage;

