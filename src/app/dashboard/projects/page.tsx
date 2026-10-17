"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  FolderKanban,
  Building,
  Plus,
  MapPin,
  FileText,
  Home,
  Users,
  CalendarCheck,
  ShieldCheck,
  X,
} from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    developer: "",
    location: "",
    city: "Mohali",
    projectType: "Residential",
    startingPrice: 7500000,
    status: "UNDER_CONSTRUCTION",
    reraNumber: "",
    description: "",
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setAddModalOpen(false);
        fetchProjects();
      } else {
        alert(data.error || "Failed to create project");
      }
    } catch (e) {
      alert("Error adding project");
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (val?: number) => {
    if (!val) return "On Request";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Real Estate Projects Catalog"
        subtitle="Townships, high-rise luxury developments & commercial hubs across Tricity"
        onRefresh={fetchProjects}
      />

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-600 font-medium">
            Active Projects: <span className="font-bold text-slate-900">{projects.length}</span>
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400">
              Loading projects catalog...
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400">
              No projects added yet. Click "Add Project" above.
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-tight">
                        {proj.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{proj.developer}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {proj.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>
                      {proj.location}, {proj.city}
                    </span>
                  </div>

                  {proj.reraNumber && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>RERA: {proj.reraNumber}</span>
                    </div>
                  )}

                  {proj.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Units</span>
                      <span className="font-bold text-xs text-slate-800">
                        {proj._count?.units || 0}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Inquiries</span>
                      <span className="font-bold text-xs text-slate-800">
                        {proj._count?.leads || 0}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-medium">Visits</span>
                      <span className="font-bold text-xs text-slate-800">
                        {proj._count?.siteVisits || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Starting from</span>
                  <span className="font-bold text-sm text-slate-900">
                    {formatPrice(proj.startingPrice)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Real Estate Project</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Homes Mohali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Developer / Builder *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hero Realty"
                    value={formData.developer}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">City / Region</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Mohali">Mohali</option>
                    <option value="Zirakpur">Zirakpur</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="New Chandigarh">New Chandigarh</option>
                    <option value="Panchkula">Panchkula</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location Details *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 88, Mohali"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">RERA Number</label>
                  <input
                    type="text"
                    placeholder="PBRERA-SAS80-PR0099"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Starting Price (INR)</label>
                  <input
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Construction Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="UNDER_CONSTRUCTION">Under Construction</option>
                    <option value="READY_TO_MOVE">Ready To Move</option>
                    <option value="UPCOMING">Upcoming / Pre-Launch</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Overview Description</label>
                <textarea
                  rows={2}
                  placeholder="Key USPs, connectivity to Airport Road, club amenities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  {actionLoading ? "Saving..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
