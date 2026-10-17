import { describe, it, expect } from "vitest";
import { getRolePermissions } from "@/lib/permissions";

describe("RBAC Permissions Matrix Tests", () => {
  it("SUPER_ADMIN should have platform admin and all organization permissions", () => {
    const perms = getRolePermissions("SUPER_ADMIN", true);
    expect(perms.canAccessPlatformAdmin).toBe(true);
    expect(perms.canManageOrganization).toBe(true);
    expect(perms.canManageBilling).toBe(true);
    expect(perms.canDeleteLeads).toBe(true);
  });

  it("OWNER should have full organization permissions but no platform admin access", () => {
    const perms = getRolePermissions("OWNER", false);
    expect(perms.canAccessPlatformAdmin).toBe(false);
    expect(perms.canManageOrganization).toBe(true);
    expect(perms.canManageBilling).toBe(true);
    expect(perms.canCreateProject).toBe(true);
    expect(perms.canDeleteLeads).toBe(true);
  });

  it("SALES_REP should have restricted permissions (cannot manage billing, delete leads, or view all leads)", () => {
    const perms = getRolePermissions("SALES_REP", false);
    expect(perms.canAccessPlatformAdmin).toBe(false);
    expect(perms.canManageBilling).toBe(false);
    expect(perms.canManageOrganization).toBe(false);
    expect(perms.canDeleteLeads).toBe(false);
    expect(perms.canExportLeads).toBe(false);
    expect(perms.canViewAllLeads).toBe(false);
    expect(perms.canBookInventory).toBe(true); // can place hold/initiate booking
  });

  it("VIEWER should have strictly read-only access", () => {
    const perms = getRolePermissions("VIEWER", false);
    expect(perms.canCreateProject).toBe(false);
    expect(perms.canEditInventory).toBe(false);
    expect(perms.canBookInventory).toBe(false);
    expect(perms.canDeleteLeads).toBe(false);
    expect(perms.canExportLeads).toBe(false);
    expect(perms.canViewAllLeads).toBe(true);
  });
});
