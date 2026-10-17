import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DemoSwitcher } from "@/components/DemoSwitcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      organization: true,
    },
  });

  if (!user || !user.isActive) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AppSidebar
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
          isSuperAdmin: user.isSuperAdmin,
        }}
        organization={
          user.organization
            ? {
                name: user.organization.name,
                subscriptionTier: user.organization.subscriptionTier,
                city: user.organization.city,
              }
            : null
        }
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>

      <DemoSwitcher />
    </div>
  );
}
