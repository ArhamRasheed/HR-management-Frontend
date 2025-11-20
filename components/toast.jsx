import React from "react";

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">✕</button>
      </div>
    </div>
  );
}
