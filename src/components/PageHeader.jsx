import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserInitials, getUserDisplayName } from "../utils/userHelpers";

const PageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, loading: authLoading } = useSelector((state) => state.auth);

  const navLinks = [
    { path: "/hr-dashboard", label: "Dashboard" },
    { path: "/employees", label: "Employees" },
    { path: "/recruitment/candidates", label: "Candidates" },
    { path: "/departments", label: "Departments" },
    { path: "/designations", label: "Designations" },
    { path: "/attendance", label: "Attendance" },
    { path: "/complaints", label: "Complaints" },
    { path: "/reports", label: "Reports" },
    { path: "/payroll", label: "Payroll" },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Left side - Logo and nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/hr-dashboard")}
          >
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">HR</span>
            </div>
            <h1 className="text-xl font-bold">HRMS</h1>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`hover:text-gray-300 transition-colors ${
                  isActive(link.path)
                    ? "text-white font-semibold border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side - User profile */}
        <div className="flex items-center gap-3">
          {authLoading ? (
            <>
              <span className="text-sm text-white">Loading...</span>
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center animate-pulse" />
            </>
          ) : (
            <>
              <span className="text-sm text-white">
                {getUserDisplayName(authUser?.full_name, "User")}
              </span>
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials(authUser?.full_name, 2)}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;

