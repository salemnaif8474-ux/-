import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { EmployeeRatings } from "./pages/EmployeeRatings";
import { Chats } from "./pages/Chats";
import { CustomerAssignments } from "./pages/CustomerAssignments";
import { EmployeeManagement } from "./pages/EmployeeManagement";
import { Targets } from "./pages/Targets";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/customers" element={<CustomerAssignments />} />
          <Route path="/ratings" element={<EmployeeRatings />} />
          <Route path="/employees" element={<EmployeeManagement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
