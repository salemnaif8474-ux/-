import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isRoleAllowed } from "../lib/chatAccess";
import { can, type Capability } from "../lib/permissions";
import type { Role } from "../types";

export function ProtectedRoute({
  roles,
  capability,
  children,
}: {
  roles?: Role[];
  capability?: Capability;
  children: React.ReactNode;
}) {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return <Navigate to="/login" replace />;

  const roleOk = !roles || isRoleAllowed(currentEmployee.role, roles);
  const capabilityOk = !capability || can(currentEmployee.role, capability);

  if (!roleOk || !capabilityOk) {
    return (
      <div className="rounded-xl border border-status-bad bg-status-bad-bg p-6 text-sm text-status-bad">
        لا تملك صلاحية الوصول لهذا القسم. تواصل مع الإدارة أو IT لو تحتاج صلاحية إضافية.
      </div>
    );
  }
  return <>{children}</>;
}
