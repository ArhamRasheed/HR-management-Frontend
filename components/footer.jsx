import React from "react";
import { useNavigate } from "react-router-dom";
export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-white border-t mt-8">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-600">
        <div>© 2024 HR Management System. All rights reserved.</div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md bg-black text-green-200" onClick={navigate('/about')}>About</button>
          <button className="px-4 py-2 rounded-md bg-black text-green-200" onClick={navigate('/conatct')}>Contact</button>
        </div>
      </div>
    </footer>
  );
}
