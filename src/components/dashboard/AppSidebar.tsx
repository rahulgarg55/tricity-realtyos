"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Users,
  Kanban,
  Home,
  FolderKanban,
  CalendarCheck,
  CheckSquare,
  MessageSquare,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    isSuperAdmin?: boolean;
  };
  organization: {
    name: string;
    subscriptionTier: string;
    city: string;
  } | null;
}

export function AppSidebar({ user, organization }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Leads CRM", href: "/dashboard/leads", icon: Users },
    { label: "Sales Pipeline", href: "/dashboard/pipeline", icon: Kanban },
    { label: "Inventory Matrix", href: "/dashboard/inventory", icon: Home },
    { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { label: "Site Visits", href: "/dashboard/site-visits", icon: CalendarCheck },
    { label: "Tasks & Follow-ups", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "WhatsApp Hub", href: "/dashboard/whatsapp", icon: MessageSquare },
    { label: "Settings & Billing", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Brand & Organization */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-white tracking-tight truncate">
              Tricity RealtyOS
            </h1>
            <p className="text-[11px] text-blue-400 font-medium truncate">
              {organization ? organization.name : "Platform Super Admin"}
            </p>
          </div>
        </div>

        {organization && (
          <div className="mt-3 px-2.5 py-1.5 bg-slate-800/80 rounded-lg flex items-center justify-between text-[11px] border border-slate-700/50">
            <span className="text-slate-400 font-medium">Plan Tier</span>
            <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 rounded font-bold uppercase tracking-wider text-[10px]">
              {organization.subscriptionTier}
            </span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Sales Operations
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
            </Link>
          );
        })}

        {/* Super Admin Access */}
        {user.isSuperAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-500/90">
                Platform Admin
              </p>
            </div>
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-amber-600 text-white"
                  : "text-amber-400 hover:bg-slate-800"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Super Admin Portal</span>
            </Link>
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {user.role} • {organization?.city || "Tricity"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
