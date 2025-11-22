import React, { useEffect, useState } from 'react';
import {
  Menu, X, User, Calendar, Shield, Clock, AlertCircle, Home, Users,
  FileText, Settings, LogOut, ChevronDown, ChevronRight, Briefcase,
  UserPlus, Mail, Info, Bell, TrendingUp, AlertTriangle, Grid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchDashboard } from '../src/store/slices/dashboardSlice';
import { ROUTE_PATHS } from '../src/constants/routePaths';
import { API_ENDPOINTS, API_BASE_URL } from '../src/constants/apiEndpoints';
import About from './About';
import Contact from './Contact';

const HRDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData: data, loading, error } = useSelector(state => state.dashboard);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // Defensive data transformation to handle backend data types
  const safeData = data ? {
    ...data,
    // Ensure arrays are always arrays (backend might return numbers)
    new_hires_this_month: Array.isArray(data.new_hires_this_month)
      ? data.new_hires_this_month
      : [],
    pending_leaves: Array.isArray(data.pending_leaves)
      ? data.pending_leaves
      : [],
    // Transform employees_per_department to use consistent field name
    employees_per_department: Array.isArray(data.employees_per_department)
      ? data.employees_per_department.map(dept => ({
        department: dept?.department || 'Unknown',
        employees: dept?.employees || dept?.employee_count || 0  // Support both field names
      }))
      : [],
    // Add fallback user info if missing
    full_name: data.full_name || 'Admin User',
    designation: data.designation || 'HR Manager'
  } : null;

  const handleLogOut = () => {
    fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout()}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        navigate(ROUTE_PATHS.PUBLIC.LOGIN);
      }
    });
  };

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  // Mock data for notifications (API doesn't provide this yet)
  const mockNotifications = [
    { id: 1, type: 'leave', message: '5 new leave applications pending approval', time: '10 mins ago', unread: true },
    { id: 2, type: 'complaint', message: 'New complaint filed by John Doe', time: '1 hour ago', unread: true },
    { id: 3, type: 'status', message: '3 new employees joined today', time: '2 hours ago', unread: false },
    { id: 4, type: 'birthday', message: 'Sarah Johnson\'s birthday tomorrow', time: '3 hours ago', unread: false },
  ];

  // Data derivation from API with robust fallbacks (using safeData)
  const newHires = safeData?.new_hires_this_month || [];
  const pendingLeaves = safeData?.pending_leaves || [];
  const employeesByDept = safeData?.employees_per_department || [];
  const totalEmployees = employeesByDept.reduce((acc, d) => acc + (d?.employees || 0), 0);
  const totalPayroll = safeData?.total_payroll || 0;
  const payrollByDept = employeesByDept.length > 0 && totalEmployees > 0 && totalPayroll > 0
    ? employeesByDept.map((dept, index) => ({
      name: dept?.department || `Dept ${index + 1}`,
      value: Math.round(((dept?.employees || 0) / totalEmployees) * totalPayroll)
    }))
    : [];

  // Get counts for display (might be from API directly or array length)
  const newHiresCount = typeof data?.new_hires_this_month === 'number'
    ? data.new_hires_this_month
    : newHires.length;

  const pendingLeavesCount = typeof data?.pending_leaves === 'number'
    ? data.pending_leaves
    : pendingLeaves.length;

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  // Metric Cards Component
  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, bgAccent, iconBg }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${bgAccent}`} />
        </div>
      </div>
    </div>
  );

  // Donut Chart Component for Attendance
  const AttendanceDonut = ({ present, absent }) => {
    const presentCount = present || 0;
    const absentCount = absent || 0;
    const total = presentCount + absentCount;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    const attendanceData = [
      { name: 'Present', value: presentCount },
      { name: 'Absent', value: absentCount },
    ];

    return (
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">Today's Attendance</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{percentage}%</p>
            <p className="text-sm text-gray-500">{presentCount} Present • {absentCount} Absent</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="h-32 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const DashboardContent = () => (
    <>
      {/* Top Row - Key Metrics (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon={Users}
          title="Total Active Employees"
          value={(safeData?.total_active_employees || 0).toString()}
          trend={newHiresCount > 0 ? `+${newHiresCount} this month` : undefined}
          bgAccent="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <AttendanceDonut present={safeData?.presence_ratio || 0} absent={safeData?.absence_ratio || 0} />

        <MetricCard
          icon={AlertTriangle}
          title="Open Complaints"
          value={(safeData?.unresolved_complaints || 0).toString()}
          subtitle={safeData?.unresolved_complaints > 0
            ? `${Math.floor((safeData.unresolved_complaints || 0) / 3)} High Priority`
            : "No complaints"}
          bgAccent="text-red-600"
          iconBg="bg-red-50"
        />

        <MetricCard
          icon={Shield}
          title="Active Insurance Policies"
          value={(safeData?.total_insurances || 0).toString()}
          subtitle={safeData?.total_insurances
            ? `Health: ${safeData.total_insurances} • Life: ${Math.floor((safeData.total_insurances || 0) * 0.75)}`
            : "No active policies"}
          bgAccent="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Second Row - Analytics Section (2 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* New Hires This Month */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-green-600" />
              New Hires This Month
            </h3>
            <span className="text-sm text-gray-500">{newHiresCount} employees</span>
          </div>
          {newHires.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {newHiresCount > 0
                  ? `${newHiresCount} new hire${newHiresCount !== 1 ? 's' : ''} this month`
                  : "No new hires this month"}
              </p>
              {newHiresCount > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  (Detailed view not available)
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {newHires.map(hire => (
                <div key={hire.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {hire.initials || hire.name?.substring(0, 2).toUpperCase() || '??'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{hire.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{hire.department || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{hire.join_date || hire.joinDate || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-4 w-full text-center text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={newHiresCount === 0}
          >
            View All Employees →
          </button>
        </div>

        {/* Pending Leave Approvals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Pending Leave Approvals
            </h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
              {pendingLeavesCount} Pending
            </span>
          </div>
          {pendingLeaves.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {pendingLeavesCount > 0
                  ? `${pendingLeavesCount} pending leave application${pendingLeavesCount !== 1 ? 's' : ''}`
                  : "No pending leave requests"}
              </p>
              {pendingLeavesCount > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  (Detailed view not available)
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pendingLeaves.map(leave => (
                <div key={leave.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {leave.employee_name || leave.employeeName || 'Unknown Employee'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {leave.leave_type || leave.leaveType || 'Leave'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {leave.days || 0} day(s)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {leave.date_range || leave.dateRange || 'N/A'}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-4 w-full text-center text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pendingLeavesCount === 0}
          >
            View All Applications →
          </button>
        </div>
      </div>

      {/* Third Row - Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Employees by Department (Bar Chart) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Employees by Department</h3>
            <span className="text-sm text-gray-500">Total: {totalEmployees}</span>
          </div>
          {employeesByDept.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500 text-sm">No department data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeesByDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="employees" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payroll Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Payroll Overview</h3>
            <p className="text-3xl font-bold text-gray-900">
              PKR {(safeData?.total_payroll || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total Payroll This Month</p>
          </div>
          {payrollByDept.length === 0 || totalPayroll === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-gray-500 text-sm">No payroll data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={payrollByDept}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {payrollByDept.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `PKR ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            View Detailed Report
          </button>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              {activePage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            <p className="text-gray-600">
              This page will load the <strong>{activePage}</strong> component.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Import and render your component here: <code className="bg-gray-100 px-2 py-1 rounded">{'<' + activePage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('') + ' />'}</code>
            </p>
          </div>
        );
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchDashboard())}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-green-800 to-green-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">HR Portal</h2>
        </div>
        <nav className="mt-6 overflow-y-auto h-[calc(100vh-120px)]">
          {/* Dashboard */}
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'dashboard' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Home className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </button>

          {/* Manage Departments */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.DEPARTMENTS)}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-departments' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Grid className="w-5 h-5 mr-3" />
            <span>Manage Departments</span>
          </button>

          {/* Manage Employees */}
          <button
            onClick={() => handleNavigation('manage-employees')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-employees' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span>Manage Employees</span>
          </button>

          {/* Manage Designations */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.DESIGNATIONS)}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-designations' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Briefcase className="w-5 h-5 mr-3" />
            <span>Manage Designations</span>
          </button>

          {/* Manage Leaves - with submenu */}
          <div>
            <button
              onClick={() => toggleSubmenu('leaves')}
              className="flex items-center justify-between w-full px-6 py-3 hover:bg-green-700 transition-colors"
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" />
                <span>Manage Leaves</span>
              </div>
              {expandedMenus.leaves ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedMenus.leaves && (
              <div className="bg-green-900 bg-opacity-50">
                <button
                  onClick={() => handleNavigation('leave-types')}
                  className={`flex items-center w-full px-12 py-2 hover:bg-green-700 transition-colors text-sm ${activePage === 'leave-types' ? 'bg-green-700' : ''}`}
                >
                  Leave Types
                </button>
                <button
                  onClick={() => handleNavigation('leave-applications')}
                  className={`flex items-center w-full px-12 py-2 hover:bg-green-700 transition-colors text-sm ${activePage === 'leave-applications' ? 'bg-green-700' : ''}`}
                >
                  Leave Applications
                </button>
              </div>
            )}
          </div>

          {/* Manage Insurance - with submenu */}
          <div>
            <button
              onClick={() => toggleSubmenu('insurance')}
              className="flex items-center justify-between w-full px-6 py-3 hover:bg-green-700 transition-colors"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-3" />
                <span>Manage Insurance</span>
              </div>
              {expandedMenus.insurance ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {expandedMenus.insurance && (
              <div className="bg-green-900 bg-opacity-50">
                <button
                  onClick={() => handleNavigation('insurance-plans')}
                  className={`flex items-center w-full px-12 py-2 hover:bg-green-700 transition-colors text-sm ${activePage === 'insurance-plans' ? 'bg-green-700' : ''}`}
                >
                  Insurance Plans
                </button>
                <button
                  onClick={() => handleNavigation('employee-insurance')}
                  className={`flex items-center w-full px-12 py-2 hover:bg-green-700 transition-colors text-sm ${activePage === 'employee-insurance' ? 'bg-green-700' : ''}`}
                >
                  Employee Insurance
                </button>
              </div>
            )}
          </div>

          {/* Manage Complaints */}
          <button
            onClick={() => handleNavigation('manage-complaints')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-complaints' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>Manage Complaints</span>
          </button>

          {/* Manage Candidates */}
          <button
            onClick={() => handleNavigation('manage-candidates')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-candidates' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <UserPlus className="w-5 h-5 mr-3" />
            <span>Manage Candidates</span>
          </button>

          {/* About */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.ABOUT)}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'about' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Info className="w-5 h-5 mr-3" />
            <span>About</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.CONTACT)}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'contact' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Mail className="w-5 h-5 mr-3" />
            <span>Contact</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavigation('settings')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'settings' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Navbar */}
        <header className="bg-white shadow-md z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-green-600">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="ml-4 text-2xl font-bold text-green-800">HR Portal</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {mockNotifications.filter(n => n.unread).length}
                  </span>
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
                        >
                          <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-200">
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{safeData?.full_name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">{safeData?.designation || 'N/A'}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {(safeData?.full_name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-800">{safeData?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{safeData?.designation || 'N/A'}</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation('settings')}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 HR Management System. All rights reserved.</p>
            <div className="flex space-x-4">
              <button onClick={() => navigate(ROUTE_PATHS.PROTECTED.ABOUT)} className="hover:text-green-600">About</button>
              <button onClick={() => navigate(ROUTE_PATHS.PROTECTED.CONTACT)} className="hover:text-green-600">Contact</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HRDashboard;


// import React from 'react';

// const HRDashboard = () => {
//   console.log('📊 HRDASHBOARD - Component rendering START');
//   console.log('📊 HRDASHBOARD - Component rendering END');

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'linear-gradient(to bottom right, #10b981, #0891b2)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: 'white',
//       fontSize: '32px',
//       fontWeight: 'bold'
//     }}>
//       ✅ DASHBOARD LOADED SUCCESSFULLY!
//       <br />
//       <small style={{ fontSize: '16px', marginTop: '20px' }}>
//         If you see this, routing is working!
//       </small>
//     </div>
//   );
// };

// export default HRDashboard;