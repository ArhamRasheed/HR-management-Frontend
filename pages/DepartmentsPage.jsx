import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNav from "../components/top_nav";
import Footer from "../components/footer";
import DataTable from "../components/table";
import {
  addDepartment,
  clearDepartmentStatus,
  deleteDepartment,
  fetchDepartments,
  updateDepartment,
} from "../src/store/slices/departmentSlice";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function DepartmentsPage() {
  const dispatch = useDispatch();
  const { departments, loading, error, lastActionMessage } = useSelector(
    (state) => state.departments
  );

  useEffect(() => {
    dispatch(fetchDepartments());
    return () => {
      dispatch(clearDepartmentStatus());
    };
  }, [dispatch]);

  const onAdd = async (name, toast) => {
    const action = await dispatch(addDepartment({ name }));
    if (addDepartment.fulfilled.match(action)) {
      toast(action.payload?.message || "Department created successfully.");
    } else {
      toast(action.payload || "Unable to add department.");
    }
  };

  const onUpdate = async (id, name, toast) => {
    const action = await dispatch(updateDepartment({ id, name }));
    if (updateDepartment.fulfilled.match(action)) {
      toast(action.payload?.message || "Department updated successfully.");
    } else {
      toast(action.payload || "Unable to update department.");
    }
  };

  const onDelete = async (id, toast) => {
    const action = await dispatch(deleteDepartment({ id }));
    if (deleteDepartment.fulfilled.match(action)) {
      toast(action.payload?.message || "Department deleted successfully.");
    } else {
      toast(action.payload || "Unable to delete department.");
    }
  };

  const isEmpty = !loading && departments.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <TopNav />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/70">
          <p className="text-sm uppercase text-emerald-500 tracking-[0.3em]">
            People & Culture
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Departments Directory</h1>
              <p className="text-gray-600 mt-2">
                Organise your teams, maintain accountability, and grow with clarity.
              </p>
            </div>
            {lastActionMessage && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">{lastActionMessage}</span>
              </div>
            )}
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl shadow">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold">We could not load departments</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchDepartments())}
              className="text-xs font-semibold text-red-700 underline-offset-4 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/70 p-6">
          {loading && <SkeletonGrid />}
          {isEmpty && (
            <div className="border border-dashed border-emerald-200 rounded-2xl p-8 text-center bg-emerald-50/40">
              <p className="text-lg font-semibold text-emerald-800">No departments yet</p>
              <p className="text-sm text-emerald-600 mt-2">
                Start by adding your first department to keep your organisation tidy.
              </p>
            </div>
          )}

          <div className="mt-6">
            <DataTable
              title="Departments"
              items={departments}
              loading={loading}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Department Name", accessor: "department_name" },
              ]}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[...Array(4)].map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="h-24 rounded-2xl bg-gradient-to-r from-emerald-100/60 via-white to-emerald-100 animate-pulse border border-white/60"
      />
    ))}
  </div>
);
