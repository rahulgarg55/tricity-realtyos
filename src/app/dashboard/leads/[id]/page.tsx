"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Clock,
  MessageSquare,
  CheckCircle2,
  CalendarCheck,
  AlertCircle,
  Plus,
  Send,
  Trash2,
} from "lucide-react";

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("11:30 AM - 12:30 PM");
  const [visitLoading, setVisitLoading] = useState(false);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
      } else {
        alert("Failed to load lead or unauthorized");
        router.push("/dashboard/leads");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const handleStageChange = async (newStage: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        fetchLead();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNoteLoading(true);
    try {
      const existingNotes = lead.notes ? `${lead.notes}\n---\n` : "";
      const updatedNotes = `${existingNotes}[${new Date().toLocaleDateString("en-IN")}] ${newNote}`;

      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes }),
      });

      if (res.ok) {
        setNewNote("");
        fetchLead();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate || !lead.projectId) {
      alert("Please ensure a project is selected for this lead before scheduling.");
      return;
    }
    setVisitLoading(true);
    try {
      const res = await fetch("/api/site-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          projectId: lead.projectId,
          scheduledDate: visitDate,
          timeSlot: visitTime,
          sendWhatsAppConfirmation: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setVisitModalOpen(false);
        fetchLead();
      } else {
        alert(data.error || "Failed to schedule visit");
      }
    } catch (e) {
      alert("Error scheduling visit");
    } finally {
      setVisitLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!confirm(`Are you sure you want to archive lead '${lead.name}'?`)) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/leads");
      } else {
        alert("Failed to archive lead");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading customer details...</div>;
  }

  if (!lead) return null;

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title={lead.name}
        subtitle={`Lead ID: ${lead.id.substring(0, 8)} • Source: ${lead.leadSource}`}
      />

      <div className="p-6 space-y-6">
        {/* Navigation back and header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/leads"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                  {lead.priority}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> {lead.phone}
                </span>
                {lead.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" /> {lead.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" /> {lead.preferredLocation || "Tricity"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Stage Selector */}
            <select
              value={lead.stage}
              onChange={(e) => handleStageChange(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NEW_LEAD">New Lead</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="SITE_VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="SITE_VISIT_COMPLETED">Visit Completed</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="BOOKING">Booking</option>
              <option value="WON">Won 🎉</option>
              <option value="LOST">Lost</option>
            </select>

            <button
              onClick={() => setVisitModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Schedule Visit</span>
            </button>

            <Link
              href={`/dashboard/whatsapp?leadId=${lead.id}&phone=${lead.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </Link>

            <button
              onClick={handleDeleteLead}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Archive Lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lead Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Requirements & Info */}
          <div className="space-y-6">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Property Preferences
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Preferred Area</span>
                  <span className="font-semibold text-slate-800">
                    {lead.preferredLocation || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Property Type</span>
                  <span className="font-semibold text-slate-800">
                    {lead.propertyType || "Any unit"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Max Budget</span>
                  <span className="font-semibold text-slate-800">
                    {lead.budgetMax ? `₹${(lead.budgetMax / 100000).toFixed(1)} Lakh` : "Flexible"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Project Interest</span>
                  <span className="font-semibold text-slate-800">
                    {lead.project?.name || "None assigned"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Assigned Consultant</span>
                  <span className="font-semibold text-slate-800">
                    {lead.assignedUser?.name || "Unassigned"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Next Follow-up</span>
                  <span className="font-semibold text-slate-800">
                    {lead.nextFollowUpDate
                      ? new Date(lead.nextFollowUpDate).toLocaleDateString("en-IN")
                      : "None set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Site Visits for this lead */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Site Visits ({lead.siteVisits?.length || 0})
              </h3>
              {lead.siteVisits?.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No visits scheduled yet.</p>
              ) : (
                <div className="space-y-2">
                  {lead.siteVisits.map((sv: any) => (
                    <div
                      key={sv.id}
                      className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1"
                    >
                      <div className="flex justify-between font-semibold text-purple-950">
                        <span>{sv.project.name}</span>
                        <span className="uppercase text-[10px] px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">
                          {sv.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {new Date(sv.scheduledDate).toLocaleDateString("en-IN")} • {sv.timeSlot}
                      </p>
                      {sv.clientFeedback && (
                        <p className="text-slate-700 italic pt-1">"{sv.clientFeedback}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interaction Timeline & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add note card */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Add Discussion Note or Call Log</h3>
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record call summary, pricing discussed, or client specific requests..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={noteLoading || !newNote.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Activity History Timeline */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Activity Timeline & Audit Trail
              </h3>

              <div className="space-y-4">
                {lead.activities?.map((act: any) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mt-0.5 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 border-b border-slate-100 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{act.title}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(act.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Schedule Site Visit for {lead.name}</h3>
            <form onSubmit={handleScheduleVisit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Date *</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                  <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  <option value="05:30 PM - 06:30 PM">05:30 PM - 06:30 PM</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                An automated WhatsApp confirmation with project Google Maps coordinates will be sent to{" "}
                <span className="font-semibold text-purple-900">{lead.phone}</span>.
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVisitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={visitLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  {visitLoading ? "Scheduling..." : "Confirm Visit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
