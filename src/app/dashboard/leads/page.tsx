"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  Users,
  Search,
  Filter,
  Download,
  Upload,
  Phone,
  MessageSquare,
  Eye,
  Calendar,
  AlertCircle,
  Plus,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredLocation?: string;
  propertyType?: string;
  budgetMax?: number;
  leadSource: string;
  priority: string;
  stage: string;
  nextFollowUpDate?: string;
  project?: { name: string };
  assignedUser?: { name: string };
}

export default function LeadsCrmPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importReport, setImportReport] = useState<any>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (stageFilter) params.append("stage", stageFilter);
      if (priorityFilter) params.append("priority", priorityFilter);

      const res = await fetch(`/api/leads?${params.toString()}`);
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
  }, [stageFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportLoading(true);
    setImportReport(null);
    try {
      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: csvInput }),
      });

      const data = await res.json();
      if (res.ok) {
        setImportReport(data);
        fetchLeads();
      } else {
        alert(data.error || "Failed to import CSV");
      }
    } catch (err) {
      alert("Error uploading CSV");
    } finally {
      setImportLoading(false);
    }
  };

  const formatBudget = (val?: number) => {
    if (!val) return "—";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Lead Management CRM"
        subtitle="Manage customer inquiries across Chandigarh, Mohali, Zirakpur & Panchkula"
        onRefresh={fetchLeads}
      />

      <div className="p-6 space-y-4">
        {/* Actions bar & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Stage filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none"
            >
              <option value="">All Pipeline Stages</option>
              <option value="NEW_LEAD">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="SITE_VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="SITE_VISIT_COMPLETED">Visit Completed</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="BOOKING">Booking</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none"
            >
              <option value="">All Priorities</option>
              <option value="HOT">🔥 Hot</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Import CSV</span>
            </button>

            <a
              href="/api/leads/export"
              download
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Location / Requirement</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Project Interest</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Assigned Rep</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      Loading leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      No leads matching the criteria. Click "New Lead" or "Import CSV" to get started.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    let priorityBadge = "bg-slate-100 text-slate-700";
                    if (lead.priority === "HOT") priorityBadge = "bg-red-100 text-red-700 font-bold";
                    if (lead.priority === "HIGH") priorityBadge = "bg-amber-100 text-amber-700";
                    if (lead.priority === "MEDIUM") priorityBadge = "bg-blue-100 text-blue-700";

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 block"
                          >
                            {lead.name}
                          </Link>
                          <span className="text-[11px] text-slate-500">{lead.phone}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-800 block">
                            {lead.preferredLocation || "Tricity Region"}
                          </span>
                          <span className="text-[11px] text-slate-500">{lead.propertyType || "Any"}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {formatBudget(lead.budgetMax)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-700">
                            {lead.project?.name || "General Inquiry"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${priorityBadge}`}>
                            {lead.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
                            {lead.stage.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {lead.assignedUser?.name || "Unassigned"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:${lead.phone}`}
                              title="Direct Phone Call"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <Link
                              href={`/dashboard/whatsapp?leadId=${lead.id}&phone=${lead.phone}`}
                              title="Chat on WhatsApp"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/dashboard/leads/${lead.id}`}
                              title="View Lead Timeline"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Bulk CSV Lead Importer</h3>
              </div>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCsvImport} className="space-y-3.5 text-xs">
              <p className="text-slate-500">
                Paste raw CSV data or sample leads below. Headers supported:{" "}
                <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono">
                  Name, Phone, Location, Type, Budget, Source, Notes
                </code>
              </p>

              <textarea
                rows={6}
                required
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder={`Name,Phone,Location,Type,Budget,Source,Notes\nHarish Sethi,9814099881,Mohali Sector 82,3BHK,8500000,MagicBricks,Ready to buy within 30 days\nManpreet Singh,9815044332,Zirakpur PR7,2BHK,5500000,Walk-in,Interested in 1st floor\nSimranjit Kaur,9876511223,Chandigarh Sec 34,4BHK,14000000,Referral,Doctor looking for luxury unit`}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {importReport && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="font-bold text-emerald-600">
                    ✔ Successfully imported {importReport.importedCount} leads!
                  </p>
                  {importReport.duplicateCount > 0 && (
                    <p className="text-amber-600 font-medium">
                      ⚠️ Skipped {importReport.duplicateCount} duplicate phone numbers.
                    </p>
                  )}
                  {importReport.errorCount > 0 && (
                    <p className="text-red-600 font-medium">
                      ❌ {importReport.errorCount} rows had invalid formatting.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={importLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                >
                  {importLoading ? "Validating & Importing..." : "Start Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
