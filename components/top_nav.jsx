import React from "react";
import { Link } from "react-router-dom";

export default function TopNav() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-md bg-black text-green-400">☰</button>
          <h1 className="text-3xl font-extrabold text-green-700">Employee Dashboard</h1>
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/departments" className="text-green-700 hover:underline">Departments</Link>
          <Link to="/designations" className="text-green-700 hover:underline">Designations</Link>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-600 text-white w-9 h-9 flex items-center justify-center">
              AK
            </div>
            <button className="p-2 rounded-md bg-gray-900 text-white">⤴</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
