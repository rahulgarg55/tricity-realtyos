"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  CalendarCheck,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  MessageSquare,
  X,
  Filter,
} from "lucide-react";

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [activeVisit, setActiveVisit] = useState<any>(null);
  const [outcome, setOutcome] = useState("VERY_INTERESTED");
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/api/site-visits?status=${statusFilter}` : "/api/site-visits";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVisits(data.visits || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [statusFilter]);

  const handleCompleteVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisit) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/site-visits/${activeVisit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          outcome,
          clientFeedback: feedback,
        }),
      });

      if (res.ok) {
        setActiveVisit(null);
        setFeedback("");
        fetchVisits();
      } else {
        alert("Failed to update visit");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (visitId: string, targetStatus: string) => {
    try {
      const res = await fetch(`/api/site-visits/${visitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.ok) {
        fetchVisits();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Site Visits & Appointments"
        subtitle="Manage client property viewings, experience center walkthroughs, and outcomes"
        onRefresh={fetchVisits}
      />

      <div className="p-6 space-y-4">
        {/* Filter bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Filter by Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700"
            >
              <option value="">All Visits</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            Total Viewings: <span className="font-bold text-slate-900">{visits.length}</span>
          </span>
        </div>

        {/* Visits List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading site visits...</div>
          ) : visits.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              No site visits found matching this filter.
            </div>
          ) : (
            visits.map((v) => {
              let badgeColor = "bg-purple-100 text-purple-800 border-purple-200";
              if (v.status === "COMPLETED") badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
              if (v.status === "CANCELLED") badgeColor = "bg-red-100 text-red-800 border-red-200";
              if (v.status === "NO_SHOW") badgeColor = "bg-amber-100 text-amber-800 border-amber-200";

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0 mt-0.5">
                      <CalendarCheck className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/leads/${v.lead.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-blue-600"
                        >
                          {v.lead.name}
                        </Link>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                          {v.status}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-700">
                        {v.project.name} {v.inventoryUnit && `(${v.inventoryUnit.unitNumber})`}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(v.scheduledDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}{" "}
                          • {v.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {v.lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          Rep: {v.assignedUser.name}
                        </span>
                      </div>

                      {v.clientFeedback && (
                        <p className="text-xs text-slate-600 italic pt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          Feedback: "{v.clientFeedback}" (Outcome: {v.outcome?.replace(/_/g, " ")})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    {v.status === "SCHEDULED" && (
                      <button
                        onClick={() => handleUpdateStatus(v.id, "CONFIRMED")}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Confirm
                      </button>
                    )}

                    {v.status !== "COMPLETED" && v.status !== "CANCELLED" && (
                      <button
                        onClick={() => setActiveVisit(v)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
                      >
                        Record Outcome
                      </button>
                    )}

                    {v.status !== "CANCELLED" && v.status !== "COMPLETED" && (
                      <button
                        onClick={() => handleUpdateStatus(v.id, "CANCELLED")}
                        className="px-2.5 py-1.5 text-slate-400 hover:text-red-600 text-xs rounded-lg"
                        title="Cancel Visit"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Record Outcome Modal */}
      {activeVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Site Visit Outcome: {activeVisit.lead.name}
              </h3>
              <button onClick={() => setActiveVisit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteVisit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Visit Outcome *</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="VERY_INTERESTED">🔥 Very Interested (Ready to negotiate)</option>
                  <option value="REQUESTED_PRICE_QUOTE">Requested Detailed Payment Schedule</option>
                  <option value="NEGOTIATING">Negotiating Floor / Unit Pricing</option>
                  <option value="NOT_INTERESTED">Not Interested / Location Mismatch</option>
                  <option value="RESCHEDULE_REQUESTED">Family Visit Reschedule Needed</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Client Feedback & Next Steps</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Loved sample flat 3BHK; requested bank loan sanction assistance."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveVisit(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  {actionLoading ? "Saving..." : "Save Outcome"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
