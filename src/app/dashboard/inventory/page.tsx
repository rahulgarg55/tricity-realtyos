"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  Home,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  DollarSign,
  X,
  UserCheck,
} from "lucide-react";

export default function InventoryMatrixPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Status update modal
  const [activeUnit, setActiveUnit] = useState<any>(null);
  const [targetStatus, setTargetStatus] = useState<string>("ON_HOLD");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [holdHours, setHoldHours] = useState(24);
  const [bookingAmount, setBookingAmount] = useState(100000);
  const [actionLoading, setActionLoading] = useState(false);

  // Add unit modal
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [newUnitData, setNewUnitData] = useState({
    projectId: "",
    unitNumber: "",
    tower: "Tower A",
    floor: 4,
    unitType: "3BHK",
    carpetAreaSqFt: 1450,
    superAreaSqFt: 1850,
    askingPrice: 8500000,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (projectFilter) params.append("projectId", projectFilter);
      if (statusFilter) params.append("status", statusFilter);

      const [resUnits, resProj, resLeads] = await Promise.all([
        fetch(`/api/inventory?${params.toString()}`),
        fetch("/api/projects"),
        fetch("/api/leads?limit=100"),
      ]);

      if (resUnits.ok) {
        const uData = await resUnits.json();
        setUnits(uData.units || []);
      }
      if (resProj.ok) {
        const pData = await resProj.json();
        setProjects(pData.projects || []);
        if (pData.projects?.length > 0 && !newUnitData.projectId) {
          setNewUnitData((prev) => ({ ...prev, projectId: pData.projects[0].id }));
        }
      }
      if (resLeads.ok) {
        const lData = await resLeads.json();
        setLeads(lData.leads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectFilter, statusFilter]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUnit) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/inventory/${activeUnit.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          leadId: selectedLeadId || null,
          holdHours,
          bookingAmount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActiveUnit(null);
        fetchData();
      } else {
        alert(data.error || "Failed to update inventory status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUnitData),
      });

      const data = await res.json();
      if (res.ok) {
        setAddUnitOpen(false);
        fetchData();
      } else {
        alert(data.error || "Failed to create unit");
      }
    } catch (e) {
      alert("Error adding unit");
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Property Inventory Matrix"
        subtitle="Live multi-tower unit availability, booking holds, and sales tracking"
        onRefresh={fetchData}
      />

      <div className="p-6 space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="BOOKED">Booked</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          <button
            onClick={() => setAddUnitOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory Unit</span>
          </button>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400">
              Loading inventory units...
            </div>
          ) : units.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-slate-400">
              No inventory units found for the selected filters.
            </div>
          ) : (
            units.map((unit) => {
              let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
              if (unit.status === "ON_HOLD") badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
              if (unit.status === "BOOKED") badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
              if (unit.status === "SOLD") badgeColor = "bg-slate-200 text-slate-800 border-slate-300";

              return (
                <div
                  key={unit.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-sm text-slate-900">{unit.unitNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                        {unit.status}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-600">{unit.project.name}</p>
                    <p className="text-[11px] text-slate-400">{unit.project.location}</p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block">Type</span>
                        <span className="font-semibold text-slate-800">{unit.unitType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Area</span>
                        <span className="font-semibold text-slate-800">{unit.carpetAreaSqFt} sq.ft</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Asking Price</span>
                        <span className="font-bold text-sm text-slate-900">
                          {formatPrice(unit.askingPrice)}
                        </span>
                      </div>
                    </div>

                    {unit.status === "ON_HOLD" && unit.heldUntil && (
                      <div className="p-2 bg-amber-50 rounded-lg text-[10px] text-amber-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Hold expires {new Date(unit.heldUntil).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    )}

                    {unit.lead && (
                      <p className="text-[11px] text-blue-600 font-medium truncate">
                        Attached: {unit.lead.name}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setActiveUnit(unit);
                        setTargetStatus(unit.status === "AVAILABLE" ? "ON_HOLD" : "BOOKED");
                        setSelectedLeadId(unit.leadId || "");
                      }}
                      className="w-full py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Change Status / Hold
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Change Status Modal */}
      {activeUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update Status: {activeUnit.unitNumber}
              </h3>
              <button onClick={() => setActiveUnit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="AVAILABLE">AVAILABLE (Release back to pool)</option>
                  <option value="ON_HOLD">ON HOLD (Temporary Reservation)</option>
                  <option value="BOOKED">BOOKED (Token Received)</option>
                  <option value="SOLD">SOLD (Sale Deed Completed)</option>
                </select>
              </div>

              {targetStatus !== "AVAILABLE" && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Attached Lead</label>
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="">-- Select Customer Lead --</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {targetStatus === "ON_HOLD" && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Hold Duration (Hours)</label>
                  <select
                    value={holdHours}
                    onChange={(e) => setHoldHours(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours (Standard)</option>
                    <option value={48}>48 Hours (Weekend Hold)</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              )}

              {(targetStatus === "ON_HOLD" || targetStatus === "BOOKED") && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Token / Advance (INR)</label>
                  <input
                    type="number"
                    value={bookingAmount}
                    onChange={(e) => setBookingAmount(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveUnit(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  {actionLoading ? "Updating..." : "Confirm Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {addUnitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Inventory Unit</h3>
              <button onClick={() => setAddUnitOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project *</label>
                <select
                  required
                  value={newUnitData.projectId}
                  onChange={(e) => setNewUnitData({ ...newUnitData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tower B - 604"
                    value={newUnitData.unitNumber}
                    onChange={(e) => setNewUnitData({ ...newUnitData, unitNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tower / Block</label>
                  <input
                    type="text"
                    placeholder="e.g. Tower B"
                    value={newUnitData.tower}
                    onChange={(e) => setNewUnitData({ ...newUnitData, tower: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Floor</label>
                  <input
                    type="number"
                    value={newUnitData.floor}
                    onChange={(e) => setNewUnitData({ ...newUnitData, floor: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit Type</label>
                  <select
                    value={newUnitData.unitType}
                    onChange={(e) => setNewUnitData({ ...newUnitData, unitType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial SCO">Commercial SCO</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Carpet (sq.ft)</label>
                  <input
                    type="number"
                    value={newUnitData.carpetAreaSqFt}
                    onChange={(e) => setNewUnitData({ ...newUnitData, carpetAreaSqFt: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Asking Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={newUnitData.askingPrice}
                  onChange={(e) => setNewUnitData({ ...newUnitData, askingPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddUnitOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  {actionLoading ? "Adding..." : "Save Unit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
