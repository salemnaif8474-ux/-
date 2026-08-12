import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isRoleAllowed } from "../lib/chatAccess";
import type { Role } from "../types";

export function ProtectedRoute({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { currentEmployee } = useAuth();
  if (!currentEmployee) return <Navigate to="/app/login" replace />;
  if (!isRoleAllowed(currentEmployee.role, roles)) {
    return (
      <div className="rounded-xl border border-status-bad bg-status-bad-bg p-6 text-sm text-status-bad">
        لا تملك صلاحية الوصول لهذا القسم. تواصل مع الإدارة أو IT لو تحتاج صلاحية إضافية.
      </div>
    );
  }
  return <>{children}</>;
}
