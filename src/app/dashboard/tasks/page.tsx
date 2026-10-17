"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  CheckSquare,
  AlertCircle,
  Clock,
  Phone,
  Plus,
  CheckCircle2,
  Calendar,
  X,
  User,
} from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "overdue" | "pending" | "completed">("pending");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    leadId: "",
    type: "CALL",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = "/api/tasks";
      if (filterMode === "overdue") url = "/api/tasks?overdue=true";
      else if (filterMode === "pending") url = "/api/tasks?isCompleted=false";
      else if (filterMode === "completed") url = "/api/tasks?isCompleted=true";

      const [resTasks, resLeads] = await Promise.all([
        fetch(url),
        fetch("/api/leads?limit=100"),
      ]);

      if (resTasks.ok) {
        const data = await resTasks.json();
        setTasks(data.tasks || []);
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
    fetchTasks();
  }, [filterMode]);

  const toggleTaskCompletion = async (taskId: string, currentCompleted: boolean) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentCompleted }),
      });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskData),
      });

      if (res.ok) {
        setAddModalOpen(false);
        setNewTaskData({
          title: "",
          leadId: "",
          type: "CALL",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          notes: "",
        });
        fetchTasks();
      } else {
        alert("Failed to create task");
      }
    } catch (e) {
      alert("Error adding task");
    } finally {
      setActionLoading(false);
    }
  };

  const now = new Date();

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Follow-ups & Task Automation"
        subtitle="Ensure zero missed customer callbacks, site visit pickups, and quote deliveries"
        onRefresh={fetchTasks}
      />

      <div className="p-6 space-y-4">
        {/* Filter tabs and Add Task */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterMode("pending")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === "pending" ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterMode("overdue")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === "overdue" ? "bg-red-50 text-red-600 shadow-sm font-bold" : "hover:text-slate-900"
              }`}
            >
              ⚠️ Overdue
            </button>
            <button
              onClick={() => setFilterMode("completed")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === "completed" ? "bg-white text-emerald-600 shadow-sm" : "hover:text-slate-900"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === "all" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"
              }`}
            >
              All
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>

        {/* Task Cards */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading follow-ups...</div>
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              No follow-up tasks in this view.
            </div>
          ) : (
            tasks.map((task) => {
              const isOverdue = !task.isCompleted && new Date(task.dueDate) < now;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-shadow flex items-start justify-between gap-4 ${
                    task.isCompleted
                      ? "bg-slate-50/70 border-slate-200 opacity-70"
                      : isOverdue
                      ? "bg-red-50/40 border-red-200 shadow-sm"
                      : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                      className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                        task.isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 text-transparent hover:border-slate-400"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-bold text-xs ${
                            task.isCompleted
                              ? "line-through text-slate-400"
                              : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </p>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            task.priority === "URGENT" || task.priority === "HIGH"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.lead && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <Link
                            href={`/dashboard/leads/${task.lead.id}`}
                            className="font-semibold text-blue-600 hover:underline"
                          >
                            {task.lead.name}
                          </Link>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            {task.lead.phone}
                          </span>
                        </div>
                      )}

                      {task.notes && (
                        <p className="text-[11px] text-slate-500">{task.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[11px] font-semibold block ${
                        isOverdue ? "text-red-600 font-bold" : "text-slate-500"
                      }`}
                    >
                      {isOverdue && "⚠️ "}
                      Due: {new Date(task.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Rep: {task.assignedUser?.name}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Follow-up Task</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call client regarding loan sanction letter"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Attached Lead</label>
                <select
                  value={newTaskData.leadId}
                  onChange={(e) => setNewTaskData({ ...newTaskData, leadId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="">-- General Team Follow-up --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="URGENT">Urgent (Today)</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Additional context for sales rep..."
                  value={newTaskData.notes}
                  onChange={(e) => setNewTaskData({ ...newTaskData, notes: e.target.value })}
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
                  {actionLoading ? "Scheduling..." : "Save Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
