import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-8">
      <div className="container mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-600">
        <div>© 2024 HR Management System. All rights reserved.</div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-md bg-black text-green-200">About</button>
          <button className="px-4 py-2 rounded-md bg-black text-green-200">Contact</button>
        </div>
      </div>
    </footer>
  );
}
