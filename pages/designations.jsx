import React, { useEffect, useState } from "react";
import TopNav from "../components/top_nav";
import Footer from "../components/footer";
import DataTable from "../components/table";

export default function DesignationsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/designations/");
    const d = await res.json();
    setData(d.designations || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (name, toast) => {
    const res = await fetch("/api/designations/add/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const d = await res.json();
    toast(d.message);
    load();
  };

  const update = async (id, name, toast) => {
    const res = await fetch(`/api/designations/update/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const d = await res.json();
    toast(d.message);
    load();
  };

  const remove = async (id, toast) => {
    const res = await fetch(`/api/designations/delete/${id}/`, {
      method: "DELETE",
    });
    const d = await res.json();
    toast(d.message);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      <div className="container mx-auto px-6 py-6">
        <DataTable
          title="Designations"
          items={data}
          loading={loading}
          columns={[
            { header: "ID", accessor: "id" },
            { header: "Designation Name", accessor: "designation_name" },
          ]}
          onAdd={add}
          onUpdate={update}
          onDelete={remove}
        />
      </div>

      <Footer />
    </div>
  );
}
