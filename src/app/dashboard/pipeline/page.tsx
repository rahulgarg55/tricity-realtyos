"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  Kanban,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Building,
  User,
  Eye,
  CheckCircle,
} from "lucide-react";

const STAGES = [
  { id: "NEW_LEAD", label: "New Lead", color: "border-blue-300" },
  { id: "CONTACTED", label: "Contacted", color: "border-indigo-300" },
  { id: "QUALIFIED", label: "Qualified", color: "border-sky-300" },
  { id: "SITE_VISIT_SCHEDULED", label: "Visit Scheduled", color: "border-purple-300" },
  { id: "SITE_VISIT_COMPLETED", label: "Visit Completed", color: "border-violet-300" },
  { id: "NEGOTIATION", label: "Negotiation", color: "border-amber-300" },
  { id: "BOOKING", label: "Booking", color: "border-emerald-300" },
  { id: "WON", label: "Won 🎉", color: "border-green-400" },
];

export default function PipelineKanbanPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?limit=150");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const moveStage = async (leadId: string, currentStage: string, direction: "next" | "prev") => {
    const currentIdx = STAGES.findIndex((s) => s.id === currentStage);
    if (currentIdx === -1) return;

    const targetIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx < 0 || targetIdx >= STAGES.length) return;

    const targetStage = STAGES[targetIdx].id;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: targetStage } : l))
    );

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: targetStage }),
      });
      fetchLeads();
    } catch (e) {
      console.error(e);
    }
  };

  const formatINR = (val?: number) => {
    if (!val) return "—";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  // Pipeline total summary
  const totalPipelineRevenue = leads.reduce((acc, l) => acc + (l.expectedRevenue || l.budgetMax || 0), 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AppHeader
        title="Sales Pipeline Kanban"
        subtitle={`Total Pipeline Exposure: ${formatINR(totalPipelineRevenue)} across ${leads.length} leads`}
        onRefresh={fetchLeads}
      />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1700px] h-full items-start">
            {STAGES.map((col, idx) => {
              const colLeads = leads.filter((l) => l.stage === col.id);
              const colRevenue = colLeads.reduce(
                (acc, l) => acc + (l.expectedRevenue || l.budgetMax || 0),
                0
              );

              return (
                <div
                  key={col.id}
                  className={`w-72 bg-slate-100/80 rounded-2xl border ${col.color} p-3 flex flex-col max-h-[calc(100vh-180px)] shrink-0`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{col.label}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {formatINR(colRevenue)}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-white rounded-full text-[10px] font-bold text-slate-700 shadow-xs">
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {colLeads.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No deals here
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                href={`/dashboard/leads/${lead.id}`}
                                className="font-bold text-xs text-slate-900 hover:text-blue-600 line-clamp-1"
                              >
                                {lead.name}
                              </Link>
                              <span className="text-[11px] text-slate-500">{lead.phone}</span>
                            </div>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                lead.priority === "HOT"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 space-y-0.5">
                            <p className="font-semibold text-slate-800">
                              {formatINR(lead.expectedRevenue || lead.budgetMax)}
                            </p>
                            <p className="text-slate-500 truncate">
                              {lead.project?.name || lead.preferredLocation || "Tricity"}
                            </p>
                          </div>

                          {/* Quick stage move buttons */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              disabled={idx === 0}
                              onClick={() => moveStage(lead.id, lead.stage, "prev")}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                              title="Move to previous stage"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/dashboard/leads/${lead.id}`}
                              className="text-[10px] text-blue-600 font-semibold hover:underline"
                            >
                              Details
                            </Link>

                            <button
                              disabled={idx === STAGES.length - 1}
                              onClick={() => moveStage(lead.id, lead.stage, "next")}
                              className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 rounded"
                              title="Advance to next stage"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
