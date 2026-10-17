"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/dashboard/AppHeader";
import {
  MessageSquare,
  Send,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function WhatsAppHubPage() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";
  const initialLeadId = searchParams.get("leadId") || "";

  const [toPhone, setToPhone] = useState(initialPhone);
  const [messageBody, setMessageBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<any>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?limit=50");
      if (res.ok) {
        // Collect messages from all leads
        const data = await res.json();
        const allMsgs: any[] = [];
        data.leads.forEach((l: any) => {
          if (l.whatsAppMessages) allMsgs.push(...l.whatsAppMessages);
        });
        setMessages(allMsgs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplate(templateType);
    if (templateType === "VISIT") {
      setMessageBody(
        "Hello! Your site visit for Sushma Grande Zirakpur has been scheduled for tomorrow at 11:30 AM. Our sales consultant will meet you at the site experience centre. Location: https://maps.google.com/?q=Sushma+Grande+Zirakpur. See you there! - Tricity RealtyOS Team"
      );
    } else if (templateType === "BROCHURE") {
      setMessageBody(
        "Hello, thank you for inquiring about our luxury 3BHK residences in Mohali Sector 82. Here is the official project brochure and layout plans: https://tricityrealtyos.com/brochures/mohali-3bhk.pdf. Feel free to reply here if you'd like to schedule a private walkthrough!"
      );
    } else if (templateType === "FOLLOWUP") {
      setMessageBody(
        "Hi, this is your property advisor following up regarding your apartment requirement in Tricity. Are you available for a brief 2-minute call today?"
      );
    } else {
      setMessageBody("");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toPhone || !messageBody.trim()) return;
    setSending(true);
    setStatusFeedback(null);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: initialLeadId || null,
          toNumber: toPhone,
          messageBody,
          templateName: selectedTemplate || "custom_message",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusFeedback(data);
        setMessageBody("");
        fetchMessages();
      } else {
        alert(data.error || "Failed to dispatch message");
      }
    } catch (err) {
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Official WhatsApp Business Cloud Hub"
        subtitle="Meta Graph API verified messaging, template dispatch, and customer conversation audit trail"
      />

      <div className="p-6 space-y-6">
        {/* Status banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-emerald-950">Official Meta WhatsApp Cloud API Ready</p>
              <p className="text-emerald-700">
                Webhook listener active with HMAC SHA256 signature verification and sandbox testing fallback.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] uppercase tracking-wider">
            Active / Sandbox Ready
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Message Compose & Templates */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Dispatch WhatsApp Message
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Pre-Approved Templates</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTemplateSelect("VISIT")}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                    selectedTemplate === "VISIT"
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-bold text-[11px]">Site Visit</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Confirmation & Map</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateSelect("BROCHURE")}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                    selectedTemplate === "BROCHURE"
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-bold text-[11px]">Brochure</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Floor plans & PDF</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleTemplateSelect("FOLLOWUP")}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                    selectedTemplate === "FOLLOWUP"
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-bold text-[11px]">Follow-up</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Quick 2-min call</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Customer Mobile (+91) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98150 12345"
                  value={toPhone}
                  onChange={(e) => setToPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Message Body *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type message or select a template above..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
                />
              </div>

              {statusFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <p className="font-bold">✔ Message Dispatched Successfully!</p>
                  <p className="text-[11px]">
                    Message ID: <code className="font-mono">{statusFeedback.messageId}</code>
                  </p>
                  {statusFeedback.isMock && (
                    <p className="text-[10px] text-emerald-600">
                      ℹ️ Dispatched via Dev Sandbox Mode. Live delivery is triggered when live Meta token is configured.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={sending || !messageBody.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? "Sending..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Message Audit History */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Recent Message Deliveries & Audit
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No WhatsApp messages dispatched yet. Send your first template on the left!
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{m.toNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{m.messageBody}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>ID: {m.whatsappMessageId}</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString("en-IN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
