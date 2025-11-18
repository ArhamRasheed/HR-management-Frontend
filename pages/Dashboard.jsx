import React, { useState } from 'react';
import { Menu, X, User, Calendar, Shield, Clock, AlertCircle, Home, Users, FileText, Settings, LogOut, ChevronDown, ChevronRight, Briefcase, UserPlus, Mail, Phone, MapPin } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';
let employeeData = null;
fetch(`${API_BASE_URL}/dashboard`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => employeeData = data)
  .catch(error => console.error('Error fetching employee data:', error));

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState({});

  // Sample data based on your backend response

  const handleLogOut = () => {
    fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) {
        window.location.href = '/login';
      }
    });
  }
  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    // Here you would typically use React Router
    // For now, we'll just show a placeholder message
    console.log(`Navigating to: ${page}`);
  };

  const StatCard = ({ icon: Icon, title, value, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-700 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{value}</p>
        </div>
        <div className="bg-white bg-opacity-50 p-3 rounded-full">
          <Icon className="w-8 h-8 text-green-700" />
        </div>
      </div>
    </div>
  );

  const Contact = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Contact Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Email</p>
              <p className="text-gray-600">hr@company.com</p>
              <p className="text-gray-600">support@company.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Phone</p>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600">+1 (555) 987-6543</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Office Address</p>
              <p className="text-gray-600">123 Business Park</p>
              <p className="text-gray-600">Suite 456, City, State 12345</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">Office Hours</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <h3 className="font-semibold text-gray-800 mb-2">HR Department</h3>
            <p className="text-sm text-gray-600">For any HR-related queries, please reach out during office hours.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const About = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">About HR Management System</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 mb-4">
          Welcome to our comprehensive HR Management System. We are dedicated to streamlining human resource operations
          and empowering organizations to manage their most valuable asset - their people.
        </p>
        <h3 className="text-xl font-semibold text-green-700 mb-3">Our Mission</h3>
        <p className="text-gray-700 mb-4">
          To provide innovative and efficient HR solutions that enable organizations to focus on growth while we handle
          the complexities of workforce management, compliance, and employee engagement.
        </p>
        <h3 className="text-xl font-semibold text-green-700 mb-3">Key Features</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Comprehensive employee management</li>
          <li>Automated leave and attendance tracking</li>
          <li>Insurance and benefits administration</li>
          <li>Complaint and grievance handling</li>
          <li>Recruitment and candidate management</li>
          <li>Department and designation management</li>
        </ul>
        <h3 className="text-xl font-semibold text-green-700 mb-3">Our Commitment</h3>
        <p className="text-gray-700">
          We are committed to providing a secure, reliable, and user-friendly platform that adapts to your organization's
          unique needs. Our system is built with the latest technology to ensure data security and seamless performance.
        </p>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <>
      {/* Employee Info Card */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{employeeData.full_name}</h2>
            <div className="flex items-center space-x-6 mt-2">
              <span className="text-green-100">{employeeData.designation}</span>
              <span className="text-green-100">•</span>
              <span className="text-green-100">{employeeData.department}</span>
              <span className="text-green-100">•</span>
              <span className="text-green-100">Joined: {new Date(employeeData.date_of_joining).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={Calendar} title="Leave Balance" value="15 Days" bgColor="bg-green-100" />
        <StatCard icon={Shield} title="Active Policies" value={employeeData.insurances.length} bgColor="bg-green-50" />
        <StatCard icon={Clock} title="Hours This Week" value="42.5" bgColor="bg-green-100" />
        <StatCard icon={AlertCircle} title="Open Complaints" value={employeeData.complaints.filter(c => c.status !== 'Resolved').length} bgColor="bg-green-50" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Leaves */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Leaves
          </h3>
          <div className="space-y-3">
            {employeeData.leaves.map(leave => (
              <div key={leave.id} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{leave.type}</p>
                    <p className="text-sm text-gray-600">{leave.start_date} to {leave.end_date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                    {leave.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{leave.days} day(s)</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Policies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Insurance Policies
          </h3>
          <div className="space-y-3">
            {employeeData.insurances.map(insurance => (
              <div key={insurance.id} className="border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800">{insurance.type}</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    {insurance.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Provider: {insurance.provider}</p>
                <p className="text-sm text-gray-600">Policy: {insurance.policy_number}</p>
                <p className="text-sm font-medium text-green-700 mt-1">Coverage: {insurance.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Attendance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-800">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeeData.attendances.map((attendance, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{attendance.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{attendance.check_in}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{attendance.check_out}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{attendance.hours} hrs</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {attendance.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaints */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Complaints & Requests
        </h3>
        <div className="space-y-3">
          {employeeData.complaints.map(complaint => (
            <div key={complaint.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{complaint.title}</p>
                <p className="text-sm text-gray-600">Submitted: {complaint.date}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.priority === 'High' ? 'bg-red-100 text-red-700' :
                    complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                  }`}>
                  {complaint.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                  {complaint.status}
                </span>
              </div>
            </div>
          ))}
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
            onClick={() => handleNavigation('manage-departments')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-departments' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <Briefcase className="w-5 h-5 mr-3" />
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
            onClick={() => handleNavigation('manage-designations')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'manage-designations' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <FileText className="w-5 h-5 mr-3" />
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
            onClick={() => handleNavigation('about')}
            className={`flex items-center w-full px-6 py-3 hover:bg-green-700 transition-colors ${activePage === 'about' ? 'bg-green-700 border-l-4 border-green-400' : ''}`}
          >
            <FileText className="w-5 h-5 mr-3" />
            <span>About</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => handleNavigation('contact')}
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
        {/* Navbar */}
        <header className="bg-white shadow-md z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-green-600">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="ml-4 text-2xl font-bold text-green-800">
                {activePage === 'dashboard' ? 'Employee Dashboard' : activePage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{employeeData.full_name}</p>
                <p className="text-xs text-gray-500">{employeeData.designation}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {employeeData.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="text-gray-600 hover:text-green-600">
                <LogOut onClick={handleLogOut} className="w-5 h-5" />
              </button>
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
              <button onClick={() => handleNavigation('about')} className="hover:text-white">About</button>
              <button onClick={() => handleNavigation('contact')} className="hover:text-white">Contact</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;