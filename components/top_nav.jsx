import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessibleRoutes, getDefaultRoute } from "../src/utils/navigationHelpers";
import { ROUTE_PATHS } from "../src/constants/routePaths";

export default function TopNav() {
  const { user } = useSelector((state) => state.auth);

  const accessibleLinks = useMemo(() => getAccessibleRoutes(user?.department), [user?.department]);
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0])
        .join("")
        .toUpperCase()
    : user?.email?.slice(0, 2)?.toUpperCase() || "HR";

  return (
    <header className="w-full bg-white/95 backdrop-blur shadow-md border-b border-emerald-50 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-xl border border-emerald-100 text-emerald-500 hover:bg-emerald-50 transition"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <Link to={getDefaultRoute(user?.department) || ROUTE_PATHS.PROTECTED.DASHBOARD}>
            <h1 className="text-2xl font-black text-emerald-700 tracking-tight">HR Command</h1>
          </Link>
        </div>

        <nav className="flex items-center gap-5">
          {accessibleLinks.length === 0 && (
            <span className="text-sm text-gray-500">No navigation available</span>
          )}
          {accessibleLinks.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pl-3 border-l border-emerald-100">
            <div className="rounded-full bg-emerald-600 text-white w-9 h-9 flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-emerald-400">Signed in as</p>
              <p className="text-sm font-semibold text-emerald-900">{user?.department || "Unknown"}</p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
