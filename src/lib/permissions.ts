export type UserRole =
  | "SUPER_ADMIN"
  | "OWNER"
  | "ADMIN"
  | "SALES_MANAGER"
  | "SALES_REP"
  | "VIEWER";

export interface PermissionCheck {
  canManageOrganization: boolean;
  canManageUsers: boolean;
  canManageBilling: boolean;
  canCreateProject: boolean;
  canEditInventory: boolean;
  canBookInventory: boolean;
  canViewAllLeads: boolean;
  canExportLeads: boolean;
  canImportLeads: boolean;
  canDeleteLeads: boolean;
  canReassignLeads: boolean;
  canManageWhatsApp: boolean;
  canViewReports: boolean;
  canAccessPlatformAdmin: boolean;
}

export function getRolePermissions(role: UserRole | string, isSuperAdmin: boolean = false): PermissionCheck {
  if (isSuperAdmin || role === "SUPER_ADMIN") {
    return {
      canManageOrganization: true,
      canManageUsers: true,
      canManageBilling: true,
      canCreateProject: true,
      canEditInventory: true,
      canBookInventory: true,
      canViewAllLeads: true,
      canExportLeads: true,
      canImportLeads: true,
      canDeleteLeads: true,
      canReassignLeads: true,
      canManageWhatsApp: true,
      canViewReports: true,
      canAccessPlatformAdmin: true,
    };
  }

  switch (role) {
    case "OWNER":
      return {
        canManageOrganization: true,
        canManageUsers: true,
        canManageBilling: true,
        canCreateProject: true,
        canEditInventory: true,
        canBookInventory: true,
        canViewAllLeads: true,
        canExportLeads: true,
        canImportLeads: true,
        canDeleteLeads: true,
        canReassignLeads: true,
        canManageWhatsApp: true,
        canViewReports: true,
        canAccessPlatformAdmin: false,
      };

    case "ADMIN":
      return {
        canManageOrganization: false,
        canManageUsers: true,
        canManageBilling: false,
        canCreateProject: true,
        canEditInventory: true,
        canBookInventory: true,
        canViewAllLeads: true,
        canExportLeads: true,
        canImportLeads: true,
        canDeleteLeads: true,
        canReassignLeads: true,
        canManageWhatsApp: true,
        canViewReports: true,
        canAccessPlatformAdmin: false,
      };

    case "SALES_MANAGER":
      return {
        canManageOrganization: false,
        canManageUsers: false,
        canManageBilling: false,
        canCreateProject: false,
        canEditInventory: true,
        canBookInventory: true,
        canViewAllLeads: true,
        canExportLeads: true,
        canImportLeads: true,
        canDeleteLeads: false,
        canReassignLeads: true,
        canManageWhatsApp: false,
        canViewReports: true,
        canAccessPlatformAdmin: false,
      };

    case "SALES_REP":
      return {
        canManageOrganization: false,
        canManageUsers: false,
        canManageBilling: false,
        canCreateProject: false,
        canEditInventory: false,
        canBookInventory: true, // Can place on hold or initiate booking
        canViewAllLeads: false, // Only view assigned leads or unassigned pool
        canExportLeads: false,
        canImportLeads: false,
        canDeleteLeads: false,
        canReassignLeads: false,
        canManageWhatsApp: false,
        canViewReports: false,
        canAccessPlatformAdmin: false,
      };

    case "VIEWER":
    default:
      return {
        canManageOrganization: false,
        canManageUsers: false,
        canManageBilling: false,
        canCreateProject: false,
        canEditInventory: false,
        canBookInventory: false,
        canViewAllLeads: true,
        canExportLeads: false,
        canImportLeads: false,
        canDeleteLeads: false,
        canReassignLeads: false,
        canManageWhatsApp: false,
        canViewReports: true,
        canAccessPlatformAdmin: false,
      };
  }
}
