import React, { useState } from "react";
import Modal from "./modal";
import Toast from "./toast";

export default function DataTable({ title, items, columns, onAdd, onUpdate, onDelete, loading }) {

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [current, setCurrent] = useState({ id: "", name: "" });
  const [toast, setToast] = useState("");

  const openAdd = () => {
    setMode("add");
    setCurrent({ id: "", name: "" });
    setModalOpen(true);
  };

  const openUpdate = (row) => {
    setMode("update");
    setCurrent({ id: row.id, name: row[columns[1].accessor] });
    setModalOpen(true);
  };

  const openDelete = (row) => {
    setMode("delete");
    setCurrent({ id: row.id, name: row[columns[1].accessor] });
    setModalOpen(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (mode === "add") await onAdd(current.name, showToast);
    if (mode === "update") await onUpdate(current.id, current.name, showToast);
    if (mode === "delete") await onDelete(current.id, showToast);

    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold text-green-800">{title}</h2>
        <button onClick={openAdd} className="px-4 py-2 rounded-md bg-green-600 text-white">Add New</button>
      </div>

      <table className="w-full table-auto">
        <thead className="bg-green-50">
          <tr>
            {columns.map(col => (
              <th key={col.header} className="p-4 text-left text-green-700 font-medium">{col.header}</th>
            ))}
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length + 1} className="p-6 text-center">Loading...</td>
            </tr>
          )}

          {!loading && items.map(row => (
            <tr key={row.id} className="border-t">
              {columns.map(col => (
                <td key={col.accessor} className="p-4">
                  {row[col.accessor]}
                </td>
              ))}
              <td className="p-4">
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded" onClick={() => openUpdate(row)}>Update</button>
                  <button className="px-3 py-1 bg-red-100 text-red-800 rounded" onClick={() => openDelete(row)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={modalOpen} title={`${mode.toUpperCase()} ${title}`} onClose={() => setModalOpen(false)}>
        <form onSubmit={submit}>
          {mode !== "add" && (
            <div className="mb-3">
              <label className="text-sm text-gray-600">ID</label>
              <input value={current.id} readOnly className="w-full p-2 border rounded bg-gray-100 mt-1" />
            </div>
          )}

          <div className="mb-3">
            <label className="text-sm text-gray-600">Name</label>
            <input
              value={current.name}
              onChange={(e) => setCurrent({ ...current, name: e.target.value })}
              readOnly={mode === "delete"}
              required
              className={`w-full p-2 border rounded mt-1 ${mode === "delete" ? "bg-gray-100" : ""}`}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded text-white bg-green-600">
              {mode === "delete" ? "Delete" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
