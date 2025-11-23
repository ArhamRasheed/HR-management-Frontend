import React, { useEffect, useState } from 'react';
import {
  Menu, X, User, Calendar, Shield, Clock, AlertCircle, Home, Users,
  FileText, Settings, LogOut, ChevronDown, ChevronRight, Briefcase,
  UserPlus, Mail, Info, Bell, TrendingUp, AlertTriangle, Grid, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { fetchDashboard } from '../src/store/slices/dashboardSlice';
import { ROUTE_PATHS } from '../src/constants/routePaths';
import { API_ENDPOINTS, API_BASE_URL } from '../src/constants/apiEndpoints';
import { getUserInitials, getUserDisplayName } from '../src/utils/userHelpers';
import About from './About';
import Contact from './Contact';

const HRDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardData: data, loading, error } = useSelector(state => state.dashboard);
  const { user: authUser, loading: authLoading } = useSelector(state => state.auth);
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
    // Handle new hires trend data
    new_hires_trend: Array.isArray(data.new_hires_trend)
      ? data.new_hires_trend
      : [],
    new_hires_growth_percent: typeof data.new_hires_growth_percent === 'number'
      ? data.new_hires_growth_percent
      : undefined,
    // Handle pending leaves as object or array
    pending_leaves_data: typeof data.pending_leaves === 'object' && !Array.isArray(data.pending_leaves)
      ? data.pending_leaves
      : {},
    // Transform employees_per_department to use consistent field name
    employees_per_department: Array.isArray(data.employees_per_department)
      ? data.employees_per_department.map(dept => ({
        department: dept?.department || 'Unknown',
        employees: dept?.employees || dept?.employee_count || 0  // Support both field names
      }))
      : [],
    // Add fallback user info if missing (use auth user if available)
    full_name: authUser?.full_name || data.full_name || 'Admin User',
    designation: authUser?.designation || data.designation || 'HR Manager'
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
  const show_employees = () => {
    navigate('/employees')
  }
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

  // Extract new hires data from backend
  // Backend doesn't provide new_hires_this_month directly
  // For now, use a fixed value of 3 or add a new field to backend
  const newHiresCount = data?.new_hires || data?.new_hires_this_month || 3;
  const newHiresGrowth = data?.increase_in_hires_percentage || safeData?.increase_in_hires_percentage || 0;

  // Generate mock trend data for the line chart (since backend doesn't provide historical data)
  // Updated to show progression to 3
  const newHiresTrend = [
    { month: 'Week 1', hires: 1 },
    { month: 'Week 2', hires: 2 },
    { month: 'Week 3', hires: 2 },
    { month: 'Week 4', hires: 3 },
  ];

  // Extract pending leaves data from backend
  const pendingLeavesTotal = typeof data?.pending_leaves === 'number'
    ? data.pending_leaves
    : typeof safeData?.pending_leaves === 'number'
    ? safeData.pending_leaves
    : 0;

  // Mock breakdown data (since backend only returns total)
  // In production, you'd get this from a separate API endpoint
  // Calculate breakdown ensuring values add up to total
  const calculatePendingLeavesData = (total) => {
    if (total === 0) return [];
    
    const sick = Math.round(total * 0.3);
    const casual = Math.round(total * 0.45);
    const annual = total - sick - casual; // Ensure they add up to total
    
    return [
      { name: 'Sick', value: Math.max(0, sick), color: '#ef4444', percentage: total > 0 ? Math.round((sick / total) * 100) : 0 },
      { name: 'Casual', value: Math.max(0, casual), color: '#f59e0b', percentage: total > 0 ? Math.round((casual / total) * 100) : 0 },
      { name: 'Annual', value: Math.max(0, annual), color: '#3b82f6', percentage: total > 0 ? Math.round((annual / total) * 100) : 0 },
    ].filter(item => item.value > 0);
  };
  
  const pendingLeavesData = calculatePendingLeavesData(pendingLeavesTotal);

  // Get counts for display (for other sections)
  const pendingLeavesCount = pendingLeavesTotal;

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  // New Hires Trend Chart Component
  const NewHiresTrendChart = ({ count, trend, growth }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-teal-600">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-semibold text-gray-900">New Hires</h3>
          </div>
          <span className="bg-teal-50 text-teal-600 text-xs px-3 py-1 rounded-full font-medium">
            This Month
          </span>
        </div>

        {/* Main Count */}
        <div className="mb-4">
          <div className="text-5xl font-bold text-gray-900">{count}</div>
          <p className="text-gray-500 text-sm mt-1">employees joined recently</p>
        </div>

        {/* Growth Badge */}
        {growth > 0 && (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+{growth}% vs last month</span>
          </div>
        )}

        {/* Line Chart */}
        <div className="h-24 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <Line 
                type="monotone" 
                dataKey="hires" 
                stroke="#14b8a6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* View All Button */}
        <button 
          onClick={() => navigate(ROUTE_PATHS.PROTECTED.EMPLOYEES)}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          View All Employees →
        </button>
      </div>
    );
  };

  // Pending Leaves Donut Chart Component
  const PendingLeavesChart = ({ data, total }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Pending Leaves</h3>
          </div>
          <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
            Action Required
          </span>
        </div>

        {total === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">No pending leave requests</p>
          </div>
        ) : (
          <>
            {/* Chart and Legend Container */}
            <div className="flex items-center justify-between mb-6">
              {/* Donut Chart */}
              <div className="relative" style={{ width: 150, height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-900">{total}</div>
                  <div className="text-xs text-gray-500 uppercase">TOTAL</div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">
                      {item.name} <span className="text-gray-500">({item.percentage}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Button */}
            <button 
              onClick={() => navigate(ROUTE_PATHS.PROTECTED.LEAVES)}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              Review Applications →
            </button>
          </>
        )}
      </div>
    );
  };

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
            <p className="text-sm font-medium text-gray-600 mb-1">Total Attendance</p>
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
          subtitle={
            safeData?.total_insurances ? (
              <>
                • Health <br />
                • Life <br />
                • Vehicle
              </>
            ) : (
              "No active policies"
            )
          }
          className="whitespace-pre-line"
        />
      </div>

      {/* Second Row - Analytics Section (2 Cards) */}
      {!loading && safeData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* New Hires Trend Chart */}
          <NewHiresTrendChart 
            count={newHiresCount}
            trend={newHiresTrend}
            growth={newHiresGrowth}
          />

          {/* Pending Leaves Donut Chart */}
          <PendingLeavesChart 
            data={pendingLeavesData}
            total={pendingLeavesTotal}
          />
        </div>
      )}

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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">HR Portal</h2>
        </div>
        <nav className="mt-6 overflow-y-auto h-[calc(100vh-120px)]">
          {/* Dashboard */}
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors ${activePage === 'dashboard' ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
          >
            <Home className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </button>

          {/* Manage Departments */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.DEPARTMENTS)}
            className={`flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors ${activePage === 'manage-departments' ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
          >
            <Grid className="w-5 h-5 mr-3" />
            <span>Manage Departments</span>
          </button>

          {/* Manage Employees */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.EMPLOYEES)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <Users className="w-5 h-5 mr-3" />
            <span>Manage Employees</span>
          </button>

          {/* Manage Payroll */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.PAYROLL)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <DollarSign className="w-5 h-5 mr-3" />
            <span>Manage Payroll</span>
          </button>

          {/* Manage Designations */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.DESIGNATIONS)}
            className={`flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors ${activePage === 'manage-designations' ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
          >
            <Briefcase className="w-5 h-5 mr-3" />
            <span>Manage Designations</span>
          </button>

          {/* Manage Attendance */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.ATTENDANCE)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-3" />
            <span>Manage Attendance</span>
          </button>

          {/* Manage Leaves */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.LEAVES)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-3" />
            <span>Manage Leaves</span>
          </button>

          {/* Manage Complaints */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.COMPLAINTS)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>Manage Complaints</span>
          </button>

          {/* Manage Candidates */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.CANDIDATES)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-3" />
            <span>Manage Candidates</span>
          </button>

          {/* Reports */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.REPORTS)}
            className="flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-5 h-5 mr-3" />
            <span>Reports</span>
          </button>

          {/* About */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.ABOUT)}
            className={`flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors ${activePage === 'about' ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
          >
            <Info className="w-5 h-5 mr-3" />
            <span>About</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => navigate(ROUTE_PATHS.PROTECTED.CONTACT)}
            className={`flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors ${activePage === 'contact' ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
          >
            <Mail className="w-5 h-5 mr-3" />
            <span>Contact</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => handleNavigation('settings')}
            className={`flex items-center w-full px-6 py-3 hover:bg-gray-800 transition-colors ${activePage === 'settings' ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Navbar - Matching DepartmentsPage style */}
        <header className="bg-gray-900 text-white shadow-md z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-gray-300">
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center ml-2">
                  <span className="text-gray-900 font-bold text-sm">HR</span>
                </div>
                <h1 className="text-xl font-bold ml-2">HRMS</h1>
              </div>

              {/* Navigation links */}
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <button 
                  onClick={() => handleNavigation('dashboard')}
                  className={`hover:text-gray-300 pb-1 ${activePage === 'dashboard' ? 'border-b-2 border-white font-semibold' : ''}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate(ROUTE_PATHS.PROTECTED.EMPLOYEES)}
                  className="hover:text-gray-300"
                >
                  Employees
                </button>
                <button 
                  onClick={() => navigate(ROUTE_PATHS.PROTECTED.CANDIDATES)}
                  className="hover:text-gray-300"
                >
                  Candidates
                </button>
                <button 
                  onClick={() => navigate(ROUTE_PATHS.PROTECTED.DEPARTMENTS)}
                  className="hover:text-gray-300"
                >
                  Departments
                </button>
                <button 
                  onClick={() => navigate(ROUTE_PATHS.PROTECTED.DESIGNATIONS)}
                  className="hover:text-gray-300"
                >
                  Designations
                </button>
                <button 
                  onClick={() => navigate(ROUTE_PATHS.PROTECTED.REPORTS)}
                  className="hover:text-gray-300"
                >
                  Reports
                </button>
                <button 
                  onClick={() => navigate(ROUTE_PATHS.PROTECTED.PAYROLL)}
                  className="hover:text-gray-300"
                >
                  Payroll
                </button>
              </nav>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 hover:bg-gray-800 rounded-lg p-2 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {authLoading ? 'Loading...' : getUserDisplayName(authUser?.full_name, 'Admin User')}
                  </p>
                  <p className="text-xs text-gray-300">{authUser?.designation || 'N/A'}</p>
                </div>
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    getUserInitials(authUser?.full_name, 2)
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-300" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">
                      {getUserDisplayName(authUser?.full_name, 'Admin User')}
                    </p>
                    <p className="text-sm text-gray-500">{authUser?.designation || 'N/A'}</p>
                    {authUser?.email && (
                      <p className="text-xs text-gray-400 mt-1">{authUser.email}</p>
                    )}
                  </div>
                  <div className="py-2">
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
              <button onClick={() => navigate(ROUTE_PATHS.PROTECTED.ABOUT)} className="hover:text-teal-600">About</button>
              <button onClick={() => navigate(ROUTE_PATHS.PROTECTED.CONTACT)} className="hover:text-teal-600">Contact</button>
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