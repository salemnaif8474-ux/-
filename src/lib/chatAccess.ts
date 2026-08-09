import type { Role } from "../types";

export const THREAD_VIEWER_ROLES: Role[] = ["owner", "manager"];

/**
 * Determines which employee_manager thread a viewer sees. Regular employees
 * always get their own thread regardless of any UI-selected id, so a stale
 * selection can never leak someone else's private conversation.
 */
export function getEffectiveThreadId(
  currentEmployeeId: string,
  currentRole: Role,
  selectedThreadId: string | null,
): string | null {
  if (THREAD_VIEWER_ROLES.includes(currentRole)) return selectedThreadId;
  return currentEmployeeId;
}

export function isRoleAllowed(role: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(role);
}
