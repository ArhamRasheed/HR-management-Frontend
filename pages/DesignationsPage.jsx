import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNav from "../components/top_nav";
import Footer from "../components/footer";
import DataTable from "../components/table";
import {
  addDesignation,
  clearDesignationStatus,
  deleteDesignation,
  fetchDesignations,
  updateDesignation,
} from "../src/store/slices/designationSlice";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DesignationsPage() {
  const dispatch = useDispatch();
  const { designations, loading, error, lastActionMessage } = useSelector(
    (state) => state.designations
  );

  useEffect(() => {
    dispatch(fetchDesignations());
    return () => {
      dispatch(clearDesignationStatus());
    };
  }, [dispatch]);

  const onAdd = async (name, toast) => {
    const action = await dispatch(addDesignation({ name }));
    if (addDesignation.fulfilled.match(action)) {
      toast(action.payload?.message || "Designation created successfully.");
    } else {
      toast(action.payload || "Unable to add designation.");
    }
  };

  const onUpdate = async (id, name, toast) => {
    const action = await dispatch(updateDesignation({ id, name }));
    if (updateDesignation.fulfilled.match(action)) {
      toast(action.payload?.message || "Designation updated successfully.");
    } else {
      toast(action.payload || "Unable to update designation.");
    }
  };

  const onDelete = async (id, toast) => {
    const action = await dispatch(deleteDesignation({ id }));
    if (deleteDesignation.fulfilled.match(action)) {
      toast(action.payload?.message || "Designation deleted successfully.");
    } else {
      toast(action.payload || "Unable to delete designation.");
    }
  };

  const isEmpty = !loading && designations.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <TopNav />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/70">
          <p className="text-sm uppercase text-emerald-500 tracking-[0.3em]">People Success</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Designation Matrix</h1>
              <p className="text-gray-600 mt-2">
                Keep every role crystal clear so your teams understand their impact.
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
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl shadow">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold">We could not load designations</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchDesignations())}
              className="text-xs font-semibold text-amber-700 underline-offset-4 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/70 p-6">
          {loading && <SkeletonGrid />}
          {isEmpty && (
            <div className="border border-dashed border-emerald-200 rounded-2xl p-8 text-center bg-emerald-50/40">
              <p className="text-lg font-semibold text-emerald-800">No designations yet</p>
              <p className="text-sm text-emerald-600 mt-2">
                Add your leadership, management, and specialist roles to get started.
              </p>
            </div>
          )}

          <div className="mt-6">
            <DataTable
              title="Designations"
              items={designations}
              loading={loading}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Designation Name", accessor: "designation_name" },
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
        key={`designation-skeleton-${index}`}
        className="h-24 rounded-2xl bg-gradient-to-r from-emerald-100/60 via-white to-emerald-100 animate-pulse border border-white/60"
      />
    ))}
  </div>
);
