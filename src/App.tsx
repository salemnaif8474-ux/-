import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { EmployeeRatings } from "./pages/EmployeeRatings";
import { Chats } from "./pages/Chats";
import { CustomerAssignments } from "./pages/CustomerAssignments";
import { EmployeeManagement } from "./pages/EmployeeManagement";
import { Targets } from "./pages/Targets";
import { Profile } from "./pages/Profile";
import { Hub } from "./pages/Hub";
import { AuditHub } from "./pages/hubs/AuditHub";
import { ROLES_EXCEPT_PREPARER } from "./data/navConfig";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/targets"
                element={
                  <ProtectedRoute roles={ROLES_EXCEPT_PREPARER}>
                    <Targets />
                  </ProtectedRoute>
                }
              />
              <Route path="/chats" element={<Chats />} />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute roles={["seller", "owner", "manager", "branch_manager"]}>
                    <CustomerAssignments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ratings"
                element={
                  <ProtectedRoute roles={["owner"]}>
                    <EmployeeRatings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute roles={["owner", "manager", "it", "hr"]}>
                    <EmployeeManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/hub" element={<Hub />} />
              <Route
                path="/audit"
                element={
                  <ProtectedRoute roles={["owner", "manager", "review"]}>
                    <AuditHub />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
